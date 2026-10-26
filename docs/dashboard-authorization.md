# Dashboard authorization setup

1. Keep `.env.local` at `AuthorizationEnable=false` while setting up the website.
   Sign-in and blocked-account checks remain active. The dashboard displays the
   assigned role when one exists; missing assignments display "Not assigned".
2. Open `/tools/import-data` and sync the desired sidebar/page defaults. Sync
   preserves existing sidebar IDs and therefore role grants. Its status uses the
   stored inventory rather than the account's filtered navigation. When roles are
   enabled, syncing requires Create and Update for each selected resource area.
3. Configure roles at `/dashboard/admin/role` using the dashboard paths and CRUD
   checkboxes. Page entry and sidebar visibility accept any permitted operation;
   reading data still requires Read. A parent container can open when a child is
   permitted, and its quick links remain filtered. Explicit Leads child entries
   control their own grants instead of inheriting an unrestricted parent grant.
4. Assign roles at `/dashboard/admin/access`. Use **Review missing assignments**
   to find broken role IDs, inspect the suggested role name, and explicitly choose
   a replacement. Existing assignments are never promoted based on their saved
   role-name label. Reassign all users before deleting a role. Role renames update
   assignment labels. Individual and bulk access deletion protect your own access
   and revoke the removed users' sessions.
5. After reviewing assignments and permissions, change the flag to `true` and
   reload/restart the app as needed for the deployment environment. Validate the
   intended accounts using the roles assigned to them.

The 2026-10-10 audit found 13 missing-role assignments among 14 access records.
Their saved labels were user (5), Developer (2), Admin (2), Councilor (3), and
Client (1). These labels are review suggestions, not authorization evidence.
The current role list has no Client role; choose the appropriate replacement or
create that role with its intended permissions before assigning it.

Leads supports Developer/Admin management and Councilor ownership. With roles
enabled, a Councilor reads their own and unassigned customers, can claim an
active unblocked unassigned customer, and changes only their own assignments.
Other councilors' assigned leads are excluded from lists, exports, and overview
metrics. Councilor grants never authorize access/role/account administration.
My Leads remains personal in either authorization mode.

Role, access, sidebar, and import mutations invalidate the relevant client
permission/navigation/Leads caches. The APIs independently verify session-derived
access; UI controls do not grant permission.

Verification commands:

```powershell
node scripts/test-dashboard-authorization.cjs
node scripts/test-leads.cjs
node scripts/test-leads.cjs --authorization-disabled
```

The HTTP tests use a generated disposable database and a temporary app copy.
The configured database, `.env.local`, and running development server are preserved.
