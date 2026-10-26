/*
|-----------------------------------------
| setting up CartDrawer.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 1 September, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { authClient } from "@/app/api/lib/auth-client";
import { Icon } from "@/components/all-icons/all-icons";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  CART_DRAWER_OPEN_EVENT,
  CART_STORAGE_KEY,
  CART_UPDATED_EVENT,
  clearCart,
  formatBDT,
  readCart,
  removeFromCart,
  type CartItem,
  updateCartQuantity,
} from "@/lib/cart";
import { validatePhoneNumber } from "@/lib/dashboard/orders";
import {
  ORDER_HISTORY_STORAGE_KEY,
  ORDER_HISTORY_UPDATED_EVENT,
  clearOrderHistory,
  readOrderHistory,
  removeOrderFromHistory,
  saveOrderToHistory,
  type LocalOrderHistoryItem,
} from "@/lib/order-history";

type OrderCostSummary = {
  subtotal: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  couponCode?: string;
  total: number;
};

type CheckoutOrder = LocalOrderHistoryItem &
  OrderCostSummary & {
    currency: "BDT";
  };

type SessionProfile = {
  name?: string | null;
  email?: string | null;
  mobileNumber?: string | null;
  address?: string | null;
};

export function CartDrawer() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const sessionProfile = session?.user as SessionProfile | undefined;
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const openFrame = useRef<number | null>(null);
  const incompleteTrackingTokenRef = useRef<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<"cart" | "history">("cart");
  const [checkoutView, setCheckoutView] = useState<"cart" | "details">("cart");
  const [history, setHistory] = useState<LocalOrderHistoryItem[]>([]);
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [address, setAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [incompleteOrderId, setIncompleteOrderId] = useState<string | null>(null);
  const [incompleteTrackingToken, setIncompleteTrackingToken] = useState<string | null>(null);
  const [incompleteOrder, setIncompleteOrder] = useState<CheckoutOrder | null>(null);
  const [couponPreview, setCouponPreview] = useState<OrderCostSummary | null>(null);
  const [couponError, setCouponError] = useState("");
  const [creatingIncompleteOrder, setCreatingIncompleteOrder] = useState(false);
  const [message, setMessage] = useState("");
  const [cooldownExpiresAt, setCooldownExpiresAt] = useState<string | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [orderToDelete, setOrderToDelete] = useState<LocalOrderHistoryItem | "all" | null>(null);

  const openCart = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveTab("cart");
    setCheckoutView("cart");
    setVisible(true);
    if (openFrame.current) window.cancelAnimationFrame(openFrame.current);
    openFrame.current = window.requestAnimationFrame(() => {
      openFrame.current = null;
      setOpen(true);
    });
  };

  const closeCart = () => {
    if (openFrame.current) {
      window.cancelAnimationFrame(openFrame.current);
      openFrame.current = null;
    }
    setCheckoutStatus("idle");
    setMessage("");
    setConfirmedOrderId(null);
    setOrderToDelete(null);
    setCheckoutView("cart");
    setOpen(false);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setVisible(false), 300);
  };

  useEffect(() => {
    const sync = () => setItems(readCart());
    const syncHistory = () => setHistory(readOrderHistory());
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) sync();
      if (event.key === ORDER_HISTORY_STORAGE_KEY) syncHistory();
    };
    const onOpen = () => {
      sync();
      openCart();
    };
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && closeCart();
    sync();
    syncHistory();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    window.addEventListener(ORDER_HISTORY_UPDATED_EVENT, syncHistory);
    window.addEventListener("storage", onStorage);
    window.addEventListener(CART_DRAWER_OPEN_EVENT, onOpen);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, sync);
      window.removeEventListener(ORDER_HISTORY_UPDATED_EVENT, syncHistory);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CART_DRAWER_OPEN_EVENT, onOpen);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []); // Event listeners are registered once; cart handlers only use stable state setters and refs.

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      if (openFrame.current) window.cancelAnimationFrame(openFrame.current);
    };
  }, []);

  useEffect(() => {
    if (!cooldownExpiresAt) return;
    const sync = () => {
      const remaining = Math.max(0, Math.ceil((new Date(cooldownExpiresAt).getTime() - Date.now()) / 1000));
      setCountdownSeconds(remaining);
      if (!remaining) setCooldownExpiresAt(null);
    };
    sync();
    const timer = window.setInterval(sync, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownExpiresAt]);

  const phoneValidation = validatePhoneNumber(phone);
  const checkoutDisabled =
    checkoutStatus === "processing" ||
    sessionPending ||
    creatingIncompleteOrder ||
    countdownSeconds > 0 ||
    !items.length ||
    !name.trim() ||
    !phoneValidation.isValid;

  const createIncompleteOrder = async (phoneNumber = phone, customerName = name): Promise<string | null> => {
    if (incompleteOrderId) return incompleteOrderId;
    const validation = validatePhoneNumber(phoneNumber);
    if (!customerName.trim() || !validation.isValid || !items.length || creatingIncompleteOrder) return null;
    setCreatingIncompleteOrder(true);
    try {
      const response = await fetch("/api/orders/v1", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          intent: "incomplete",
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          customer: { name: customerName.trim(), phone: phoneNumber.trim(), address: address.trim() },
          couponCode: couponCode.trim(),
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        code?: string;
        error?: string;
        cooldownExpiresAt?: string;
        order?: CheckoutOrder;
        trackingToken?: string;
      } | null;
      if (!response.ok || !payload?.ok || !payload.order?.id || (!session && !payload.trackingToken)) {
        if (payload?.code === "ORDER_LIMITED" && payload.cooldownExpiresAt)
          setCooldownExpiresAt(payload.cooldownExpiresAt);
        setCheckoutStatus("error");
        setMessage(payload?.error ?? "Could not save your incomplete order. Please try again.");
        return null;
      }
      setIncompleteOrderId(payload.order.id);
      setIncompleteTrackingToken(payload.trackingToken ?? null);
      incompleteTrackingTokenRef.current = payload.trackingToken ?? null;
      setIncompleteOrder(payload.order);
      setCouponPreview(null);
      saveOrderToHistory(
        payload.trackingToken ? { ...payload.order, trackingToken: payload.trackingToken } : payload.order,
      );
      return payload.order.id;
    } catch {
      setCheckoutStatus("error");
      setMessage("Could not save your incomplete order. Check your connection and try again.");
      return null;
    } finally {
      setCreatingIncompleteOrder(false);
    }
  };

  const previewCoupon = async () => {
    const normalizedCoupon = couponCode.trim().toUpperCase();
    const trackingToken = incompleteTrackingToken ?? incompleteTrackingTokenRef.current;
    if (!normalizedCoupon || !incompleteOrderId || (!session && !trackingToken)) {
      setCouponPreview(null);
      setCouponError("");
      return;
    }
    try {
      const response = await fetch("/api/orders/v1", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          ...(trackingToken ? { "x-order-access-token": trackingToken } : {}),
        },
        body: JSON.stringify({ id: incompleteOrderId, couponCode: normalizedCoupon }),
      });
      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        quote?: OrderCostSummary;
      } | null;
      if (!response.ok || !payload?.ok || !payload.quote) {
        setCouponPreview(null);
        setCouponError(payload?.error ?? "Coupon could not be verified. It will be checked again on confirmation.");
        return;
      }
      setCouponPreview(payload.quote);
      setCouponError("");
    } catch {
      setCouponPreview(null);
      setCouponError("Coupon preview is unavailable. It will be checked on confirmation.");
    }
  };

  const handleCheckout = async () => {
    setNameTouched(true);
    setPhoneTouched(true);
    if (!name.trim()) {
      setCheckoutStatus("error");
      setMessage("Please enter your name.");
      return;
    }
    if (!phoneValidation.isValid) {
      setCheckoutStatus("error");
      setMessage(phoneValidation.error || "Please enter a valid phone number.");
      return;
    }
    if (checkoutDisabled) return;
    setCheckoutStatus("processing");
    setConfirmedOrderId(null);
    setMessage("");
    try {
      const orderId = incompleteOrderId ?? (await createIncompleteOrder());
      if (!orderId) return;
      const trackingToken = incompleteTrackingToken ?? incompleteTrackingTokenRef.current;
      const response = await fetch("/api/orders/v1", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          ...(trackingToken ? { "x-order-access-token": trackingToken } : {}),
        },
        body: JSON.stringify({
          id: orderId,
          customer: { name: name.trim(), phone: phone.trim(), address: address.trim() },
          couponCode: couponCode.trim(),
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        code?: string;
        error?: string;
        cooldownExpiresAt?: string;
        order?: CheckoutOrder;
      } | null;
      if (!response.ok || !payload?.ok) {
        if (payload?.code === "ORDER_LIMITED" && payload.cooldownExpiresAt)
          setCooldownExpiresAt(payload.cooldownExpiresAt);
        setCheckoutStatus("error");
        setMessage(payload?.error ?? "Could not place your order. Please try again.");
        return;
      }
      if (!payload.order?.id) throw new Error("The order confirmation was incomplete.");
      saveOrderToHistory(payload.order);
      clearCart();
      setIncompleteOrderId(null);
      setIncompleteTrackingToken(null);
      incompleteTrackingTokenRef.current = null;
      setIncompleteOrder(null);
      setCouponPreview(null);
      setCouponError("");
      setName("");
      setNameTouched(false);
      setPhone("");
      setPhoneTouched(false);
      setAddress("");
      setCouponCode("");
      setConfirmedOrderId(payload.order.id);
      setCheckoutStatus("success");
      setMessage(`Order ${payload.order.id} was placed successfully.`);
    } catch {
      setCheckoutStatus("error");
      setMessage("Could not place your order. Check your connection and try again.");
    }
  };

  const currentCartSubtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const openCheckout = () => {
    setName((current) => current || sessionProfile?.name?.trim() || sessionProfile?.email?.trim() || "");
    setPhone((current) => current || sessionProfile?.mobileNumber?.trim() || "");
    setAddress((current) => current || sessionProfile?.address?.trim() || "");
    setCheckoutView("details");
  };

  if (!visible) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ease-out motion-reduce:transition-none ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      role="presentation"
    >
      <button
        aria-label="Close cart"
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px]"
        onClick={closeCart}
        type="button"
      />
      <aside
        aria-label="Shopping cart"
        aria-modal="true"
        className={`absolute right-0 top-0 flex h-dvh w-[100vw] max-w-md flex-col border-l border-[#eadfca] bg-[#fffdf8] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
      >
        {checkoutStatus !== "idle" && message ? (
          <div className="absolute inset-0 z-20 grid place-items-center bg-stone-950/10 px-5" role="status">
            <div
              aria-live="assertive"
              className={`relative max-w-sm rounded-sm border px-5 py-4 text-center shadow-xl ${checkoutStatus === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-950" : checkoutStatus === "error" ? "border-red-200 bg-red-50 text-red-950" : "border-amber-200 bg-amber-50 text-amber-950"}`}
            >
              <Button
                aria-label="Dismiss checkout message"
                className="absolute right-1 top-1"
                onClick={() => {
                  setCheckoutStatus("idle");
                  setMessage("");
                  setConfirmedOrderId(null);
                }}
                size="icon-xs"
                variant="ghost"
              >
                <Icon name="X" />
              </Button>
              <p className="font-semibold">{checkoutStatus === "success" ? "Order placed" : "Checkout unavailable"}</p>
              <p className="mt-1 text-sm">{message}</p>
              {checkoutStatus === "success" && confirmedOrderId ? (
                <Link
                  className="mt-3 inline-flex rounded-sm bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                  href={`/order-tracking?id=${encodeURIComponent(confirmedOrderId)}`}
                  onClick={closeCart}
                >
                  Track this order
                </Link>
              ) : null}
              {countdownSeconds > 0 ? (
                <p className="mt-2 text-sm font-bold">Try again in {formatCountdown(countdownSeconds)}.</p>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="flex items-center justify-between border-b border-[#eadfca] px-5 py-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase">Your selection</p>
            <div className="mt-2 flex gap-3" role="tablist">
              <button
                aria-selected={activeTab === "cart"}
                className={`border-b-2 pb-1 text-sm font-bold ${activeTab === "cart" ? "border-amber-700 text-stone-950" : "border-transparent text-stone-500"}`}
                onClick={() => setActiveTab("cart")}
                role="tab"
                type="button"
              >
                Order ({items.length})
              </button>
              <button
                aria-selected={activeTab === "history"}
                className={`border-b-2 pb-1 text-sm font-bold ${activeTab === "history" ? "border-amber-700 text-stone-950" : "border-transparent text-stone-500"}`}
                onClick={() => setActiveTab("history")}
                role="tab"
                type="button"
              >
                History ({history.length})
              </button>
            </div>
          </div>
          <Button aria-label="Close cart" onClick={closeCart} size="icon" variant="ghost">
            <Icon name="X" />
          </Button>
        </div>

        <ScrollArea className="min-h-0 flex-1 px-5 py-4">
          {activeTab === "history" ? (
            history.length ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Saved locally in browser</span>
                  {history.length > 1 ? (
                    <button
                      className="cursor-pointer font-semibold text-stone-500 transition-colors hover:text-rose-700"
                      onClick={() => setOrderToDelete("all")}
                      type="button"
                    >
                      Clear all
                    </button>
                  ) : null}
                </div>
                {history.map((order) => (
                  <article
                    className="rounded-sm border border-[#eadfca] bg-white p-3 transition hover:border-amber-300 hover:bg-[#fffaf0]"
                    key={order.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        className="group min-w-0 flex-1"
                        href={`/order-tracking?id=${encodeURIComponent(order.id)}`}
                        onClick={closeCart}
                      >
                        <p className="font-bold text-stone-900 transition-colors group-hover:text-amber-800">
                          Order {order.id}
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                          {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                        </p>
                      </Link>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900 capitalize">
                          {order.status}
                        </span>
                        <Button
                          aria-label={`Delete order ${order.id} from local history`}
                          className="text-stone-400 hover:bg-rose-50 hover:text-rose-700"
                          onClick={() => setOrderToDelete(order)}
                          size="icon-xs"
                          title="Delete from local storage"
                          type="button"
                          variant="ghost"
                        >
                          <Icon name="Trash2" />
                        </Button>
                      </div>
                    </div>
                    <Link
                      className="mt-3 flex items-center justify-between text-sm"
                      href={`/order-tracking?id=${encodeURIComponent(order.id)}`}
                      onClick={closeCart}
                    >
                      <time className="text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</time>
                      <span className="font-bold text-stone-900">{formatBDT(order.total)}</span>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyHistory />
            )
          ) : items.length ? (
            <div className="space-y-3">
              {items.map((item) => (
                <article className="flex gap-3 rounded-sm border border-[#eadfca] bg-white p-3" key={item.id}>
                  <Image
                    alt={item.title}
                    className="size-16 rounded-sm object-cover"
                    height={64}
                    src={item.image}
                    width={64}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-stone-800">{item.title}</h3>
                      <Button
                        aria-label={`Remove ${item.title}`}
                        className="text-rose-700 hover:bg-rose-50"
                        onClick={() => removeFromCart(item.id)}
                        size="icon-xs"
                        variant="ghost"
                      >
                        <Icon name="Trash2" />
                      </Button>
                    </div>
                    <p className="mt-1 text-sm font-bold text-stone-950">{formatBDT(item.price)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div
                        aria-label={`Quantity for ${item.title}`}
                        className="flex items-center rounded-sm border border-[#eadfca] bg-[#fffaf0]"
                      >
                        <Button
                          aria-label={`Decrease ${item.title} quantity`}
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          size="icon-xs"
                          variant="ghost"
                        >
                          <Icon name="Minus" />
                        </Button>
                        <span className="w-7 text-center text-sm font-semibold" aria-live="polite">
                          {item.quantity}
                        </span>
                        <Button
                          aria-label={`Increase ${item.title} quantity`}
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          size="icon-xs"
                          variant="ghost"
                        >
                          <Icon name="Plus" />
                        </Button>
                      </div>
                      <span className="text-sm font-semibold text-stone-700">
                        {formatBDT(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-amber-100 text-amber-800">
                <Icon name="ShoppingCart" />
              </span>
              <h3 className="mt-4 font-bold text-stone-900">Your cart is empty</h3>
              <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-stone-500">
                Add an available product to continue.
              </p>
            </div>
          )}
        </ScrollArea>

        {activeTab === "cart" && items.length ? (
          <div className="border-t border-[#eadfca] bg-white px-5 py-4">
            {checkoutView === "cart" ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">Items subtotal</span>
                  <span className="font-bold text-stone-950">{formatBDT(currentCartSubtotal)}</span>
                </div>
                <Button
                  className="mt-4 w-full bg-stone-900 text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={sessionPending}
                  onClick={openCheckout}
                  size="lg"
                  type="button"
                >
                  Place order
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-stone-900">Order details</p>
                    <p className="mt-0.5 text-xs text-stone-500">Review your delivery details before confirming.</p>
                  </div>
                  <Button onClick={() => setCheckoutView("cart")} size="sm" type="button" variant="outline">
                    Back
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Input
                      aria-invalid={nameTouched && !name.trim()}
                      aria-label="Name"
                      className={nameTouched && !name.trim() ? "border-red-400 focus-visible:ring-red-300" : ""}
                      onBlur={() => setNameTouched(true)}
                      onChange={(event) => {
                        const nextName = event.target.value;
                        setName(nextName);
                        if (validatePhoneNumber(phone).isValid) void createIncompleteOrder(phone, nextName);
                      }}
                      placeholder="Full name"
                      required
                      value={name}
                    />
                    {nameTouched && !name.trim() ? (
                      <p className="mt-1 text-xs font-medium text-red-600">Name is required.</p>
                    ) : null}
                  </div>
                  <div>
                    <Input
                      aria-describedby={phoneTouched && !phoneValidation.isValid ? "cart-phone-error" : undefined}
                      aria-invalid={phoneTouched && !phoneValidation.isValid}
                      aria-label="Phone number"
                      className={
                        phoneTouched && !phoneValidation.isValid ? "border-red-400 focus-visible:ring-red-300" : ""
                      }
                      onBlur={() => setPhoneTouched(true)}
                      onChange={(event) => {
                        const nextPhone = event.target.value;
                        setPhone(nextPhone);
                        if (!phoneTouched) setPhoneTouched(true);
                        if (validatePhoneNumber(nextPhone).isValid) void createIncompleteOrder(nextPhone);
                      }}
                      placeholder="Phone number (01XXXXXXXXX or +8801XXXXXXXXX)"
                      required
                      value={phone}
                    />
                    {phoneTouched && !phoneValidation.isValid ? (
                      <p className="mt-1 text-xs font-medium text-red-600" id="cart-phone-error">
                        {phoneValidation.error}
                      </p>
                    ) : null}
                  </div>
                  <Textarea
                    aria-label="Delivery address"
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Delivery address (optional)"
                    rows={3}
                    value={address}
                  />
                  <Input
                    aria-label="Coupon code"
                    onBlur={() => void previewCoupon()}
                    onChange={(event) => {
                      setCouponCode(event.target.value.toUpperCase());
                      setCouponPreview(null);
                      setCouponError("");
                    }}
                    placeholder="Coupon code (optional)"
                    value={couponCode}
                  />
                  {couponError ? <p className="text-xs font-medium text-red-600">{couponError}</p> : null}
                  {!session && !sessionPending ? (
                    <p className="text-xs leading-5 text-stone-500">
                      No account is needed to order. You can also{" "}
                      <Link className="font-semibold text-amber-800 underline" href="/registration">
                        create an account (optional)
                      </Link>
                      .
                    </p>
                  ) : null}
                </div>
                <CheckoutSummary
                  couponCode={couponCode}
                  currentSubtotal={currentCartSubtotal}
                  loading={creatingIncompleteOrder}
                  couponPreview={couponPreview}
                  order={incompleteOrder}
                />
                {countdownSeconds > 0 ? (
                  <p className="text-center text-sm font-semibold text-red-700">
                    Order limit active. Try again in {formatCountdown(countdownSeconds)}.
                  </p>
                ) : null}
                <Button
                  className="w-full bg-stone-900 text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={checkoutDisabled}
                  onClick={() => void handleCheckout()}
                  size="lg"
                  type="button"
                >
                  {checkoutStatus === "processing"
                    ? "Confirming order…"
                    : creatingIncompleteOrder
                      ? "Saving incomplete order…"
                      : countdownSeconds > 0
                        ? `Try again in ${formatCountdown(countdownSeconds)}`
                        : phoneTouched && !phoneValidation.isValid
                          ? "Valid phone number required"
                          : "Confirm order"}
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </aside>
      <AlertDialog
        confirmLabel={orderToDelete === "all" ? "Clear all" : "Delete"}
        description={
          orderToDelete === "all"
            ? "This will delete all saved order records from your browser's local storage. This will not cancel any placed orders."
            : `Are you sure you want to delete order ${orderToDelete?.id} from your history? This will only delete it from your local storage and will not cancel the order.`
        }
        onCancel={() => setOrderToDelete(null)}
        onConfirm={() => {
          if (orderToDelete === "all") {
            clearOrderHistory();
          } else if (orderToDelete) {
            removeOrderFromHistory(orderToDelete.id);
          }
          setOrderToDelete(null);
        }}
        open={orderToDelete !== null}
        title={orderToDelete === "all" ? "Clear all order history?" : `Delete order ${orderToDelete?.id}?`}
      />
    </div>,
    document.body,
  );
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function CheckoutSummary({
  couponCode,
  couponPreview,
  currentSubtotal,
  loading,
  order,
}: {
  couponCode: string;
  couponPreview: OrderCostSummary | null;
  currentSubtotal: number;
  loading: boolean;
  order: CheckoutOrder | null;
}) {
  const normalizedCoupon = couponCode.trim().toUpperCase();
  const summary = couponPreview?.couponCode === normalizedCoupon ? couponPreview : order;
  const couponApplied = Boolean(normalizedCoupon && normalizedCoupon === summary?.couponCode);
  const tax = summary?.tax ?? 0;
  const shipping = summary?.shipping ?? 0;
  const discount = couponApplied ? (summary?.discount ?? 0) : 0;
  const subtotal = summary?.subtotal ?? currentSubtotal;
  const total = couponApplied ? (summary?.total ?? subtotal) : Math.max(0, subtotal + tax + shipping);

  return (
    <section aria-live="polite" className="rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-stone-900">Order summary</h3>
        {loading ? <span className="text-xs font-medium text-amber-800">Preparing order…</span> : null}
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        <SummaryRow label="Subtotal" value={formatBDT(subtotal)} />
        <SummaryRow label="Tax" value={summary ? formatBDT(tax) : "Enter a valid number"} />
        <SummaryRow label="Shipping" value={summary ? formatBDT(shipping) : "Enter a valid number"} />
        <SummaryRow
          label="Coupon"
          value={
            normalizedCoupon
              ? couponApplied
                ? `${normalizedCoupon} −${formatBDT(discount)}`
                : `${normalizedCoupon} (validated on confirmation)`
              : "No coupon"
          }
        />
        <div className="flex items-center justify-between border-t border-[#eadfca] pt-2 text-base font-bold text-stone-950">
          <dt>Total</dt>
          <dd>{formatBDT(total)}</dd>
        </div>
      </dl>
      {!order && !loading ? (
        <p className="mt-3 text-xs leading-5 text-stone-500">
          A valid number saves an incomplete order and loads the final tax/shipping total before confirmation.
        </p>
      ) : null}
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-stone-600">
      <dt>{label}</dt>
      <dd className="text-right font-medium text-stone-900">{value}</dd>
    </div>
  );
}

function EmptyHistory() {
  return (
    <div className="py-8 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-amber-100 text-amber-800">
        <Icon name="Package" />
      </span>
      <h3 className="mt-4 font-bold text-stone-900">No orders yet</h3>
      <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-stone-500">Confirmed orders will appear here.</p>
    </div>
  );
}
