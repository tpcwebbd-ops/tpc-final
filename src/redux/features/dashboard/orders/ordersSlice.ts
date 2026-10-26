/*
|-----------------------------------------
| setting up ordersSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { type Order, type OrderStatus } from "@/lib/dashboard/orders";
import { apiSlice } from "@/redux/api/apiSlice";

export type OrderItem = Omit<Order, "createdAt" | "updatedAt" | "statusUpdatedAt"> & {
  createdAt: string;
  updatedAt: string;
  statusUpdatedAt: string;
};

export type OrdersQuery = {
  status?: OrderStatus;
  search?: string;
  page?: number;
  pageSize?: number;
};

export type OrdersResponse = {
  items: OrderItem[];
  total: number;
  page: number;
  pageSize: number;
};

type OrdersQueryArg = OrdersQuery | OrderStatus | "";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<OrdersResponse, OrdersQueryArg | void>({
      query: (params) => {
        const values: OrdersQuery = typeof params === "string" ? { status: params || undefined } : (params ?? {});
        const query = new URLSearchParams();
        if (values?.status) query.set("status", values.status);
        if (values?.search?.trim()) query.set("search", values.search.trim());
        if (values?.page) query.set("page", String(values.page));
        if (values?.pageSize) query.set("pageSize", String(values.pageSize));
        const search = query.toString();
        return `orders/v1${search ? `?${search}` : ""}`;
      },
      providesTags: ["Order"],
    }),
    getOrder: build.query<{ item: OrderItem }, string>({
      query: (id) => `orders/v1/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
    updateOrderStatus: build.mutation<{ item: OrderItem }, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({ url: `orders/v1/${id}`, method: "PATCH", body: { status } }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: build.mutation<{ deletedCount: number }, string>({
      query: (id) => ({ url: `orders/v1/${id}`, method: "DELETE" }),
      invalidatesTags: ["Order"],
    }),
    bulkDeleteOrders: build.mutation<{ deletedCount: number }, string[]>({
      query: (ids) => ({ url: "orders/v1/bulk", method: "DELETE", body: { ids } }),
      invalidatesTags: ["Order"],
    }),
    bulkUpdateOrderStatus: build.mutation<{ updatedCount: number }, { ids: string[]; status: OrderStatus }>({
      query: (body) => ({ url: "orders/v1/bulk", method: "PATCH", body }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useBulkDeleteOrdersMutation,
  useBulkUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useGetOrderQuery,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
