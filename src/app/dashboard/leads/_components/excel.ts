/*
|-----------------------------------------
| setting up Leads Excel import and export
| @author: Codex
|-----------------------------------------
*/

import type { LeadInput, LeadItem, LeadKind } from "@/lib/dashboard/leads";

const columns = (kind: LeadKind) =>
  kind === "councilors"
    ? ["Name", "Mobile", "Email", "Status"]
    : ["Name", "Mobile", "Email", "Funnel ID", "Status", "Blocked"];
export async function exportLeadExcel(kind: LeadKind, items: LeadItem[], template = false) {
  const XLSX = await import("xlsx");
  const rows = items.flatMap((item) => {
    if (item.kind === "funnels") return [];
    return [
      {
        Name: item.name,
        Mobile: item.mobile,
        Email: item.email,
        ...(item.kind === "customers"
          ? {
              "Funnel ID": item.funnelId,
              "Funnel name": item.funnelName ?? "",
              Blocked: item.blocked ? "true" : "false",
              "Assigned councilor": item.assignedTo ?? "",
              "Last counselled": item.lastCounselledAt ?? "",
            }
          : {}),
        Status: item.status,
      },
    ];
  });
  const sheet = XLSX.utils.json_to_sheet(rows, { header: columns(kind) });
  sheet["!cols"] = Array.from({ length: 10 }, () => ({ wch: 24 }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Leads");
  XLSX.writeFile(workbook, `leads-${kind}${template ? "-template" : ""}.xlsx`, { compression: true });
}
export async function readLeadExcel(file: File, kind: LeadKind): Promise<LeadInput[]> {
  if (kind === "funnels") throw new Error("Import supports customers and councilors.");
  if (!/\.xlsx?$/i.test(file.name)) throw new Error("Choose an .xlsx or .xls workbook.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Choose an Excel file smaller than 5 MB.");
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellFormula: false, sheetRows: 102 });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("The workbook has no sheet.");
  if (XLSX.utils.decode_range(sheet["!fullref"] ?? sheet["!ref"] ?? "A1").e.r > 100)
    throw new Error("Import at most 100 data rows per file; split larger workbooks first.");
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { raw: false, defval: "", blankrows: false });
  if (!rows.length || rows.length > 100) throw new Error("Import between 1 and 100 rows per file.");
  const headers = Object.keys(rows[0]).map((key) => key.trim().toLowerCase());
  if (!["name", "mobile", ...(kind === "councilors" ? ["email"] : ["funnel id"])].every((key) => headers.includes(key)))
    throw new Error("Required columns are missing. Download the template and keep its headers.");
  return rows.map((row, index) => {
    const values = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key.trim().toLowerCase(), String(value).trim()]),
    );
    const common = {
      name: values.name ?? "",
      mobile: values.mobile ?? "",
      email: values.email ?? "",
      status: values.status?.toLowerCase() || "active",
    };
    if (kind === "councilors") return { kind, ...common } as LeadInput;
    const blocked = (values.blocked || "false").toLowerCase();
    if (!["true", "false", "yes", "no", "1", "0"].includes(blocked))
      throw new Error(`Row ${index + 2}: Blocked must be true or false.`);
    return {
      kind,
      ...common,
      funnelId: values["funnel id"] ?? "",
      blocked: ["true", "yes", "1"].includes(blocked),
    } as LeadInput;
  });
}
