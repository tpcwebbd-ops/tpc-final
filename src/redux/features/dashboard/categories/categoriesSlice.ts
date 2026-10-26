/*
|-----------------------------------------
| setting up categoriesSlice.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 01 September, 2026
|-----------------------------------------
*/

import { type Category, type CategoryInput } from "@/lib/dashboard/catalog";
import { apiSlice } from "@/redux/api/apiSlice";

export type CategoryItem = Omit<Category, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string };
export type CategoryListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: CategoryItem["status"] | "";
};
export type CategoryListResponse = { items: CategoryItem[]; total: number; page: number; pageSize: number };

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<CategoryListResponse, CategoryListParams | void>({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.page) query.set("page", String(params.page));
        if (params?.pageSize) query.set("pageSize", String(params.pageSize));
        if (params?.search) query.set("search", params.search);
        if (params?.status) query.set("status", params.status);
        const search = query.toString();
        return `categories/v1${search ? `?${search}` : ""}`;
      },
      providesTags: ["Category"],
    }),
    createCategory: build.mutation<{ item: CategoryItem }, CategoryInput>({
      query: (body) => ({ url: "categories/v1", method: "POST", body }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: build.mutation<{ item: CategoryItem }, CategoryInput & Pick<CategoryItem, "id">>({
      query: ({ id, ...body }) => ({ url: `categories/v1/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: build.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `categories/v1/${id}`, method: "DELETE" }),
      invalidatesTags: ["Category"],
    }),
    bulkDeleteCategories: build.mutation<{ deletedCount: number }, string[]>({
      query: (ids) => ({ url: "categories/v1/bulk", method: "DELETE", body: { ids } }),
      invalidatesTags: ["Category"],
    }),
    bulkUpdateCategoryStatus: build.mutation<
      { updatedCount: number },
      { ids: string[]; status: CategoryItem["status"] }
    >({
      query: (body) => ({ url: "categories/v1/bulk", method: "PATCH", body }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useBulkDeleteCategoriesMutation,
  useBulkUpdateCategoryStatusMutation,
} = categoriesApi;
export type { CategoryInput } from "@/lib/dashboard/catalog";
