/*
|-----------------------------------------
| Dashboard authorization regression tests, without live database writes
| @author: Codex
|-----------------------------------------
*/
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

function load(file, imports = {}) {
  const module = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function("require", "module", "exports", compiled)(
    (name) => (Object.hasOwn(imports, name) ? imports[name] : require(name)),
    module,
    module.exports,
  );
  return module.exports;
}
const retiredRoutes = load("src/lib/dashboard/retired-routes.ts");
const permissions = load("src/lib/dashboard/permissions.ts", { "@/lib/dashboard/retired-routes": retiredRoutes });
const leads = load("src/lib/dashboard/leads.ts", { "./permissions": permissions });
const rows = [
  { id: "admin", url: "/dashboard/admin", parentId: null },
  { id: "role", url: "/dashboard/admin/role", parentId: "admin" },
  { id: "courses", url: "/dashboard/course", parentId: null },
  { id: "mycourses", url: "/dashboard/my-course", parentId: null },
  { id: "leads", url: "/dashboard/leads", parentId: null },
  { id: "customers", url: "/dashboard/leads/customers", parentId: "leads" },
  { id: "developer", url: "/dashboard/developer", parentId: null },
  { id: "sidebar", url: "/dashboard/developer/sidebar", parentId: "developer" },
];
let role, access;
const collection = (records) => ({
  findOne: async (query) =>
    records().find((row) =>
      Object.entries(query).every(([key, value]) =>
        value instanceof RegExp ? value.test(row[key]) : row[key] === value,
      ),
    ) ?? null,
  find: () => ({ toArray: async () => records() }),
  insertOne: async () => {
    throw new Error("Unexpected database write");
  },
  updateOne: async () => {
    throw new Error("Unexpected database write");
  },
});
const auth = load("src/app/api/lib/dashboard-authorization.ts", {
  "@/lib/dashboard/retired-routes": retiredRoutes,
  "@/app/api/lib/redis": { invalidateDashboardCache: async () => {}, redisKeys: {} },
  "@/lib/dashboard/leads": leads,
  "@/lib/dashboard/permissions": permissions,
  "@/lib/models/auth": {
    accessesCollection: () => collection(() => (access ? [access] : [])),
    rolesCollection: () => collection(() => (role ? [role] : [])),
    sidebarsCollection: () => collection(() => rows),
  },
});
const session = { user: { id: "synthetic", email: "qa@example.test" } };
let signedIn = session;
const sidebarCache = new Map();
const sidebarService = load("src/lib/services/sidebars.ts", {
  "server-only": {},
  "@/app/api/lib/redis": {
    getCache: async (key) => sidebarCache.get(key),
    setCache: async (key, value) => sidebarCache.set(key, value),
    redisKeys: { sidebars: "sidebars" },
  },
  "@/lib/dashboard/retired-routes": retiredRoutes,
  "@/lib/models/auth": {
    findSidebars: async () => rows.map((row, index) => ({ ...row, name: row.id, icon: "Home", position: index })),
  },
});
const sidebarRoute = load("src/app/api/dashboard/sidebars/v1/route.ts", {
  "@/app/api/lib/api-rate-limit": { rateLimitDistributed: async () => null },
  "@/app/api/lib/auth": { auth: { api: { getSession: async () => signedIn } } },
  "@/app/api/lib/dashboard-authorization": auth,
  "@/lib/dashboard/permissions": permissions,
  "@/lib/services/sidebars": sidebarService,
});
const navigation = (scope = "") =>
  sidebarRoute.GET(new Request(`https://example.test/api/dashboard/sidebars/v1${scope}`));
const sidebarIds = (body) => body.items.map((item) => item.id).sort();
const full = permissions.fullDashboardPermission;
let passed = 0;
async function check(name, run) {
  await run();
  passed++;
  console.log(`PASS ${name}`);
}
function assign(flag, name, grants = {}) {
  process.env.AuthorizationEnable = flag;
  role = { id: "r", name, permissions: grants };
  access = { id: "a", email: session.user.email, roleId: "r", roleName: name, blocked: false };
}

(async () => {
  await check("disabled mode retains the assigned role and permits every CRUD operation", async () => {
    assign("false", "Developer");
    assert.equal((await auth.getDashboardAccessState(session)).roleName, "Developer");
    for (const method of ["GET", "POST", "PATCH", "DELETE"]) {
      assert.equal((await auth.authorizeDashboardRequest(session, "/api/dashboard/courses/v1", method)).allowed, true);
      assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard/leads/customers", method)).allowed, true);
    }
  });
  await check("disabled mode needs no role or assignment, while blocked accounts remain denied", async () => {
    assign("false", "Client");
    access = null;
    role = null;
    assert.equal((await auth.getLeadsActor(session)).bypassed, true);
    assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard", "GET")).allowed, true);
    assign("false", "Developer");
    access.blocked = true;
    assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard", "GET")).allowed, false);
  });
  await check("enabled Admin and Developer require configured Leads CRUD grants", async () => {
    for (const name of ["Admin", "Developer"]) {
      assign("true", name);
      assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard/leads", "GET")).allowed, false);
      assign("true", name, { customers: full });
      assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard/leads/customers", "GET")).allowed, true);
      assert.equal((await auth.getLeadsActor(session)).permissions.customers.delete, true);
    }
  });
  await check("a child area can explicitly restrict grants on the Leads parent", async () => {
    assign("true", "Admin", { leads: full, customers: { ...full, create: false } });
    assert.equal((await auth.getLeadsActor(session)).permissions.customers.create, false);
    assert.equal((await auth.getLeadsActor(session)).permissions.customers.read, true);
  });
  await check("create-only pages and parent navigation do not grant read API access", async () => {
    assign("true", "Editor", {
      courses: { ...permissions.emptyDashboardPermission, create: true },
      role: { ...permissions.emptyDashboardPermission, read: true },
    });
    assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard/course", "GET")).allowed, true);
    assert.equal((await auth.authorizeDashboardRequest(session, "/api/dashboard/courses/v1", "GET")).allowed, false);
    assert.equal((await auth.authorizeDashboardRequest(session, "/api/dashboard/courses/v1", "POST")).allowed, true);
    assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard/admin", "GET")).allowed, true);
    assert.equal((await auth.authorizeDashboardRequest(session, "/api/dashboard/access/v1", "GET")).allowed, false);
  });
  await check("student exam access does not grant staff results or allowance approval", async () => {
    assign("true", "Student", { mycourses: full });
    for (const method of ["GET", "POST"]) {
      assert.equal(
        (await auth.authorizeDashboardRequest(session, "/api/dashboard/my-course/v1/exams", method)).allowed,
        true,
      );
    }
    for (const method of ["GET", "PATCH"]) {
      assert.equal(
        (await auth.authorizeDashboardRequest(session, "/api/dashboard/courses/v1/exams", method)).allowed,
        false,
      );
    }
    assign("true", "Admin", { courses: full });
    for (const method of ["GET", "PATCH"]) {
      assert.equal(
        (await auth.authorizeDashboardRequest(session, "/api/dashboard/courses/v1/exams", method)).allowed,
        true,
      );
    }
  });
  await check("Councilor cannot manage roles or access even with stale administrative grants", async () => {
    assign("true", "Councilor", { role: full, customers: full });
    assert.equal((await auth.authorizeDashboardRequest(session, "/api/dashboard/roles/v1", "POST")).allowed, false);
    assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard/leads/customers", "GET")).allowed, true);
  });
  await check("missing roles and unrelated roles fail closed in enabled mode", async () => {
    assign("true", "Developer", { leads: full });
    role = null;
    assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard", "GET")).allowed, false);
    assert.equal(await auth.getLeadsActor(session), null);
    assign("true", "Client", { leads: full, customers: full });
    assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard/leads/customers", "GET")).allowed, false);
  });
  await check("only the exact false environment value disables authorization", async () => {
    assign("False", "Developer");
    assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard", "GET")).allowed, false);
    delete process.env.AuthorizationEnable;
    assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard", "GET")).allowed, false);
  });
  await check(
    "custom database roles filter navigation in both authorization modes without exposing siblings",
    async () => {
      for (const flag of ["false", "true"]) {
        assign(flag, "Learning editor", {
          courses: { ...permissions.emptyDashboardPermission, create: true },
          role: { ...permissions.emptyDashboardPermission, read: true },
        });
        const response = await navigation();
        assert.equal(response.status, 200);
        assert.equal(response.headers.get("Cache-Control"), "private, no-store");
        const body = await response.json();
        assert.deepEqual(sidebarIds(body), ["admin", "courses", "role"]);
        assert.equal(body.roleName, "Learning editor");
        assert.equal(body.navigationAccess.bypassed, false);
        assert.equal(permissions.dashboardCan(body.navigationAccess, "/dashboard/course", "read"), false);
        assert.equal(permissions.dashboardCan(body.access, "/dashboard/course", "read"), flag === "false");
      }
    },
  );
  await check("saved user-role permissions are respected without request-time database writes", async () => {
    for (const flag of ["false", "true"]) {
      assign(flag, "user", { courses: full });
      assert.deepEqual(sidebarIds(await (await navigation()).json()), ["courses"]);
      assert.deepEqual(role.permissions, { courses: full });
    }
  });
  await check("role edits and renames update navigation while the shared sidebar inventory stays cached", async () => {
    assign("true", "Student", { mycourses: full });
    assert.deepEqual(sidebarIds(await (await navigation()).json()), ["mycourses"]);
    role.permissions = { courses: full };
    role.name = "Course assistant";
    const body = await (await navigation()).json();
    assert.deepEqual(sidebarIds(body), ["courses"]);
    assert.equal(body.roleName, "Course assistant");
    assign("true", "Another custom role", { role: full });
    assert.deepEqual(sidebarIds(await (await navigation()).json()), ["admin", "role"]);
  });
  await check("empty, stale, and missing role assignments never expose all sidebar items", async () => {
    for (const flag of ["false", "true"]) {
      assign(flag, "No grants", { "deleted-sidebar-id": full });
      assert.deepEqual(sidebarIds(await (await navigation()).json()), []);
      role = null;
      assert.deepEqual(sidebarIds(await (await navigation()).json()), []);
    }
    assign("false", "Developer", { sidebar: full });
    access = null;
    assert.deepEqual(sidebarIds(await (await navigation()).json()), []);
  });
  await check("full sidebar inventory is isolated from navigation and requires management access", async () => {
    assign("true", "Student", { mycourses: full });
    assert.equal((await navigation("?scope=all")).status, 403);
    assign("true", "Navigation editor", { sidebar: { ...permissions.emptyDashboardPermission, update: true } });
    const inventory = await navigation("?scope=all");
    assert.equal(inventory.status, 200);
    assert.deepEqual(sidebarIds(await inventory.json()), rows.map((row) => row.id).sort());
    assert.deepEqual(sidebarIds(await (await navigation()).json()), ["developer", "sidebar"]);
    assign("false", "Student", { mycourses: full });
    assert.equal((await navigation("?scope=all")).status, 200);
    assert.deepEqual(sidebarIds(await (await navigation()).json()), ["mycourses"]);
  });
  await check("sidebar API rejects anonymous and blocked sessions, including inventory requests", async () => {
    signedIn = null;
    assert.equal((await navigation()).status, 401);
    signedIn = session;
    assign("false", "Developer", { sidebar: full });
    access.blocked = true;
    assert.equal((await navigation()).status, 403);
    assert.equal((await navigation("?scope=all")).status, 403);
  });
  await check(
    "Councilor reads own plus unassigned and writes only own; My Leads stays personal in bypass mode",
    async () => {
      const actor = { email: "qa@example.test", role: "councilor" };
      assert.deepEqual(leads.leadOwnershipFilter(actor, false), { assignedTo: { $in: [actor.email, null] } });
      assert.deepEqual(leads.leadOwnershipFilter(actor, false, true), { assignedTo: actor.email });
      assert.deepEqual(leads.leadOwnershipFilter({ ...actor, bypassed: true }, false, true), {});
      assert.deepEqual(leads.leadOwnershipFilter({ ...actor, bypassed: true }, true), { assignedTo: actor.email });
    },
  );
  console.log(`Dashboard authorization: ${passed} scenarios passed.`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
