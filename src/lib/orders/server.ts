/*
|-----------------------------------------
| setting up server.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { createHash, randomBytes, randomInt, randomUUID } from "crypto";

import type { Filter } from "mongodb";

import { type Product } from "@/lib/dashboard/catalog";
import { couponDiscount, type Coupon } from "@/lib/dashboard/coupons";
import {
  type Order,
  type OrderApiErrorCode,
  type OrderCustomer,
  type OrderItemSnapshot,
  type OrderSettings,
  type ParsedOrderConfirmation,
  type OrderStatus,
  type ParsedCheckout,
} from "@/lib/dashboard/orders";
import { productsCollection } from "@/lib/models/catalog";
import { couponsCollection } from "@/lib/models/coupons";
import { checkoutLocksCollection, ordersCollection, orderSettingsCollection } from "@/lib/models/orders";
import { invalidatePublicProductCatalogCache } from "@/lib/products/server";

type SessionUser = {
  id?: string;
  email?: string | null;
  name?: string | null;
  mobileNumber?: string | null;
  address?: string | null;
};
export type CreateOrderResult =
  | { ok: true; order: Order }
  | { ok: false; status: number; code: OrderApiErrorCode; error: string; cooldownExpiresAt?: string };
export type IncompleteOrderQuoteResult =
  | {
      ok: true;
      quote: Pick<Order, "subtotal" | "tax" | "shipping" | "discount" | "couponCode" | "total" | "currency">;
    }
  | { ok: false; status: number; code: OrderApiErrorCode; error: string };

const products = productsCollection;
const orders = ordersCollection;
const orderSettings = orderSettingsCollection;
const coupons = () => couponsCollection<Coupon>();
const checkoutLocks = checkoutLocksCollection;
const INVENTORY_CHECKOUT_LOCK_ID = "system:inventory-checkout";
const ORDER_ID_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function createOrderId() {
  const letters = Array.from({ length: 2 }, () => ORDER_ID_LETTERS[randomInt(ORDER_ID_LETTERS.length)]).join("");
  return `${letters}-${randomInt(10_000).toString().padStart(4, "0")}`;
}

function priceFor(product: Product) {
  return product.discountPrice > 0 && product.discountPrice <= product.realPrice
    ? product.discountPrice
    : product.realPrice;
}

const money = (value: number) => Math.max(0, Math.round((value + Number.EPSILON) * 100) / 100);
const productTaxRate = (product: Product) =>
  typeof product.taxRate === "number" &&
  Number.isFinite(product.taxRate) &&
  product.taxRate >= 0 &&
  product.taxRate <= 100
    ? product.taxRate
    : 0;
const productShippingCost = (product: Product) =>
  typeof product.shippingCost === "number" && Number.isFinite(product.shippingCost) && product.shippingCost >= 0
    ? product.shippingCost
    : 0;

function customerFrom(sessionUser: SessionUser, input: ParsedCheckout["customer"]): OrderCustomer | null {
  const userId = sessionUser.id?.trim();
  const email = sessionUser.email?.trim().toLowerCase();
  if (!userId || !email) return null;
  return {
    userId,
    email,
    name: input.name || sessionUser.name?.trim() || email,
    phone: input.phone || sessionUser.mobileNumber?.trim() || "",
    address: input.address || sessionUser.address?.trim() || "",
  };
}

/** Reloads each product and uses an atomic stock decrement before persistence. */
export async function getOrderSettings() {
  const existing = await orderSettings().findOne({ key: "order-settings" });
  if (!existing) {
    return {
      key: "order-settings",
      allowOrdersWithoutStockCheck: true,
      orderLimitEnabled: false,
      orderLimitMinutes: 5,
      orderLimitMaxOrders: 1,
      updatedAt: new Date(0),
      updatedBy: "system",
    } satisfies OrderSettings;
  }
  return {
    key: "order-settings",
    // Existing settings records predate this field. They retain the approved permissive default.
    allowOrdersWithoutStockCheck:
      typeof existing.allowOrdersWithoutStockCheck === "boolean" ? existing.allowOrdersWithoutStockCheck : true,
    orderLimitEnabled: Boolean(existing.orderLimitEnabled),
    orderLimitMinutes:
      typeof existing.orderLimitMinutes === "number" && existing.orderLimitMinutes >= 1
        ? existing.orderLimitMinutes
        : 5,
    orderLimitMaxOrders:
      typeof existing.orderLimitMaxOrders === "number" && existing.orderLimitMaxOrders >= 1
        ? existing.orderLimitMaxOrders
        : 1,
    updatedAt: existing.updatedAt ?? new Date(0),
    updatedBy: existing.updatedBy ?? "system",
  } satisfies OrderSettings;
}

export async function updateOrderSettings(
  input: Pick<
    OrderSettings,
    "allowOrdersWithoutStockCheck" | "orderLimitEnabled" | "orderLimitMinutes" | "orderLimitMaxOrders"
  >,
  updatedBy: string,
) {
  return orderSettings().findOneAndUpdate(
    { key: "order-settings" },
    { $set: { ...input, updatedAt: new Date(), updatedBy }, $setOnInsert: { key: "order-settings" } },
    { returnDocument: "after", upsert: true },
  );
}

async function acquireCheckoutLock(userId: string) {
  await checkoutLocks().createIndex({ userId: 1 }, { name: "one_checkout_lock_per_user", unique: true });
  const token = randomUUID();
  const now = new Date();
  try {
    const updated = await checkoutLocks().updateOne(
      { userId, expiresAt: { $lte: now } },
      { $set: { userId, token, expiresAt: new Date(now.getTime() + 30_000) } },
      { upsert: true },
    );
    return updated.matchedCount || updated.upsertedCount ? token : null;
  } catch {
    return null;
  }
}

async function acquireInventoryCheckoutLock() {
  const deadline = Date.now() + 10_000;
  let retryDelay = 25;
  while (Date.now() < deadline) {
    const token = await acquireCheckoutLock(INVENTORY_CHECKOUT_LOCK_ID);
    if (token) return token;
    await new Promise((resolve) => setTimeout(resolve, retryDelay));
    retryDelay = Math.min(retryDelay * 2, 250);
  }
  return null;
}

async function renewCheckoutLock(userId: string, token: string) {
  const now = new Date();
  const updated = await checkoutLocks().updateOne(
    { userId, token, expiresAt: { $gt: now } },
    { $set: { expiresAt: new Date(now.getTime() + 30_000) } },
  );
  return updated.matchedCount > 0;
}

async function restoreStockDeductions(decrements: { productId: string; quantity: number }[]) {
  const pending = decrements.splice(0);
  await Promise.all(
    pending.map(({ productId, quantity }) => products().updateOne({ id: productId }, { $inc: { stock: quantity } })),
  );
}

async function createOrderUnchecked(
  customer: OrderCustomer,
  input: ParsedCheckout,
  initialStatus: Extract<OrderStatus, "incomplete" | "placed">,
  allowOrdersWithoutStockCheck: boolean,
  guestAccessTokenHash?: string,
): Promise<CreateOrderResult> {
  await orders().createIndex({ id: 1 }, { name: "unique_order_id", unique: true });
  const loaded = await Promise.all(
    input.items.map(async ({ productId }) => [productId, await products().findOne({ id: productId })] as const),
  );
  const productById = new Map(loaded);
  for (const { productId } of input.items) {
    const product = productById.get(productId);
    if (!product)
      return { ok: false, status: 404, code: "PRODUCT_NOT_FOUND", error: "One or more products no longer exist." };
    // Quantity is checked only by the atomic stock update below so this early product read cannot reject against stale stock.
    if (product.status !== "active")
      return {
        ok: false,
        status: 409,
        code: "PRODUCT_UNAVAILABLE",
        error: `“${product.name}” is unavailable in the requested quantity.`,
      };
  }

  const snapshots: OrderItemSnapshot[] = input.items.map(({ productId, quantity }) => {
    const product = productById.get(productId)!;
    const unitPrice = priceFor(product);
    const taxRate = productTaxRate(product);
    const unitShippingCost = productShippingCost(product);
    const lineTotal = money(unitPrice * quantity);
    return {
      productId: product.id,
      sku: product.sku,
      slug: product.slug,
      name: product.name,
      primaryImage: product.primaryImage,
      unitPrice,
      taxRate,
      unitShippingCost,
      quantity,
      stockDeducted: 0,
      lineTotal,
      lineTax: money((lineTotal * taxRate) / 100),
      lineShipping: money(unitShippingCost * quantity),
    };
  });

  const subtotal = money(snapshots.reduce((sum, item) => sum + item.lineTotal, 0));
  const tax = money(snapshots.reduce((sum, item) => sum + (item.lineTax ?? 0), 0));
  const shipping = money(snapshots.reduce((sum, item) => sum + (item.lineShipping ?? 0), 0));
  const couponCode = input.couponCode.trim().toUpperCase();
  const coupon = couponCode ? await coupons().findOne({ code: couponCode, active: true }) : null;
  if (couponCode && !coupon)
    return { ok: false, status: 400, code: "INVALID_CHECKOUT", error: "This coupon is invalid or inactive." };
  const discount = coupon ? couponDiscount(coupon, subtotal) : 0;

  // Serialize item updates and order persistence so rollback cannot race with another checkout.
  const inventoryLockToken = await acquireInventoryCheckoutLock();
  if (!inventoryLockToken)
    return { ok: false, status: 409, code: "CHECKOUT_IN_PROGRESS", error: "An order checkout is already in progress." };

  let inventoryLockLost = false;
  const renewal = { current: null as Promise<boolean> | null };
  const renewInventoryLock = () => {
    if (!renewal.current) {
      renewal.current = renewCheckoutLock(INVENTORY_CHECKOUT_LOCK_ID, inventoryLockToken).finally(() => {
        renewal.current = null;
      });
    }
    return renewal.current;
  };
  const inventoryLockHeartbeat = setInterval(() => {
    void renewInventoryLock()
      .then((renewed) => {
        if (!renewed) inventoryLockLost = true;
      })
      .catch(() => {
        inventoryLockLost = true;
      });
  }, 10_000);

  const decremented: { productId: string; quantity: number }[] = [];
  let savedOrder: Order | null = null;
  try {
    for (const item of snapshots) {
      if (inventoryLockLost || !(await renewInventoryLock())) {
        inventoryLockLost = true;
        throw new Error("Inventory checkout lock was lost.");
      }
      const previous = allowOrdersWithoutStockCheck
        ? await products().findOneAndUpdate(
            { id: item.productId, status: "active" },
            [
              {
                $set: {
                  stock: { $max: [0, { $subtract: [{ $ifNull: ["$stock", 0] }, item.quantity] }] },
                  updatedAt: new Date(),
                },
              },
            ],
            { returnDocument: "before" },
          )
        : await products().findOneAndUpdate(
            { id: item.productId, status: "active", stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity }, $set: { updatedAt: new Date() } },
            { returnDocument: "before" },
          );
      if (!previous) {
        await restoreStockDeductions(decremented);
        return {
          ok: false,
          status: 409,
          code: "PRODUCT_UNAVAILABLE",
          error: `“${item.name}” is unavailable in the requested quantity.`,
        };
      }
      const availableStock = Number.isFinite(previous.stock) ? Math.max(0, previous.stock) : 0;
      const stockDeducted = allowOrdersWithoutStockCheck ? Math.min(availableStock, item.quantity) : item.quantity;
      item.stockDeducted = stockDeducted;
      if (stockDeducted) decremented.push({ productId: item.productId, quantity: stockDeducted });
    }

    if (inventoryLockLost || !(await renewInventoryLock())) {
      inventoryLockLost = true;
      throw new Error("Inventory checkout lock was lost.");
    }

    const now = new Date();
    const order: Omit<Order, "id"> = {
      customer,
      ...(guestAccessTokenHash ? { guestAccessTokenHash } : {}),
      items: snapshots,
      itemCount: snapshots.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      tax,
      shipping,
      discount,
      ...(coupon ? { couponCode: coupon.code } : {}),
      total: money(subtotal + tax + shipping - discount),
      currency: "BDT",
      status: initialStatus,
      createdAt: now,
      updatedAt: now,
      statusUpdatedAt: now,
    };

    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate: Order = { ...order, id: createOrderId() };
      try {
        await orders().insertOne(candidate);
        savedOrder = candidate;
        break;
      } catch (error) {
        if ((error as { code?: number }).code !== 11000) throw error;
      }
    }
    if (!savedOrder) throw new Error("Could not generate a unique order ID.");
  } catch (error) {
    await restoreStockDeductions(decremented);
    throw error;
  } finally {
    clearInterval(inventoryLockHeartbeat);
    if (renewal.current) await renewal.current.catch(() => false);
    await checkoutLocks().deleteOne({ userId: INVENTORY_CHECKOUT_LOCK_ID, token: inventoryLockToken });
  }
  invalidatePublicProductCatalogCache();
  return { ok: true, order: savedOrder };
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hashGuestOrderAccessToken(token: string) {
  return hashValue(token);
}

async function createOrderWithLimit(
  customer: OrderCustomer,
  input: ParsedCheckout,
  initialStatus: Extract<OrderStatus, "incomplete" | "placed">,
  guestAccessTokenHash?: string,
): Promise<CreateOrderResult> {
  const settings = await getOrderSettings();
  if (!settings.orderLimitEnabled)
    return createOrderUnchecked(
      customer,
      input,
      initialStatus,
      settings.allowOrdersWithoutStockCheck,
      guestAccessTokenHash,
    );

  const identityFilter = customer.userId
    ? { "customer.userId": customer.userId }
    : { "customer.phone": customer.phone };
  const lockIdentity = customer.userId || `guest:${hashValue(customer.phone)}`;
  const token = await acquireCheckoutLock(lockIdentity);
  if (!token)
    return { ok: false, status: 409, code: "CHECKOUT_IN_PROGRESS", error: "An order checkout is already in progress." };
  try {
    const limitMinutes = settings.orderLimitMinutes >= 1 ? settings.orderLimitMinutes : 5;
    const maxOrders = settings.orderLimitMaxOrders >= 1 ? settings.orderLimitMaxOrders : 1;
    const windowMs = limitMinutes * 60 * 1000;
    const windowStart = new Date(Date.now() - windowMs);

    const recentOrders = await orders()
      .find(
        {
          ...identityFilter,
          status: { $nin: ["cancelled", "incomplete"] },
          createdAt: { $gte: windowStart },
        },
        { projection: { createdAt: 1 } },
      )
      .sort({ createdAt: 1 })
      .toArray();

    if (recentOrders.length >= maxOrders) {
      const oldestInWindow = recentOrders[recentOrders.length - maxOrders];
      const cooldownExpiresAt = new Date(oldestInWindow.createdAt.getTime() + windowMs);
      if (cooldownExpiresAt.getTime() > Date.now()) {
        const orderLabel = maxOrders === 1 ? "1 order" : `${maxOrders} orders`;
        const minuteLabel = limitMinutes === 1 ? "1 minute" : `${limitMinutes} minutes`;
        return {
          ok: false,
          status: 429,
          code: "ORDER_LIMITED",
          error: `Order limit reached: maximum ${orderLabel} every ${minuteLabel}.`,
          cooldownExpiresAt: cooldownExpiresAt.toISOString(),
        };
      }
    }
    return await createOrderUnchecked(
      customer,
      input,
      initialStatus,
      settings.allowOrdersWithoutStockCheck,
      guestAccessTokenHash,
    );
  } finally {
    await checkoutLocks().deleteOne({ userId: lockIdentity, token });
  }
}

export async function createOrder(
  sessionUser: SessionUser,
  input: ParsedCheckout,
  initialStatus: Extract<OrderStatus, "incomplete" | "placed"> = "placed",
): Promise<CreateOrderResult> {
  const customer = customerFrom(sessionUser, input.customer);
  if (!customer) return { ok: false, status: 401, code: "AUTH_REQUIRED", error: "Sign in required." };
  return createOrderWithLimit(customer, input, initialStatus);
}

/** Promotes an existing reservation only after a fresh server-side coupon check. */
async function promoteIncompleteOrder(
  filter: Filter<Order>,
  customer: OrderCustomer,
  couponCodeInput: string,
): Promise<CreateOrderResult> {
  const incomplete = await orders().findOne(filter);
  if (!incomplete)
    return {
      ok: false,
      status: 409,
      code: "INVALID_CHECKOUT",
      error: "This incomplete order is no longer available.",
    };

  const couponCode = couponCodeInput.trim().toUpperCase();
  const coupon = couponCode ? await coupons().findOne({ code: couponCode, active: true }) : null;
  if (couponCode && !coupon)
    return { ok: false, status: 400, code: "INVALID_CHECKOUT", error: "This coupon is invalid or inactive." };

  const subtotal = money(incomplete.subtotal);
  const tax = money(incomplete.tax ?? 0);
  const shipping = money(incomplete.shipping ?? 0);
  const discount = coupon ? couponDiscount(coupon, subtotal) : 0;
  const now = new Date();
  const updated = await orders().findOneAndUpdate(
    filter,
    {
      $set: {
        customer,
        subtotal,
        tax,
        shipping,
        discount,
        ...(coupon ? { couponCode: coupon.code } : {}),
        total: money(subtotal + tax + shipping - discount),
        status: "placed",
        updatedAt: now,
        statusUpdatedAt: now,
      },
      ...(coupon ? {} : { $unset: { couponCode: "" } }),
    },
    { returnDocument: "after" },
  );
  return updated
    ? { ok: true, order: updated }
    : {
        ok: false,
        status: 409,
        code: "INVALID_CHECKOUT",
        error: "This incomplete order is no longer available.",
      };
}

/**
 * Promotes the signed-in customer's reserved order only after rechecking its active coupon.
 * Product price, tax, shipping, and stock were snapshotted and reserved when the incomplete order was created.
 */
export async function confirmIncompleteOrder(
  sessionUser: SessionUser,
  input: ParsedOrderConfirmation,
): Promise<CreateOrderResult> {
  const customer = customerFrom(sessionUser, input.customer);
  if (!customer) return { ok: false, status: 401, code: "AUTH_REQUIRED", error: "Sign in required." };
  return promoteIncompleteOrder(
    { id: input.id, "customer.userId": customer.userId, status: "incomplete" },
    customer,
    input.couponCode,
  );
}

export async function confirmGuestIncompleteOrder(
  input: ParsedOrderConfirmation,
  trackingToken: string,
): Promise<CreateOrderResult> {
  const phone = input.customer.phone.startsWith("+880") ? input.customer.phone : `+88${input.customer.phone}`;
  return promoteIncompleteOrder(
    { id: input.id, guestAccessTokenHash: hashGuestOrderAccessToken(trackingToken), status: "incomplete" },
    { userId: "", email: "", name: input.customer.name, phone, address: input.customer.address },
    input.couponCode,
  );
}

/** Gives the customer a no-side-effect coupon preview for their own reserved order. Confirmation repeats this check. */
async function quoteIncompleteOrderByFilter(
  filter: Filter<Order>,
  couponCodeInput: string,
): Promise<IncompleteOrderQuoteResult> {
  const incomplete = await orders().findOne(filter);
  if (!incomplete)
    return {
      ok: false,
      status: 409,
      code: "INVALID_CHECKOUT",
      error: "This incomplete order is no longer available.",
    };
  const couponCode = couponCodeInput.trim().toUpperCase();
  const coupon = couponCode ? await coupons().findOne({ code: couponCode, active: true }) : null;
  if (couponCode && !coupon)
    return { ok: false, status: 400, code: "INVALID_CHECKOUT", error: "This coupon is invalid or inactive." };
  const subtotal = money(incomplete.subtotal);
  const tax = money(incomplete.tax ?? 0);
  const shipping = money(incomplete.shipping ?? 0);
  const discount = coupon ? couponDiscount(coupon, subtotal) : 0;
  return {
    ok: true,
    quote: {
      subtotal,
      tax,
      shipping,
      discount,
      ...(coupon ? { couponCode: coupon.code } : {}),
      total: money(subtotal + tax + shipping - discount),
      currency: "BDT",
    },
  };
}

export async function quoteIncompleteOrder(
  sessionUser: SessionUser,
  input: Pick<ParsedOrderConfirmation, "id" | "couponCode">,
): Promise<IncompleteOrderQuoteResult> {
  const userId = sessionUser.id?.trim();
  if (!userId) return { ok: false, status: 401, code: "AUTH_REQUIRED", error: "Sign in required." };
  return quoteIncompleteOrderByFilter(
    { id: input.id, "customer.userId": userId, status: "incomplete" },
    input.couponCode,
  );
}

export async function quoteGuestIncompleteOrder(
  input: Pick<ParsedOrderConfirmation, "id" | "couponCode">,
  trackingToken: string,
): Promise<IncompleteOrderQuoteResult> {
  return quoteIncompleteOrderByFilter(
    { id: input.id, guestAccessTokenHash: hashGuestOrderAccessToken(trackingToken), status: "incomplete" },
    input.couponCode,
  );
}

export async function createGuestOrder(
  input: ParsedCheckout,
  initialStatus: Extract<OrderStatus, "incomplete" | "placed"> = "placed",
): Promise<CreateOrderResult | { ok: true; order: Order; trackingToken: string }> {
  const phone = input.customer.phone.startsWith("+880") ? input.customer.phone : `+88${input.customer.phone}`;
  const trackingToken = randomBytes(32).toString("base64url");
  const customer: OrderCustomer = {
    userId: "",
    email: "",
    name: input.customer.name,
    phone,
    address: input.customer.address,
  };
  const result = await createOrderWithLimit(customer, input, initialStatus, hashGuestOrderAccessToken(trackingToken));
  return result.ok ? { ...result, trackingToken } : result;
}
