/*
|-----------------------------------------
| Leads HTTP integration tests in a disposable MongoDB database
| Run: node scripts/test-leads.cjs [--keep-open]
|-----------------------------------------
*/

const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const { readFileSync, writeFileSync, cpSync, mkdirSync, rmSync, symlinkSync, existsSync } = require("node:fs");
const os = require("node:os");
const Module = require("node:module");
const path = require("node:path");
const { loadEnvConfig } = require("@next/env");
const { MongoClient, ObjectId } = require("mongodb");

loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const qaName = `leads_qa_${randomUUID().replaceAll("-", "").slice(0, 24)}`;
const sourceUri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/demo-apps";
// Only this newly generated database is ever written or dropped.
const qaUri = sourceUri.replace(/^(mongodb(?:\+srv)?:\/\/[^/]+)(?:\/[^?]*)?(\?.*)?$/, `$1/${qaName}$2`);
if (!qaUri.includes(`/${qaName}`) || !/^leads_qa_[a-f0-9]{24}$/.test(qaName))
  throw new Error("QA database isolation failed.");
const mongo = new MongoClient(qaUri, { serverSelectionTimeoutMS: 10000 });
const db = mongo.db(qaName);
const qaRoot = path.resolve(os.tmpdir(), `shop-${qaName}`);
const qaRootPrefix = path.resolve(os.tmpdir()) + path.sep;
const authorizationDisabled = process.argv.includes("--authorization-disabled");
const origin = "http://127.0.0.1:3001";
const password = "Leads-QA-only-2026!";
let server,
  passed = 0,
  closing = false;

async function cleanup() {
  if (closing) return;
  closing = true;
  if (server && !server.killed) {
    if (process.platform === "win32") {
      await new Promise((resolve) => {
        const stop = spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], {
          windowsHide: true,
          stdio: "ignore",
        });
        stop.on("close", resolve);
        stop.on("error", resolve);
      });
    } else server.kill("SIGTERM");
  }
  // Guard the final resolved database name before the destructive cleanup.
  if (db.databaseName !== qaName || !/^leads_qa_[a-f0-9]{24}$/.test(db.databaseName))
    throw new Error("Refusing unsafe database cleanup.");
  try {
    await db.dropDatabase();
  } finally {
    await mongo.close();
    if (!qaRoot.startsWith(qaRootPrefix) || !/^shop-leads_qa_[a-f0-9]{24}$/.test(path.basename(qaRoot)))
      throw new Error("Refusing unsafe QA directory cleanup.");
    if (existsSync(qaRoot)) rmSync(qaRoot, { recursive: true, force: true, maxRetries: 4 });
  }
}
process.on("SIGINT", async () => {
  await cleanup();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await cleanup();
  process.exit(0);
});
async function request(path, method = "GET", body, cookie, headers = {}) {
  const response = await fetch(`${origin}${path}`, {
    method,
    headers: {
      Origin: origin,
      ...(cookie ? { Cookie: cookie } : {}),
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data, status: response.status };
}
async function expectStatus(path, method, body, cookie, status, headers) {
  const result = await request(path, method, body, cookie, headers);
  assert.equal(result.status, status, `${method} ${path}: ${JSON.stringify(result.data)}`);
  return result.data;
}
async function check(name, run) {
  await run();
  passed++;
  console.log(`PASS ${name}`);
}
const base = "/api/dashboard/leads/v1";
const endpoint = (kind, mine = false) => `${base}?kind=${kind}&mine=${mine}`;
const itemEndpoint = (id, mine = false, kind = "customers") => `${base}/${id}?kind=${kind}&mine=${mine}`;

// Exercise the exact browser workbook parser with real XLSX bytes, without
// relying on the browser extension's optional local-file-upload permission.
function excelParser() {
  const ts = require("typescript");
  const filename = path.resolve("src/app/dashboard/leads/_components/excel.ts");
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  loaded._compile(compiled, filename);
  return loaded.exports;
}

(async () => {
  await mongo.connect();
  const { hashPassword } = await import("better-auth/crypto");
  const hashedPassword = await hashPassword(password);
  const now = new Date();
  const ts = require("typescript");
  const defaultsModule = { exports: {} };
  new Function(
    "module",
    "exports",
    ts.transpileModule(readFileSync("src/lib/defaults/import-data.ts", "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
  )(defaultsModule, defaultsModule.exports);
  const seededSidebars = [];
  for (const [position, group] of defaultsModule.exports.sidebarDefaults.entries()) {
    const parentId = `qa-sidebar-${seededSidebars.length}`;
    seededSidebars.push({ id: parentId, name: group.name, url: group.url, icon: group.icon, parentId: null, position });
    for (const [childPosition, child] of (group.children ?? []).entries())
      seededSidebars.push({ ...child, id: `qa-sidebar-${seededSidebars.length}`, parentId, position: childPosition });
  }
  await db.collection("sidebar").insertMany(seededSidebars);
  for (const [key, role] of [
    ["admin", "Admin"],
    ["developer", "Developer"],
    ["councilor-a", "Councilor"],
    ["councilor-b", "Councilor"],
    ["user", "user"],
  ]) {
    const email = `qa-${key}@example.test`,
      id = `qa-${key}`,
      roleId = `qa-role-${role}`;
    const userObjectId = new ObjectId();
    await db.collection("role").updateOne(
      { id: roleId },
      {
        $set: {
          id: roleId,
          name: role,
          permissions: Object.fromEntries(
            seededSidebars.map((item) => [item.id, { read: true, create: true, update: true, delete: true }]),
          ),
        },
      },
      { upsert: true },
    );
    await db
      .collection("user")
      .insertOne({ _id: userObjectId, name: `QA ${key}`, email, emailVerified: true, createdAt: now, updatedAt: now });
    await db.collection("account").insertOne({
      id: randomUUID(),
      userId: userObjectId,
      accountId: userObjectId.toHexString(),
      providerId: "credential",
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });
    await db
      .collection("access")
      .insertOne({ id, email, roleId, roleName: role, blocked: false, createdAt: now, updatedAt: now });
  }
  // Keep Next's lock, generated types, cache, and config writes outside the
  // user's running app. Only this disposable copy uses the synthetic database.
  mkdirSync(qaRoot);
  cpSync("src", path.join(qaRoot, "src"), { recursive: true });
  const qaHealthDirectory = path.join(qaRoot, "src/app/api/qa-isolation-check");
  mkdirSync(qaHealthDirectory, { recursive: true });
  writeFileSync(
    path.join(qaHealthDirectory, "route.ts"),
    `export function GET() { return Response.json({qa: "${qaName}"}); }`,
  );
  for (const file of ["package.json", "tsconfig.json", "next.config.ts", "postcss.config.mjs"]) {
    if (existsSync(file)) cpSync(file, path.join(qaRoot, file));
  }
  symlinkSync(path.resolve("node_modules"), path.join(qaRoot, "node_modules"), "junction");
  if (existsSync("public")) symlinkSync(path.resolve("public"), path.join(qaRoot, "public"), "junction");
  server = spawn(
    process.execPath,
    [path.resolve("node_modules/next/dist/bin/next"), "dev", "--webpack", "--hostname", "127.0.0.1", "--port", "3001"],
    {
      cwd: qaRoot,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        MONGODB_URI: qaUri,
        BETTER_AUTH_URL: origin,
        BETTER_AUTH_TRUSTED_ORIGINS: origin,
        BETTER_AUTH_SECRET: randomUUID() + randomUUID(),
        AuthorizationEnable: authorizationDisabled ? "false" : "true",
        REDIS_HOST: "",
        REDIS_USERNAME: "",
        REDIS_PASSWORD: "",
        GOOGLE_CLIENT_ID: "",
        GOOGLE_CLIENT_SECRET: "",
        GMAIL_USER: "",
        GMAIL_APP_PASSWORD: "",
      },
    },
  );
  let startupOutput = "";
  server.stdout.on("data", (chunk) => {
    startupOutput += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    startupOutput += chunk.toString();
  });
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error(`QA server exited: ${startupOutput.slice(-1200)}`);
    try {
      const health = await fetch(`${origin}/api/qa-isolation-check`);
      if (health.ok && (await health.json()).qa === qaName) break;
    } catch {}
    if (attempt === 119) throw new Error("QA server startup timed out.");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  async function login(key) {
    const result = await request("/api/auth/v1/sign-in/email", "POST", { email: `qa-${key}@example.test`, password });
    assert.equal(result.status, 200, JSON.stringify(result.data));
    return result.response.headers
      .getSetCookie()
      .map((value) => value.split(";")[0])
      .join("; ");
  }
  const [admin, councilorA, councilorB, user] = await Promise.all([
    login("admin"),
    login("councilor-a"),
    login("councilor-b"),
    login("user"),
  ]);
  const developer = await login("developer");
  await check("sidebar metadata, assigned role, and Developer Leads permissions", async () => {
    const navigation = await expectStatus("/api/dashboard/sidebars/v1", "GET", undefined, developer, 200);
    assert.equal(navigation.roleName, "Developer");
    assert.equal(navigation.access.bypassed, authorizationDisabled);
    assert.ok(navigation.items.some((item) => item.url === "/dashboard/leads/customers"));
    await expectStatus(endpoint("customers"), "GET", undefined, developer, 200);
    const roleData = await expectStatus("/api/dashboard/roles/v1", "GET", undefined, admin, 200);
    const councilorRole = roleData.roles.find((role) => role.name === "Councilor");
    for (const url of [
      "/dashboard/admin/access",
      "/dashboard/admin/role",
      "/dashboard/leads/funnels",
      "/dashboard/leads/councilors",
    ]) {
      const sidebar = seededSidebars.find((item) => item.url === url);
      assert.equal(councilorRole.permissions[sidebar.id].create, false);
      assert.equal(councilorRole.permissions[sidebar.id].update, false);
      assert.equal(councilorRole.permissions[sidebar.id].delete, false);
    }
  });
  await check("media management follows bypass or Developer grants while preserving upload ownership", async () => {
    const media = (
      await expectStatus(
        "/api/dashboard/media/v1",
        "POST",
        {
          name: "QA video",
          url: "https://youtu.be/dQw4w9WgXcQ",
          uploadPlane: "Youtube",
          type: "video",
        },
        admin,
        201,
      )
    ).item;
    const listed = await expectStatus("/api/dashboard/media/v1", "GET", undefined, developer, 200);
    assert.ok(listed.items.some((item) => item.id === media.id));
    await expectStatus(`/api/dashboard/media/v1/${media.id}`, "PATCH", { name: "QA renamed" }, developer, 200);
    await expectStatus(
      `/api/dashboard/media/v1/${media.id}`,
      "PATCH",
      { name: "Councilor rename" },
      councilorA,
      authorizationDisabled ? 200 : 403,
    );
    await expectStatus(
      "/api/dashboard/media/v1",
      "POST",
      {
        name: "Unowned upload",
        url: "https://utfs.io/f/synthetic",
        uploadPlane: "Uploadthings",
        type: "picture",
        fileKey: "synthetic",
      },
      developer,
      403,
    );
    await expectStatus(`/api/dashboard/media/v1/${media.id}`, "DELETE", undefined, developer, 200);
  });
  await check("assigned-role deletion, own bulk access deletion, and import inventory", async () => {
    await expectStatus("/api/dashboard/roles/v1/qa-role-Admin", "DELETE", undefined, admin, 409);
    await expectStatus("/api/dashboard/access/v1/bulk", "DELETE", { ids: ["qa-admin"] }, admin, 400);
    const inventory = await expectStatus("/api/tools/import-data/v1", "GET", undefined, admin, 200);
    assert.equal(inventory.sidebarUrls.length, seededSidebars.length);
    const sync = await expectStatus(
      "/api/tools/import-data/v1",
      "POST",
      { sidebarUrls: seededSidebars.map((item) => item.url), pagePaths: [] },
      admin,
      200,
    );
    assert.equal(sync.inserted, 0);
    assert.deepEqual(
      (await db.collection("sidebar").find({}).toArray()).map((item) => item.id).sort(),
      seededSidebars.map((item) => item.id).sort(),
    );
  });
  await check("missing assignments can be reviewed and explicitly repaired", async () => {
    await db.collection("access").updateOne({ id: "qa-user" }, { $set: { roleId: "missing-role" } });
    const review = await expectStatus("/api/dashboard/access/v1?missingRole=true", "GET", undefined, admin, 200);
    assert.equal(review.missingRoleCount, 1);
    assert.equal(review.items[0].roleMissing, true);
    assert.equal(review.items[0].suggestedRoleName, "user");
    await expectStatus(
      "/api/dashboard/access/v1/qa-user",
      "PATCH",
      { roleId: "qa-role-user", blocked: false },
      admin,
      200,
    );
    assert.equal(
      (await expectStatus("/api/dashboard/access/v1?missingRole=true", "GET", undefined, admin, 200)).missingRoleCount,
      0,
    );
  });
  await check("catalog handler extraction preserves CRUD, references, validation, and authorization", async () => {
    for (const resource of ["categories", "products", "coupons"]) {
      await expectStatus(`/api/dashboard/${resource}/v1`, "GET", undefined, undefined, 401);
      await expectStatus(`/api/dashboard/${resource}/v1`, "POST", {}, user, authorizationDisabled ? 400 : 403);
    }
    const categoryInput = { name: "QA category", slug: "qa-category", description: "", status: "active" };
    const category = (await expectStatus("/api/dashboard/categories/v1", "POST", categoryInput, developer, 201)).item;
    await expectStatus(
      `/api/dashboard/categories/v1/${category.id}`,
      "PATCH",
      { ...categoryInput, name: "Renamed category" },
      developer,
      200,
    );
    const catalogModule = { exports: {} };
    new Function(
      "module",
      "exports",
      ts.transpileModule(readFileSync("src/lib/dashboard/catalog.ts", "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS },
      }).outputText,
    )(catalogModule, catalogModule.exports);
    const productInput = catalogModule.exports.createProductDefaults({
      categoryId: category.id,
      imageUrl: "https://placehold.co/200.png",
      now: 1,
    });
    const product = (await expectStatus("/api/dashboard/products/v1", "POST", productInput, developer, 201)).item;
    assert.equal(typeof product.createdAt, "string");
    await expectStatus("/api/dashboard/products/v1", "POST", productInput, developer, 409);
    await expectStatus(`/api/dashboard/categories/v1/${category.id}`, "DELETE", undefined, developer, 409);
    await expectStatus(
      `/api/dashboard/products/v1/${product.id}`,
      "PATCH",
      { stock: 3, status: "active" },
      developer,
      200,
    );
    await expectStatus(
      "/api/dashboard/products/v1/bulk",
      "PATCH",
      { ids: [product.id], status: "draft" },
      developer,
      200,
    );
    assert.equal((await expectStatus("/api/dashboard/products/v1", "GET", undefined, developer, 200)).total, 1);
    await expectStatus("/api/dashboard/products/v1/bulk", "DELETE", { ids: [product.id] }, developer, 200);
    await expectStatus(
      "/api/dashboard/categories/v1/bulk",
      "PATCH",
      { ids: [category.id], status: "inactive" },
      developer,
      200,
    );
    await expectStatus("/api/dashboard/categories/v1/bulk", "DELETE", { ids: [category.id] }, developer, 200);
    const couponInput = { code: "QA10", discountType: "flat", discountValue: 10, maximumDiscount: null, active: true };
    const coupon = (await expectStatus("/api/dashboard/coupons/v1", "POST", couponInput, developer, 201)).item;
    await expectStatus(
      `/api/dashboard/coupons/v1/${coupon.id}`,
      "PATCH",
      { ...couponInput, discountValue: 20 },
      developer,
      200,
    );
    await expectStatus(`/api/dashboard/coupons/v1/${coupon.id}`, "DELETE", undefined, developer, 200);
    await expectStatus("/api/dashboard/navigation/v1?dashboard=true", "GET", undefined, developer, 200);
    await expectStatus("/api/dashboard/tracking/v1", "GET", undefined, developer, 200);
  });
  if (authorizationDisabled) {
    await check("disabled authorization permits role-free CRUD and imports", async () => {
      await db.collection("access").deleteOne({ id: "qa-user" });
      const funnel = (
        await expectStatus(
          endpoint("funnels"),
          "POST",
          { name: "Role-free funnel", position: 1, description: "", status: "active" },
          user,
          201,
        )
      ).item;
      const customer = (
        await expectStatus(
          endpoint("customers"),
          "POST",
          { name: "Role-free customer", mobile: "01780000001", funnelId: funnel.id, status: "active", blocked: false },
          user,
          201,
        )
      ).item;
      await expectStatus(
        itemEndpoint(customer.id),
        "PATCH",
        { name: "Updated customer", mobile: "01780000001", funnelId: funnel.id, status: "active", blocked: false },
        councilorA,
        200,
      );
      await expectStatus(
        `${base}/import`,
        "POST",
        {
          kind: "customers",
          rows: [{ name: "Imported", mobile: "01780000002", funnelId: funnel.id, status: "active", blocked: false }],
        },
        user,
        200,
      );
      await expectStatus(itemEndpoint(customer.id), "DELETE", undefined, user, 200);
      await expectStatus(
        endpoint("councilors"),
        "POST",
        { name: "Role-free councilor", mobile: "01780000003", email: "free@example.test", status: "active" },
        councilorA,
        201,
      );
      await expectStatus("/api/tools/import-data/v1", "POST", { sidebarUrls: [], pagePaths: ["/about-us"] }, user, 200);
      await expectStatus(endpoint("customers"), "GET", undefined, undefined, 401);
    });
    await check("disabled mode still scopes My Leads and rejects blocked accounts", async () => {
      const funnel = await db.collection("leads-funnels").findOne({});
      const mine = (
        await expectStatus(
          endpoint("customers", true),
          "POST",
          { name: "Mine", mobile: "01780000004", funnelId: funnel.id, status: "active", blocked: false },
          user,
          201,
        )
      ).item;
      await expectStatus(
        itemEndpoint(mine.id, true),
        "PATCH",
        { name: "Not mine", mobile: mine.mobile, funnelId: funnel.id, status: "active", blocked: false },
        councilorA,
        404,
      );
      assert.equal((await expectStatus(endpoint("customers", true), "GET", undefined, councilorA, 200)).total, 0);
      await db.collection("access").updateOne({ id: "qa-councilor-a" }, { $set: { blocked: true } });
      await expectStatus(endpoint("customers"), "GET", undefined, councilorA, 403);
      await expectStatus("/api/dashboard/sidebars/v1", "GET", undefined, councilorA, 403);
    });
    console.log(`Leads disabled authorization integration: ${passed} scenarios passed using an isolated database.`);
    await cleanup();
    return;
  }
  await check("all Leads handlers reject anonymous and unrelated roles", async () => {
    const calls = [
      [endpoint("customers"), "GET"],
      [endpoint("customers"), "POST", {}],
      [itemEndpoint("none"), "PATCH", {}],
      [itemEndpoint("none"), "DELETE"],
      [`${base}/bulk`, "PATCH", {}],
      [`${base}/bulk`, "DELETE", {}],
      [`${base}/import`, "POST", {}],
    ];
    for (const [path, method, body] of calls) {
      await expectStatus(path, method, body, undefined, 401);
      await expectStatus(path, method, body, user, 403);
    }
  });
  await check("empty Leads workspaces can receive the exact guarded demo dataset", async () => {
    await expectStatus(`${base}/demo`, "GET", undefined, undefined, 401);
    await expectStatus(`${base}/demo`, "POST", undefined, admin, 415);
    await expectStatus(`${base}/demo`, "POST", {}, councilorA, 403);
    assert.equal((await expectStatus(`${base}/demo`, "GET", undefined, admin, 200)).available, true);
    const seeded = await expectStatus(`${base}/demo`, "POST", {}, admin, 200);
    assert.deepEqual(seeded, {
      funnels: 5,
      customers: 200,
      councilors: 5,
      assignments: 189,
      notes: 200,
      unassigned: 11,
    });
    assert.deepEqual(
      await Promise.all(
        ["leads-funnels", "leads-customers", "leads-councilors", "leads-activities"].map((collection) =>
          db.collection(collection).countDocuments(),
        ),
      ),
      [5, 200, 5, 389],
    );
    assert.equal(await db.collection("leads-activities").countDocuments({ type: "note" }), 200);
    assert.equal((await db.collection("leads-activities").distinct("customerId", { type: "note" })).length, 200);
    assert.equal(
      await db.collection("leads-activities").countDocuments({
        type: "note",
        note: { $type: "string" },
        authorName: { $type: "string" },
      }),
      200,
    );
    assert.deepEqual(
      await db
        .collection("leads-customers")
        .aggregate([
          { $match: { assignedTo: { $ne: null } } },
          { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
      [
        { _id: "councilor1@gmail.com", count: 15 },
        { _id: "councilor2@gmail.com", count: 25 },
        { _id: "councilor3@gmail.com", count: 35 },
        { _id: "councilor4@gmail.com", count: 55 },
        { _id: "councilor5@gmail.com", count: 59 },
      ],
    );
    await expectStatus(`${base}/demo`, "POST", {}, admin, 409);
    await Promise.all(
      ["leads-funnels", "leads-customers", "leads-councilors", "leads-activities"].map((collection) =>
        db.collection(collection).deleteMany({}),
      ),
    );
  });
  const funnelInput = {
    name: "QA New enquiries",
    position: 1,
    description: "New customer enquiries",
    status: "active",
  };
  const funnel = (await expectStatus(endpoint("funnels"), "POST", funnelInput, admin, 201)).item;
  const secondFunnel = (
    await expectStatus(endpoint("funnels"), "POST", { ...funnelInput, name: "QA Follow-up", position: 2 }, admin, 201)
  ).item;
  await check("funnel position uniqueness, editing, and role restrictions", async () => {
    await expectStatus(endpoint("funnels"), "POST", funnelInput, admin, 409);
    await expectStatus(itemEndpoint(funnel.id, false, "funnels"), "PATCH", { ...funnelInput, position: 3 }, admin, 200);
    await expectStatus(endpoint("funnels"), "POST", { ...funnelInput, position: 4 }, councilorA, 403);
    const list = await expectStatus(endpoint("funnels"), "GET", undefined, admin, 200);
    assert.deepEqual(
      list.items.map((item) => item.position),
      [2, 3],
    );
  });
  const counselorInput = {
    name: "QA Councilor A",
    mobile: "01700000001",
    email: "qa-councilor-a@example.test",
    status: "active",
  };
  const profileA = (await expectStatus(endpoint("councilors"), "POST", counselorInput, admin, 201)).item;
  await expectStatus(
    endpoint("councilors"),
    "POST",
    { ...counselorInput, name: "QA Councilor B", mobile: "01700000002", email: "qa-councilor-b@example.test" },
    admin,
    201,
  );
  const customerInput = {
    name: "QA Unassigned",
    mobile: "01710000000",
    email: "",
    funnelId: funnel.id,
    status: "active",
    blocked: false,
  };
  const customer = (await expectStatus(endpoint("customers"), "POST", customerInput, admin, 201)).item;
  await check("canonical mobile uniqueness and untrusted assignment rejection", async () => {
    await expectStatus(endpoint("customers"), "POST", { ...customerInput, mobile: "+8801710000000" }, admin, 409);
    await expectStatus(
      endpoint("customers", true),
      "POST",
      { ...customerInput, mobile: "01710000001", assignedTo: "victim@example.test" },
      councilorA,
      400,
    );
  });
  let winner;
  await check("concurrent councilor claims have exactly one winner", async () => {
    const claims = await Promise.all([
      request(itemEndpoint(customer.id), "PATCH", { action: "claim" }, councilorA),
      request(itemEndpoint(customer.id), "PATCH", { action: "claim" }, councilorB),
    ]);
    assert.deepEqual(claims.map((claim) => claim.status).sort(), [200, 409]);
    winner = (await db.collection("leads-customers").findOne({ id: customer.id })).assignedTo;
    assert.ok(["qa-councilor-a@example.test", "qa-councilor-b@example.test"].includes(winner));
  });
  const own = (
    await expectStatus(
      endpoint("customers", true),
      "POST",
      { ...customerInput, name: "QA My Lead", mobile: "01710000001" },
      councilorA,
      201,
    )
  ).item;
  const other = (
    await expectStatus(
      endpoint("customers", true),
      "POST",
      { ...customerInput, name: "QA Other Lead", mobile: "01710000002" },
      councilorB,
      201,
    )
  ).item;
  const adminOwn = (
    await expectStatus(
      endpoint("customers", true),
      "POST",
      { ...customerInput, name: "QA Admin Lead", mobile: "01710000003" },
      admin,
      201,
    )
  ).item;
  await check("My Leads uses session identity for every role and filter", async () => {
    const mine = await expectStatus(endpoint("customers", true), "GET", undefined, councilorA, 200);
    assert.ok(mine.items.every((item) => item.assignedTo === "qa-councilor-a@example.test"));
    const narrowed = await expectStatus(
      `${endpoint("customers", true)}&councilor=qa-councilor-b%40example.test`,
      "GET",
      undefined,
      councilorA,
      200,
    );
    assert.equal(narrowed.total, 0);
    const unassigned = await expectStatus(
      `${endpoint("customers", true)}&assignment=unassigned`,
      "GET",
      undefined,
      councilorA,
      200,
    );
    assert.equal(unassigned.total, 0);
    const adminMine = await expectStatus(endpoint("customers", true), "GET", undefined, admin, 200);
    assert.deepEqual(
      adminMine.items.map((item) => item.id),
      [adminOwn.id],
    );
  });
  await check("My Leads notes save the assigned councilor author and timestamp", async () => {
    await expectStatus(
      itemEndpoint(other.id, true),
      "PATCH",
      { action: "note", note: "Not my customer" },
      councilorA,
      403,
    );
    await expectStatus(itemEndpoint(own.id, true), "PATCH", { action: "note", note: "" }, councilorA, 400);
    const saved = await expectStatus(
      itemEndpoint(own.id, true),
      "PATCH",
      { action: "note", note: "Customer requested a follow-up call." },
      councilorA,
      200,
    );
    assert.equal(saved.note.note, "Customer requested a follow-up call.");
    assert.equal(saved.note.authorEmail, "qa-councilor-a@example.test");
    assert.equal(saved.note.authorName, "QA Councilor A");
    assert.ok(!Number.isNaN(Date.parse(saved.note.createdAt)));
    const mine = await expectStatus(endpoint("customers", true), "GET", undefined, councilorA, 200);
    const notedCustomer = mine.items.find((item) => item.id === own.id);
    assert.deepEqual(notedCustomer.notes, [saved.note]);
  });
  await check("Councilor list, search, exports, and overview exclude other assignments", async () => {
    const list = await expectStatus(endpoint("customers"), "GET", undefined, councilorA, 200);
    assert.ok(
      list.items.every((item) => item.assignedTo === null || item.assignedTo === "qa-councilor-a@example.test"),
    );
    assert.ok(!list.items.some((item) => item.id === other.id || item.id === adminOwn.id));
    assert.equal(
      (await expectStatus(`${endpoint("customers")}&search=QA%20Other`, "GET", undefined, councilorA, 200)).total,
      0,
    );
    const overview = await expectStatus(`${base}?overview=true`, "GET", undefined, councilorA, 200);
    assert.equal(
      overview.summary.all,
      await db
        .collection("leads-customers")
        .countDocuments({ assignedTo: { $in: [null, "qa-councilor-a@example.test"] } }),
    );
    assert.ok(overview.progress.every((row) => row.email === "qa-councilor-a@example.test"));
    await expectStatus("/api/dashboard/access/v1", "GET", undefined, councilorA, 403);
    await expectStatus("/api/dashboard/roles/v1", "POST", { name: "Escalation" }, councilorA, 403);
  });
  await check("path CRUD grants enforce every Leads method independently", async () => {
    const row = seededSidebars.find((item) => item.url === "/dashboard/leads/customers");
    for (const [operation, path, method, body] of [
      ["create", endpoint("customers"), "POST", {}],
      ["update", itemEndpoint(own.id), "PATCH", {}],
      ["delete", itemEndpoint(own.id), "DELETE"],
      ["read", endpoint("customers"), "GET"],
    ]) {
      await db
        .collection("role")
        .updateOne({ id: "qa-role-Admin" }, { $set: { [`permissions.${row.id}.${operation}`]: false } });
      await expectStatus(path, method, body, admin, 403);
      await db
        .collection("role")
        .updateOne({ id: "qa-role-Admin" }, { $set: { [`permissions.${row.id}.${operation}`]: true } });
    }
  });
  await check("create-only Leads pages use minimal reference options without reading records", async () => {
    const customers = seededSidebars.find((item) => item.url === "/dashboard/leads/customers");
    const funnels = seededSidebars.find((item) => item.url === "/dashboard/leads/funnels");
    await db
      .collection("role")
      .updateOne(
        { id: "qa-role-Admin" },
        { $set: { [`permissions.${customers.id}.read`]: false, [`permissions.${funnels.id}.read`]: false } },
      );
    await expectStatus(endpoint("customers"), "GET", undefined, admin, 403);
    await expectStatus(endpoint("funnels"), "GET", undefined, admin, 403);
    const options = await expectStatus(`${base}?lookup=funnels&area=customers`, "GET", undefined, admin, 200);
    assert.ok(options.items.every((item) => Object.keys(item).sort().join() === "name,value"));
    assert.ok(options.items.some((item) => item.value === funnel.id));
    await expectStatus("/dashboard/leads/customers", "GET", undefined, admin, 200);
    await db
      .collection("role")
      .updateOne(
        { id: "qa-role-Admin" },
        { $set: { [`permissions.${customers.id}.read`]: true, [`permissions.${funnels.id}.read`]: true } },
      );
  });
  await check(
    "role rename synchronizes assignment labels and parent containers accept permitted children",
    async () => {
      const saved = await db.collection("role").findOne({ id: "qa-role-Admin" });
      const body = { ...saved, name: "Administrator", responsible: "", icon: "ShieldCheck" };
      await expectStatus("/api/dashboard/roles/v1/qa-role-Admin", "PATCH", body, admin, 200);
      assert.equal((await db.collection("access").findOne({ id: "qa-admin" })).roleName, "Administrator");
      await expectStatus("/api/dashboard/roles/v1/qa-role-Admin", "PATCH", { ...body, name: "Admin" }, admin, 200);
      const parent = seededSidebars.find((item) => item.url === "/dashboard/admin");
      await db
        .collection("role")
        .updateOne(
          { id: "qa-role-Admin" },
          { $set: { [`permissions.${parent.id}`]: { read: false, create: false, update: false, delete: false } } },
        );
      await expectStatus("/dashboard/admin", "GET", undefined, admin, 200);
      await db
        .collection("role")
        .updateOne({ id: "qa-role-Admin" }, { $set: { [`permissions.${parent.id}`]: saved.permissions[parent.id] } });
    },
  );
  await check("item and mixed bulk writes cannot mutate another councilor's customers", async () => {
    await expectStatus(itemEndpoint(other.id), "PATCH", { ...customerInput, mobile: other.mobile }, councilorA, 404);
    await expectStatus(itemEndpoint(other.id, true), "DELETE", undefined, councilorA, 409);
    await expectStatus(
      `${base}/bulk`,
      "PATCH",
      { kind: "customers", ids: [own.id, other.id], status: "inactive" },
      councilorA,
      409,
    );
    assert.equal((await db.collection("leads-customers").findOne({ id: own.id })).status, "active");
    await expectStatus(
      itemEndpoint(own.id),
      "PATCH",
      { action: "assign", assignedTo: "qa-councilor-b@example.test" },
      councilorA,
      403,
    );
    await expectStatus(
      itemEndpoint(adminOwn.id, true),
      "PATCH",
      { action: "assign", assignedTo: "qa-councilor-a@example.test" },
      admin,
      403,
    );
  });
  await check("Admin reassignment and counselling activity persist", async () => {
    await expectStatus(
      itemEndpoint(customer.id),
      "PATCH",
      { action: "assign", assignedTo: "qa-councilor-a@example.test" },
      admin,
      200,
    );
    await expectStatus(itemEndpoint(own.id, true), "PATCH", { action: "counsel" }, councilorA, 200);
    assert.equal(await db.collection("leads-activities").countDocuments({ customerId: own.id, type: "counselled" }), 1);
    await expectStatus(itemEndpoint(other.id), "PATCH", { action: "counsel" }, councilorA, 403);
  });
  await check("imports report row errors and auto-assign only successful own rows", async () => {
    const XLSX = require("xlsx");
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet([
        {
          Name: "QA Imported Lead",
          Mobile: "01710000004",
          Email: "",
          "Funnel ID": funnel.id,
          Status: "active",
          Blocked: "false",
          "Assigned councilor": "forged@example.test",
        },
        {
          Name: "QA Duplicate",
          Mobile: own.mobile,
          Email: "",
          "Funnel ID": funnel.id,
          Status: "active",
          Blocked: "false",
        },
      ]),
      "Leads",
    );
    const bytes = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const rows = await excelParser().readLeadExcel(new File([bytes], "leads.xlsx"), "customers");
    const result = await expectStatus(
      `${base}/import`,
      "POST",
      {
        kind: "customers",
        mine: true,
        rows,
      },
      councilorA,
      200,
    );
    assert.equal(result.imported, 1);
    assert.equal(result.errors[0].row, 3);
    const imported = await db.collection("leads-customers").findOne({ name: "QA Imported Lead" });
    assert.equal(imported.assignedTo, "qa-councilor-a@example.test");
    await expectStatus(`${base}/import`, "POST", { kind: "councilors", rows: [counselorInput] }, councilorA, 403);
  });
  await check("referenced deletes, bad status, inactive profiles, and blocked access fail safely", async () => {
    await expectStatus(itemEndpoint(funnel.id, false, "funnels"), "DELETE", undefined, admin, 409);
    await expectStatus(itemEndpoint(profileA.id, false, "councilors"), "DELETE", undefined, admin, 409);
    await expectStatus(`${base}/bulk`, "PATCH", { kind: "customers", ids: [own.id], status: "invalid" }, admin, 400);
    await db.collection("leads-councilors").updateOne({ id: profileA.id }, { $set: { status: "inactive" } });
    await expectStatus(endpoint("customers"), "GET", undefined, councilorA, 403);
    await db.collection("leads-councilors").updateOne({ id: profileA.id }, { $set: { status: "active" } });
    await db.collection("access").updateOne({ id: "qa-councilor-a" }, { $set: { blocked: true } });
    await expectStatus(endpoint("customers"), "GET", undefined, councilorA, 403);
    await db.collection("access").updateOne({ id: "qa-councilor-a" }, { $set: { blocked: false } });
  });
  await check("CSRF and JSON guards apply to Leads mutations", async () => {
    await expectStatus(endpoint("customers"), "POST", customerInput, admin, 403, {
      Origin: "https://other.example.test",
    });
    await expectStatus(`${base}/bulk`, "DELETE", { kind: "customers", ids: [own.id] }, admin, 415, {
      "Content-Type": "text/plain",
    });
    await expectStatus(`${base}/bulk`, "PATCH", { kind: ["customers"], ids: [own.id], status: "inactive" }, admin, 400);
  });
  await check("successful CRUD and bulk operations persist without changing assignment", async () => {
    const disposable = (
      await expectStatus(
        endpoint("customers", true),
        "POST",
        { ...customerInput, mobile: "01710000008", name: "QA Disposable" },
        councilorA,
        201,
      )
    ).item;
    const edited = await expectStatus(
      itemEndpoint(disposable.id, true),
      "PATCH",
      { ...customerInput, name: "QA Edited", mobile: disposable.mobile, blocked: true },
      councilorA,
      200,
    );
    assert.equal(edited.item.assignedTo, "qa-councilor-a@example.test");
    assert.equal(edited.item.blocked, true);
    await expectStatus(itemEndpoint(disposable.id), "PATCH", { action: "counsel" }, councilorA, 403);
    await expectStatus(
      `${base}/bulk`,
      "PATCH",
      { kind: "customers", mine: true, ids: [disposable.id], status: "inactive" },
      councilorA,
      200,
    );
    const removed = await expectStatus(
      `${base}/bulk`,
      "DELETE",
      { kind: "customers", mine: true, ids: [disposable.id] },
      councilorA,
      200,
    );
    assert.equal(removed.deletedCount, 1);
    const extraFunnel = (await expectStatus(endpoint("funnels"), "POST", { ...funnelInput, position: 9 }, admin, 201))
      .item;
    await expectStatus(
      `${base}/bulk`,
      "PATCH",
      { kind: "funnels", ids: [extraFunnel.id], status: "inactive" },
      admin,
      200,
    );
    await expectStatus(itemEndpoint(extraFunnel.id, false, "funnels"), "DELETE", undefined, admin, 200);
    const extraCouncilor = (
      await expectStatus(
        endpoint("councilors"),
        "POST",
        { ...counselorInput, email: "qa-disposable@example.test" },
        admin,
        201,
      )
    ).item;
    await expectStatus(
      itemEndpoint(extraCouncilor.id, false, "councilors"),
      "PATCH",
      { ...counselorInput, email: "qa-disposable@example.test", name: "QA Renamed" },
      admin,
      200,
    );
    await expectStatus(
      `${base}/bulk`,
      "PATCH",
      { kind: "councilors", ids: [extraCouncilor.id], status: "inactive" },
      admin,
      200,
    );
    await expectStatus(itemEndpoint(extraCouncilor.id, false, "councilors"), "DELETE", undefined, admin, 200);
  });
  await check("oversized workbooks and request bodies fail without silent truncation", async () => {
    const XLSX = require("xlsx");
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(
        Array.from({ length: 101 }, () => ({ Name: "QA Too many", Mobile: "01710000009", "Funnel ID": funnel.id })),
      ),
      "Leads",
    );
    const bytes = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    await assert.rejects(() => excelParser().readLeadExcel(new File([bytes], "too-many.xlsx"), "customers"), /100/);
    await expectStatus(endpoint("customers"), "POST", { oversized: "x".repeat(513000) }, admin, 413);
  });
  // Seed enough records for pagination/search and dated records for real analytics.
  await db.collection("leads-customers").insertMany(
    Array.from({ length: 17 }, (_, index) => ({
      kind: "customers",
      id: randomUUID(),
      name: `QA Pagination ${String(index).padStart(2, "0")}`,
      mobile: `+88018000000${String(index).padStart(2, "0")}`,
      email: `page-${index}@example.test`,
      status: index % 3 ? "active" : "inactive",
      blocked: false,
      funnelId: secondFunnel.id,
      assignedTo: index % 2 ? "qa-councilor-a@example.test" : null,
      assignedAt: null,
      lastCounselledAt: null,
      createdAt: new Date(now.getTime() - (index + 1) * 60000),
      updatedAt: now,
    })),
  );
  await db
    .collection("leads-customers")
    .updateOne({ name: "QA Pagination 16" }, { $set: { createdAt: new Date(now.getTime() - 31 * 86400000) } });
  await db.collection("leads-activities").insertOne({
    id: randomUUID(),
    customerId: own.id,
    councilor: "qa-councilor-a@example.test",
    type: "counselled",
    createdAt: new Date(now.getTime() - 25 * 3600000),
  });
  await check("pagination, database search, filters, and monthly overview use stored data", async () => {
    const page = await expectStatus(`${endpoint("customers")}&page=2&pageSize=10`, "GET", undefined, admin, 200);
    assert.equal(page.items.length, 10);
    assert.equal(page.page, 2);
    const searched = await expectStatus(
      `${endpoint("customers")}&search=QA%20Pagination%2016`,
      "GET",
      undefined,
      admin,
      200,
    );
    assert.equal(searched.total, 1);
    const overview = await expectStatus(`${base}?overview=true`, "GET", undefined, admin, 200);
    assert.equal(overview.summary.all, await db.collection("leads-customers").countDocuments({}));
    assert.equal(overview.months.length, 12);
    assert.equal(overview.summary.new30Days, overview.summary.all - 1);
    assert.equal(overview.months.at(-1).customers, overview.summary.all - 1);
    assert.equal(overview.progress.find((row) => row.email === "qa-councilor-a@example.test").counselling24Hours, 1);
  });
  console.log(`Leads integration: ${passed} scenarios passed using an isolated database.`);
  if (process.argv.includes("--keep-open")) {
    console.log(
      `Browser QA ready: ${origin}/login (synthetic qa-admin@example.test account). Ctrl+C removes the test server and database.`,
    );
    await once(server, "exit");
  }
  await cleanup();
})().catch(async (error) => {
  console.error(error.message);
  await cleanup().catch(() => {});
  process.exitCode = 1;
});
