/*
|-----------------------------------------
| setting up route.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { randomUUID } from "crypto";

import { ObjectId, type Document } from "mongodb";

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth, client } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";

type Submission = {
  _id?: ObjectId;
  id: string;
  pageId: string;
  blockId: string;
  values: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
};
type SubmissionList = { items: Submission[]; total: { count: number }[] };

const collection = () => client.db().collection<Submission>("page-submissions");
const requireDashboardPermission = async (request: Request, method: "GET" | "PUT" | "DELETE") => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  const authorization = await authorizeDashboardRequest(session, "/api/dashboard/pages/v1", method);
  return authorization.allowed
    ? { error: null }
    : { error: Response.json({ error: authorization.state.message ?? "Unauthorized." }, { status: 403 }) };
};

function validValues(values: unknown): values is Record<string, string> {
  if (!values || typeof values !== "object" || Array.isArray(values)) return false;
  const entries = Object.entries(values);
  return (
    entries.length > 0 &&
    entries.length <= 50 &&
    entries.every(([key, value]) => key.length <= 120 && typeof value === "string" && value.length <= 10_000)
  );
}

export async function GET(request: Request) {
  const limited = await rateLimitDistributed(request, "page-submissions-admin", 60, 60_000);
  if (limited) return limited;
  const access = await requireDashboardPermission(request, "GET");
  if (access.error) return access.error;

  const params = new URL(request.url).searchParams;
  const pageId = params.get("pageId") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 10));
  const q = params.get("q")?.trim() ?? "";
  const match: Document = pageId ? { pageId } : {};
  const stages: Document[] = [{ $match: match }];

  if (q) {
    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    stages.push({
      $match: {
        $expr: {
          $regexMatch: {
            input: {
              $concat: [
                { $dateToString: { date: "$createdAt", format: "%Y-%m-%d %H:%M:%S" } },
                " ",
                {
                  $reduce: {
                    input: { $objectToArray: "$values" },
                    initialValue: "",
                    in: { $concat: ["$$value", " ", "$$this.k", " ", { $toString: "$$this.v" }] },
                  },
                },
              ],
            },
            regex: escapedQuery,
            options: "i",
          },
        },
      },
    });
  }

  stages.push({
    $facet: {
      items: [{ $sort: { createdAt: -1 } }, { $skip: (page - 1) * limit }, { $limit: limit }],
      total: [{ $count: "count" }],
    },
  });
  const [result] = await collection().aggregate<SubmissionList>(stages).toArray();
  return Response.json({ items: result?.items ?? [], total: result?.total[0]?.count ?? 0, page, limit });
}

export async function POST(request: Request) {
  try {
    const limited = await rateLimitDistributed(request, "page-submissions-public", 10, 60_000);
    if (limited) return limited;
    const body = (await request.json().catch(() => null)) as Partial<Submission> | null;
    if (
      !body?.pageId ||
      !body.blockId ||
      typeof body.pageId !== "string" ||
      body.pageId.length > 120 ||
      typeof body.blockId !== "string" ||
      body.blockId.length > 120 ||
      !validValues(body.values)
    )
      return Response.json({ error: "Invalid submission." }, { status: 400 });
    const page = await client
      .db()
      .collection<{ id: string; published: boolean; blocks?: { id: string; type: string }[] }>("pages")
      .findOne({ id: body.pageId }, { projection: { id: 1, published: 1, blocks: 1 } });
    if (!page?.published || !page.blocks?.some((block) => block.id === body.blockId && block.type === "form"))
      return Response.json({ error: "This form is unavailable." }, { status: 404 });
    const now = new Date();
    const item: Submission = {
      id: randomUUID(),
      pageId: body.pageId,
      blockId: body.blockId,
      values: body.values,
      createdAt: now,
      updatedAt: now,
    };
    await collection().insertOne(item);
    return Response.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Could not save page submission.", error);
    return Response.json({ error: "Could not save your submission. Please try again." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const limited = await rateLimitDistributed(request, "page-submissions-admin", 60, 60_000);
  if (limited) return limited;
  const access = await requireDashboardPermission(request, "PUT");
  if (access.error) return access.error;
  const body = (await request.json().catch(() => null)) as Partial<Submission> | null;
  if (!body?.id || !validValues(body.values)) return Response.json({ error: "Invalid submission." }, { status: 400 });
  await collection().updateOne({ id: body.id }, { $set: { values: body.values, updatedAt: new Date() } });
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const limited = await rateLimitDistributed(request, "page-submissions-admin", 60, 60_000);
  if (limited) return limited;
  const access = await requireDashboardPermission(request, "DELETE");
  if (access.error) return access.error;
  const body = (await request.json().catch(() => null)) as { ids?: string[] } | null;
  const ids = body?.ids?.filter(Boolean) ?? [];
  if (ids.length) {
    const result = await collection().deleteMany({ id: { $in: ids } });
    return Response.json({ ok: true, count: result.deletedCount });
  }
  const id = new URL(request.url).searchParams.get("id");
  const result = await collection().deleteOne({ id: id ?? "" });
  return Response.json({ ok: true, count: result.deletedCount });
}
