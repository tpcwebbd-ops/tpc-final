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
const permissions = load("src/lib/dashboard/permissions.ts");
const leads = load("src/lib/dashboard/leads.ts", { "./permissions": permissions });
const rows = [
  { id: "admin", url: "/dashboard/admin", parentId: null },
  { id: "role", url: "/dashboard/admin/role", parentId: "admin" },
  { id: "products", url: "/dashboard/products", parentId: null },
  { id: "leads", url: "/dashboard/leads", parentId: null },
  { id: "customers", url: "/dashboard/leads/customers", parentId: "leads" },
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
      assert.equal((await auth.authorizeDashboardRequest(session, "/api/dashboard/products/v1", method)).allowed, true);
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
      products: { ...permissions.emptyDashboardPermission, create: true },
      role: { ...permissions.emptyDashboardPermission, read: true },
    });
    assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard/products", "GET")).allowed, true);
    assert.equal((await auth.authorizeDashboardRequest(session, "/api/dashboard/products/v1", "GET")).allowed, false);
    assert.equal((await auth.authorizeDashboardRequest(session, "/api/dashboard/products/v1", "POST")).allowed, true);
    assert.equal((await auth.authorizeDashboardRequest(session, "/dashboard/admin", "GET")).allowed, true);
    assert.equal((await auth.authorizeDashboardRequest(session, "/api/dashboard/access/v1", "GET")).allowed, false);
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
