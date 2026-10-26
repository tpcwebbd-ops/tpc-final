/*
|-----------------------------------------
| setting up Leads uses the dashboard RTK Query service
| @author: Codex
|-----------------------------------------
*/

import type {
  LeadCouncilorSummaries,
  LeadInput,
  LeadKind,
  LeadList,
  LeadListParams,
  LeadOverview,
  LeadStatus,
} from "@/lib/dashboard/leads";
import { apiSlice } from "@/redux/api/apiSlice";

export type LeadMutation = {
  operation: "create" | "update" | "delete" | "status" | "claim" | "assign" | "counsel" | "note" | "import";
  kind: LeadKind;
  mine?: boolean;
  id?: string;
  ids?: string[];
  data?: LeadInput;
  rows?: LeadInput[];
  status?: LeadStatus;
  assignedTo?: string | null;
  note?: string;
};
export type LeadMutationResult = {
  imported?: number;
  errors?: { row: number; error: string }[];
  updatedCount?: number;
  deletedCount?: number;
};
export type LeadDemoState = { available: boolean };
export type LeadDemoResult = {
  funnels: number;
  customers: number;
  councilors: number;
  assignments: number;
  notes: number;
  unassigned: number;
};
export const leadQueryString = (params: LeadListParams) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return query.toString();
};
const leadsApi = apiSlice.enhanceEndpoints({ addTagTypes: ["Leads"] }).injectEndpoints({
  endpoints: (build) => ({
    getLeadOptions: build.query<
      { items: { value: string; name: string }[]; total: number; page: number; pageSize: number },
      {
        kind: Exclude<LeadKind, "customers">;
        area?: string;
        page: number;
        pageSize: number;
        search: string;
        status?: string;
      }
    >({
      query: ({ kind, ...params }) => ({ url: "leads/v1", params: { ...params, lookup: kind } }),
      providesTags: ["Leads"],
    }),
    getLeads: build.query<LeadList, LeadListParams>({
      query: (params) => `leads/v1?${leadQueryString(params)}`,
      providesTags: ["Leads"],
    }),
    getLeadsOverview: build.query<LeadOverview, void>({
      query: () => "leads/v1?overview=true",
      providesTags: ["Leads"],
    }),
    getLeadsCouncilorSummaries: build.query<LeadCouncilorSummaries, void>({
      query: () => "leads/v1?councilorSummaries=true",
      providesTags: ["Leads"],
    }),
    getLeadsDemoState: build.query<LeadDemoState, void>({
      query: () => "leads/v1/demo",
      providesTags: ["Leads"],
    }),
    seedLeadsDemo: build.mutation<LeadDemoResult, void>({
      // Cookie-authenticated POST requests use the shared JSON media-type guard.
      query: () => ({ url: "leads/v1/demo", method: "POST", body: {} }),
      invalidatesTags: ["Leads"],
    }),
    mutateLeads: build.mutation<LeadMutationResult, LeadMutation>({
      query: ({ operation, kind, mine, id, ids, data, rows, status, assignedTo, note }) => {
        const query = leadQueryString({ kind, mine });
        if (operation === "create") return { url: `leads/v1?${query}`, method: "POST", body: data };
        if (operation === "import") return { url: "leads/v1/import", method: "POST", body: { kind, mine, rows } };
        if (operation === "assign" && ids)
          return {
            url: "leads/v1/bulk",
            method: "PATCH",
            body: { kind, mine, ids, assignedTo },
          };
        if (operation === "delete" || operation === "status")
          return {
            url: "leads/v1/bulk",
            method: operation === "delete" ? "DELETE" : "PATCH",
            body: { kind, mine, ids, status },
          };
        return {
          url: `leads/v1/${encodeURIComponent(id ?? "")}?${query}`,
          method: "PATCH",
          body:
            operation === "update"
              ? data
              : {
                  action: operation,
                  ...(operation === "assign" ? { assignedTo } : {}),
                  ...(operation === "note" ? { note } : {}),
                },
        };
      },
      invalidatesTags: ["Leads"],
    }),
  }),
});
export const {
  useGetLeadOptionsQuery,
  useGetLeadsQuery,
  useGetLeadsCouncilorSummariesQuery,
  useLazyGetLeadsQuery,
  useGetLeadsOverviewQuery,
  useGetLeadsDemoStateQuery,
  useSeedLeadsDemoMutation,
  useMutateLeadsMutation,
} = leadsApi;
