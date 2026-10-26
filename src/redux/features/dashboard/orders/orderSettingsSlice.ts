/*
|-----------------------------------------
| setting up orderSettingsSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { type OrderSettings } from "@/lib/dashboard/orders";
import { apiSlice } from "@/redux/api/apiSlice";

export type OrderSettingsItem = Omit<OrderSettings, "updatedAt"> & { updatedAt: string };

export const orderSettingsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getOrderSettings: build.query<{ settings: OrderSettingsItem }, void>({
      query: () => "orders/settings/v1",
      providesTags: ["OrderSettings"],
    }),
    updateOrderSettings: build.mutation<
      { settings: OrderSettingsItem },
      {
        allowOrdersWithoutStockCheck?: boolean;
        orderLimitEnabled: boolean;
        orderLimitMinutes?: number;
        orderLimitMaxOrders?: number;
      }
    >({
      query: (body) => ({ url: "orders/settings/v1", method: "PATCH", body }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          orderSettingsApi.util.updateQueryData("getOrderSettings", undefined, (draft) => {
            draft.settings.allowOrdersWithoutStockCheck =
              body.allowOrdersWithoutStockCheck ?? draft.settings.allowOrdersWithoutStockCheck;
            draft.settings.orderLimitEnabled = body.orderLimitEnabled;
            draft.settings.orderLimitMinutes = body.orderLimitMinutes ?? draft.settings.orderLimitMinutes;
            draft.settings.orderLimitMaxOrders = body.orderLimitMaxOrders ?? draft.settings.orderLimitMaxOrders;
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            orderSettingsApi.util.updateQueryData("getOrderSettings", undefined, (draft) => {
              draft.settings = data.settings;
            }),
          );
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["OrderSettings"],
    }),
  }),
});

export const { useGetOrderSettingsQuery, useUpdateOrderSettingsMutation } = orderSettingsApi;
