/*
|-----------------------------------------
| setting up productsSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { type Product, type ProductInput } from "@/lib/dashboard/catalog";
import { apiSlice } from "@/redux/api/apiSlice";

export type ProductItem = Omit<Product, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string };
export type ProductUpdateInput = Partial<ProductInput> & Pick<ProductItem, "id">;
export type ProductListParams = {
  category?: string;
  limit?: number;
  page?: number;
  search?: string;
  status?: ProductItem["status"] | "";
};
export type ProductListResponse = {
  items: ProductItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  summary: { averagePrice: number; inStock: number; totalStock: number };
};

function queryString(params: ProductListParams) {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.limit) query.set("limit", String(params.limit));
  if (params.page) query.set("page", String(params.page));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  return query.toString();
}

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ProductListResponse, ProductListParams>({
      query: (params) => `products/v1${queryString(params) ? `?${queryString(params)}` : ""}`,
      providesTags: ["Product"],
    }),
    createProduct: build.mutation<{ item: ProductItem }, ProductInput>({
      query: (body) => ({ url: "products/v1", method: "POST", body }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: build.mutation<{ item: ProductItem }, ProductUpdateInput>({
      query: ({ id, ...body }) => ({ url: `products/v1/${id}`, method: "PATCH", body }),
      async onQueryStarted({ id, ...body }, { dispatch, getState, queryFulfilled }) {
        const productQueries = productsApi.util
          .selectInvalidatedBy(getState(), ["Product"])
          .filter((query) => query.endpointName === "getProducts");
        const patches = productQueries.map(({ originalArgs }) =>
          dispatch(
            productsApi.util.updateQueryData("getProducts", originalArgs, (draft) => {
              const current = draft.items.find((item) => item.id === id);
              if (!current) return;

              const previousStock = current.stock;
              Object.assign(current, body);
              if (typeof body.stock === "number") {
                draft.summary.totalStock += current.stock - previousStock;
                draft.summary.inStock += Number(current.stock > 0) - Number(previousStock > 0);
              }
            }),
          ),
        );

        try {
          const { data } = await queryFulfilled;
          for (const { originalArgs } of productQueries) {
            dispatch(
              productsApi.util.updateQueryData("getProducts", originalArgs, (draft) => {
                const current = draft.items.find((item) => item.id === id);
                if (!current) return;

                const previousStock = current.stock;
                Object.assign(current, data.item);
                draft.summary.totalStock += current.stock - previousStock;
                draft.summary.inStock += Number(current.stock > 0) - Number(previousStock > 0);
              }),
            );
          }
        } catch {
          for (const patch of patches) patch.undo();
        }
      },
      invalidatesTags: ["Product"],
    }),
    deleteProduct: build.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `products/v1/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"],
    }),
    bulkDeleteProducts: build.mutation<{ deletedCount: number }, string[]>({
      query: (ids) => ({ url: "products/v1/bulk", method: "DELETE", body: { ids } }),
      invalidatesTags: ["Product"],
    }),
    bulkUpdateProductStatus: build.mutation<{ updatedCount: number }, { ids: string[]; status: ProductItem["status"] }>(
      {
        query: (body) => ({ url: "products/v1/bulk", method: "PATCH", body }),
        invalidatesTags: ["Product"],
      },
    ),
  }),
});

export const {
  useBulkDeleteProductsMutation,
  useBulkUpdateProductStatusMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
export type { ProductInput } from "@/lib/dashboard/catalog";
