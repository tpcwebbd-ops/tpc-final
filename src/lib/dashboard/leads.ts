/*
|-----------------------------------------
| setting up Leads contracts and input validation
| @author: Codex
|-----------------------------------------
*/

import type { DashboardOperation, DashboardPermission } from "./permissions";

export type LeadKind = "funnels" | "customers" | "councilors";
export type LeadStatus = "active" | "inactive";
export type LeadActor = {
  email: string;
  role: "admin" | "developer" | "councilor" | "unrestricted";
  bypassed?: boolean;
  permissions?: Record<string, DashboardPermission>;
};
export const leadIsManager = (actor: LeadActor) =>
  actor.bypassed === true || actor.role === "admin" || actor.role === "developer";
export const leadCan = (actor: LeadActor | undefined, area: string, operation: DashboardOperation) =>
  Boolean(actor && (actor.bypassed || actor.permissions?.[area]?.[operation]));
type LeadBase = { id: string; name: string; status: LeadStatus; createdAt: string; updatedAt: string };
export type LeadFunnel = LeadBase & { kind: "funnels"; position: number; description: string };
export type LeadCouncilor = LeadBase & { kind: "councilors"; mobile: string; email: string };
export type LeadCouncilorSummary = LeadCouncilor & {
  customerCount: number;
  customerStatuses: Record<LeadStatus, number>;
  funnels: {
    id: string;
    name: string;
    customerCount: number;
    statuses: Record<LeadStatus, number>;
  }[];
};
export type LeadOtherCustomerSummary = Pick<LeadCouncilorSummary, "id" | "name" | "customerCount" | "customerStatuses" | "funnels">;
export type LeadCouncilorSummaries = { items: LeadCouncilorSummary[]; others: LeadOtherCustomerSummary[] };
export type LeadNote = {
  id: string;
  note: string;
  authorEmail: string;
  authorName: string;
  createdAt: string;
};
export type LeadCustomer = LeadBase & {
  kind: "customers";
  mobile: string;
  email: string;
  funnelId: string;
  blocked: boolean;
  assignedTo: string | null;
  assignedAt: string | null;
  lastCounselledAt: string | null;
  funnelName?: string;
  assignedName?: string;
  notes?: LeadNote[];
};
export type LeadItem = LeadFunnel | LeadCouncilor | LeadCustomer;
export type LeadInput =
  | Omit<LeadFunnel, "id" | "createdAt" | "updatedAt">
  | Omit<LeadCouncilor, "id" | "createdAt" | "updatedAt">
  | Omit<
      LeadCustomer,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "assignedTo"
      | "assignedAt"
      | "lastCounselledAt"
      | "funnelName"
      | "assignedName"
      | "notes"
    >;
export type LeadListParams = {
  kind: LeadKind;
  mine?: boolean;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  funnelId?: string;
  assignment?: string;
  councilor?: string;
};
export type LeadList = { items: LeadItem[]; total: number; page: number; pageSize: number; actor: LeadActor };
export type LeadOverview = {
  actor: LeadActor;
  summary: { all: number; new30Days: number; active: number; inactive: number };
  counts: { funnels: number; customers: number; councilors: number; mine: number };
  progress: { email: string; name: string; assigned: number; counselling24Hours: number; inactive: number }[];
  months: {
    month: string;
    customers: number;
    assignments: number;
    counselling: number;
    active: number;
    inactive: number;
    blocked: number;
    funnels: { name: string; count: number }[];
  }[];
};

export const leadTabs = [
  { label: "Overview", path: "overview", icon: "BarChart" },
  { label: "Funnels", path: "funnels", icon: "Filter" },
  { label: "Customers", path: "customers", icon: "Users" },
  { label: "Councilors", path: "councilors", icon: "User" },
  { label: "My Leads", path: "my-leads", icon: "FileText" },
] as const;

export const isLeadKind = (kind: unknown): kind is LeadKind =>
  typeof kind === "string" && ["funnels", "customers", "councilors"].includes(kind);
export const normalizeLeadEmail = (email: string) => email.trim().toLowerCase();
export function leadRole(name: string | null | undefined): LeadActor["role"] | null {
  const role = name?.trim().toLowerCase();
  if (role === "admin" || role === "developer") return role;
  return ["councilor", "counselor", "councillor", "counsellor"].includes(role ?? "") ? "councilor" : null;
}
export function normalizeLeadMobile(value: string) {
  const mobile = value
    .trim()
    .replace(/[\s().-]/g, "")
    .replace(/^00/, "+");
  // Local and international Bangladesh numbers share one unique database key.
  if (/^01\d{9}$/.test(mobile)) return `+88${mobile}`;
  if (/^8801\d{9}$/.test(mobile)) return `+${mobile}`;
  return /^\+?\d{7,15}$/.test(mobile) ? `+${mobile.replace(/^\+/, "")}` : null;
}
export function parseLeadInput(kind: LeadKind, raw: unknown): LeadInput {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Enter valid record details.");
  const body = raw as Record<string, unknown>;
  const allowed = [
    "kind",
    "name",
    "status",
    ...(kind === "funnels" ? ["position", "description"] : ["mobile", "email"]),
    ...(kind === "customers" ? ["funnelId", "blocked"] : []),
  ];
  if (Object.keys(body).some((key) => !allowed.includes(key)))
    throw new Error("Unsupported fields. Use the assignment action to change a councilor.");
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name || name.length > 160) throw new Error("Name must contain 1–160 characters.");
  const status = body.status ?? "active";
  if (status !== "active" && status !== "inactive") throw new Error("Choose active or inactive status.");
  if (kind === "funnels") {
    const position = body.position;
    const description = body.description ?? "";
    if (typeof position !== "number" || !Number.isSafeInteger(position) || position < 1 || position > 1_000_000)
      throw new Error("Position must be a unique whole number from 1 to 1000000.");
    if (typeof description !== "string" || description.length > 2000)
      throw new Error("Description must contain at most 2000 characters.");
    return { kind, name, status, position, description: description.trim() };
  }
  const mobile = typeof body.mobile === "string" ? normalizeLeadMobile(body.mobile) : null;
  const email = typeof body.email === "string" ? normalizeLeadEmail(body.email) : "";
  if (!mobile) throw new Error("Enter a valid mobile number (7–15 digits).");
  if ((!email && kind === "councilors") || (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)))
    throw new Error("Enter a valid email address.");
  if (kind === "councilors") return { kind, name, mobile, email, status };
  if (typeof body.funnelId !== "string" || !body.funnelId.trim() || body.funnelId.length > 100)
    throw new Error("Choose a funnel.");
  if (body.blocked !== undefined && typeof body.blocked !== "boolean") throw new Error("Block must be true or false.");
  return { kind, name, mobile, email, status, funnelId: body.funnelId.trim(), blocked: body.blocked ?? false };
}

/** This predicate is also applied to every item and bulk mutation. */
export function leadOwnershipFilter(actor: LeadActor, mine: boolean, mutation = false) {
  if (mine || (mutation && !leadIsManager(actor))) return { assignedTo: actor.email };
  return !leadIsManager(actor) ? { assignedTo: { $in: [actor.email, null] } } : {};
}
export const leadClaimFilter = (id: string) => ({ id, assignedTo: null, blocked: false, status: "active" as const });
export function leadIds(raw: unknown) {
  if (
    !Array.isArray(raw) ||
    raw.length < 1 ||
    raw.length > 100 ||
    raw.some((id) => typeof id !== "string" || !id.trim() || id.length > 100)
  )
    throw new Error("Select between 1 and 100 records.");
  return [...new Set(raw as string[])];
}
