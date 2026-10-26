/*
|-----------------------------------------
| setting up use-dashboard-permissions.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 10 October, 2026
|-----------------------------------------
*/

"use client";

import { authClient } from "@/app/api/lib/auth-client";
import { useGetSidebarsQuery } from "@/redux/features/dashboard/sidebars/sidebarSlice";

import { dashboardCan, dashboardCanEnter, type DashboardOperation } from "./permissions";

export function useDashboardPermissions(path: string) {
  const { data: session } = authClient.useSession();
  const query = useGetSidebarsQuery(undefined, { skip: !session });
  return {
    ...query,
    can: (operation: DashboardOperation) => dashboardCan(query.data?.access, path, operation),
    canEnter: (target: string) => dashboardCanEnter(query.data?.access, target),
  };
}
