/*
|-----------------------------------------
| setting up protected MCQ management and examination result endpoints
|-----------------------------------------
*/

import { authorizeMcqAdmin, mcqError, mcqJson, mcqPage } from "@/app/api/lib/mcq-exam-access";
import { McqExamError } from "@/lib/dashboard/mcq-exams";
import {
  deleteMcqExam,
  getMcqExam,
  listMcqExams,
  mcqExamResult,
  mcqExamResults,
  saveMcqExam,
} from "@/lib/services/mcq-exams";

export async function GET(request: Request) {
  try {
    const denied = await authorizeMcqAdmin(request);
    if (denied) return denied;
    const params = new URL(request.url).searchParams;
    const id = params.get("id");
    if (!id) return mcqJson(await listMcqExams(mcqPage(params.get("page"))));
    if (params.has("attemptId")) return mcqJson(await mcqExamResult(id, params.get("attemptId") || ""));
    if (params.get("results") === "true") return mcqJson(await mcqExamResults(id, mcqPage(params.get("page"))));
    return mcqJson(await getMcqExam(id));
  } catch (error) {
    return mcqError(error);
  }
}

async function save(request: Request, editing: boolean) {
  try {
    const denied = await authorizeMcqAdmin(request);
    if (denied) return denied;
    const body = await request.json().catch(() => null);
    if (editing && (typeof body?.id !== "string" || !body.id))
      throw new McqExamError(400, "Provide an examination ID.");
    return mcqJson(await saveMcqExam(body, editing ? body.id : undefined), editing ? 200 : 201);
  } catch (error) {
    return mcqError(error);
  }
}
export const POST = (request: Request) => save(request, false);
export const PATCH = (request: Request) => save(request, true);

export async function DELETE(request: Request) {
  try {
    const denied = await authorizeMcqAdmin(request);
    if (denied) return denied;
    const id = new URL(request.url).searchParams.get("id")?.trim();
    if (!id || id.length > 128) throw new McqExamError(400, "Provide an examination ID.");
    return mcqJson(await deleteMcqExam(id));
  } catch (error) {
    return mcqError(error);
  }
}
