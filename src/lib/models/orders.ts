import "server-only";

import type { Order, OrderSettings } from "@/lib/dashboard/orders";
import { database } from "@/lib/db";

export const ordersCollection = () => database().collection<Order>("orders");
export const orderSettingsCollection = () => database().collection<OrderSettings>("order-settings");
export const checkoutLocksCollection = () =>
  database().collection<{ userId: string; token: string; expiresAt: Date }>("order-checkout-locks");
