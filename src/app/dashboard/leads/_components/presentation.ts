/*
|-----------------------------------------
| setting up Leads presentation styles
| @author: Codex
|-----------------------------------------
*/

export const leadPresentation = {
  overview: {
    description: "See customer growth, team activity, and the health of your pipeline.",
    caption: "Your business at a glance",
    iconClass: "border-amber-200 bg-amber-50 text-amber-700",
    accentClass: "border-t-amber-400",
  },
  funnels: {
    description: "Build a clear journey and organize every stage of your customer pipeline.",
    caption: "Shape the customer journey",
    iconClass: "border-violet-200 bg-violet-50 text-violet-700",
    accentClass: "border-t-violet-400",
  },
  customers: {
    description: "Keep customer details, assignments, and counselling in one place.",
    caption: "Make every connection count",
    iconClass: "border-sky-200 bg-sky-50 text-sky-700",
    accentClass: "border-t-sky-400",
  },
  councilors: {
    description: "Manage the people who guide your customers and keep relationships moving.",
    caption: "Support your customer team",
    iconClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    accentClass: "border-t-emerald-400",
  },
  "my-leads": {
    description: "Focus on the customers assigned to you and take the next step.",
    caption: "Your personal lead workspace",
    iconClass: "border-rose-200 bg-rose-50 text-rose-700",
    accentClass: "border-t-rose-400",
  },
} as const;

export const leadPanel = "min-w-0 rounded-sm border border-[#eadfca] bg-white shadow-[0_2px_8px_rgba(120,80,30,0.035)]";
export const leadInput = "h-10 rounded-sm border-[#eadfca] bg-white px-3 focus:border-amber-500 focus:ring-amber-100";
