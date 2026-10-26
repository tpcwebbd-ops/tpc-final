# Leads

`/dashboard/leads` contains five navigation cards. Its subpages are Overview,
Funnels, Customers, Councilors, and My Leads. Existing installations receive
permission-filtered navigation from persisted sidebar records. `/tools/import-data`
includes the permanent sidebar defaults and preserves existing IDs when syncing.

## Access and assignment

With `AuthorizationEnable=true`, Leads recognizes Developer, Admin, and Councilor
roles from the existing Access and Role records. Counselor/Councillor/Counsellor
spellings are accepted. Each operation also requires its configured dashboard-path
CRUD permission; an explicit Leads child entry controls that area's permissions.
Developer has the same management workflow as Admin.

With `AuthorizationEnable=false`, signed-in users need no role to perform CRUD,
import, or assignment operations. Blocked access still fails. My Leads remains
scoped to the authenticated session email in both modes.

An Admin or Developer creates an active councilor contact using the person's login email,
then assigns their Councilor role through the existing Admin Access editor.
Adding a contact does not grant an account a role. With roles enabled, inactive
councilor contacts cannot use the Leads API. Blocked Access records are denied in both modes.

| Action                                        | Admin / Developer                     | Councilor                                                   |
| --------------------------------------------- | ------------------------------------- | ----------------------------------------------------------- |
| Read overview, funnels, councilors, customers | Yes                                   | Customers: own plus unassigned; overview follows that scope |
| Manage funnels and councilors                 | Yes                                   | No                                                          |
| Add/import customers                          | Yes                                   | Yes, assigned to themselves                                 |
| Edit/delete/bulk-update customers             | All                                   | Their own assignments                                       |
| Assign, reassign, or unassign                 | Customers page                        | No                                                          |
| Take an unassigned active, unblocked customer | Use Assign                            | Atomic claim                                                |
| Record counselling                            | Their own active, unblocked customers | Their own active, unblocked customers                       |
| My Leads reads and writes                     | Their own assignments                 | Their own assignments                                       |

My Leads uses the normalized authenticated session email for reads, writes,
imports, and exports. Its assignment filters only narrow that scope. Supplying
another email or removing `mine` never expands a Councilor's mutation rights.
Councilor customer lists, search, filters, and Excel exports exclude customers
assigned to another councilor. Read-only reference options expose only names and
IDs (or assignee email), allowing permitted customer creation without granting
access to full funnel/contact records.

## Records

Customer mobile numbers are unique across both customer pages and imports.
Formatting is removed; Bangladesh local `01…`, `8801…`, and `+8801…` numbers
share a canonical key. International numbers are stored with `+`. Email is
optional for customers and required/unique for councilor contacts.

Funnel positions are positive unique integers. Editing to an occupied position
returns a conflict; choose an unused position. Referenced funnels/councilors
cannot be deleted until their customers are moved/reassigned. A councilor's
email cannot change while it owns customer assignments.

Lists use RTK Query, pagination, and page sizes 10/25/50/100. Typing filters the
loaded page first. When it has no match, Search database submits the query to
MongoDB. Export applies the current search and filters across all result pages.
Refresh buttons have a 60-second countdown.

## Excel

Customers and councilors support `.xlsx` export and `.xlsx`/`.xls` import.
Download the page's template. Each import accepts at most 100 data rows and
5 MB. Store Mobile cells as text to preserve leading zeros.

Customer headers: `Name`, `Mobile`, `Email`, `Funnel ID`, `Status`, `Blocked`.
Councilor headers: `Name`, `Mobile`, `Email`, `Status`.
Find a Funnel ID in its View dialog. Status defaults to active; Blocked defaults
to false. Assignment fields in exports are informational and cannot assign
imported records. The server validates each imported row and reports row-level
failures; successful rows stay saved. Reimport only corrected failed rows.

## Metrics

Summary counts come from customers the actor can access. New in 30 days and counselling
in the last 24 hours use rolling server-time windows. Counselling counts sessions
created through Mark counselled, rather than generic customer edits.

Graphs cover the last 12 calendar months in Asia/Dhaka. Customer growth counts
creation dates. Business facts counts new customers, assignments, and counselling
events. Distribution and funnel charts show the current status/funnel of each
month's newly created customers; these are cohorts, not historical snapshots.
No revenue figures are inferred from customer records.

## Verification

`npm run test:leads` creates a random disposable MongoDB database, seeds synthetic
accounts, starts a temporary copy of the app at `http://127.0.0.1:3001`, exercises
the real authenticated HTTP handlers, and removes its server/database/copy. It never writes
to the application's configured database. Redis, email delivery, and OAuth are
disabled in this test process. The application's running development server,
Next cache, generated types, and `.env.local` are left intact.

Use `node scripts/test-leads.cjs --authorization-disabled` to repeat the same
role-free CRUD and personal ownership checks with authorization disabled. `--keep-open`
leaves the disposable app available for browser QA until Ctrl+C. Synthetic
accounts include `qa-admin@example.test`, `qa-developer@example.test`, `qa-councilor-a@example.test`, and
`qa-councilor-b@example.test`, with password `Leads-QA-only-2026!`.

`npm run test:dashboard-authorization` checks flag behavior, role metadata,
create-only page entry, parent navigation, independent CRUD grants, missing roles,
and Councilor scope without connecting to or modifying any database.
