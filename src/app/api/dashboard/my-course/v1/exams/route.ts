/*
|-----------------------------------------
| setting up student course materials, exam attempts, results, and allowance requests
|-----------------------------------------
*/

import { authorizeCourseExam, examError, examId } from "@/app/api/lib/course-exam-access";
import {
  requestExamAllowance,
  startCourseExam,
  studentCourseWorkspace,
  studentExamResult,
  submitCourseExam,
} from "@/lib/services/course-exams";

export async function GET(request: Request) {
  const access = await authorizeCourseExam(request);
  if (access.error || !access.session) return access.error;
  const params = new URL(request.url).searchParams;
  const courseId = examId(params.get("courseId"));
  if (!courseId) return Response.json({ error: "Course id is required." }, { status: 400 });
  try {
    const attemptId = examId(params.get("attemptId"));
    return Response.json(
      attemptId
        ? { result: await studentExamResult(access.session.user, courseId, attemptId) }
        : await studentCourseWorkspace(access.session.user, courseId),
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return examError(error);
  }
}

export async function POST(request: Request) {
  const access = await authorizeCourseExam(request);
  if (access.error || !access.session) return access.error;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const courseId = examId(body?.courseId);
  if (!courseId) return Response.json({ error: "Course id is required." }, { status: 400 });
  try {
    switch (body?.action) {
      case "start": {
        const id = examId(body.examId);
        if (!id) return Response.json({ error: "Exam id is required." }, { status: 400 });
        return Response.json({ attempt: await startCourseExam(access.session.user, courseId, id) });
      }
      case "submit": {
        const id = examId(body.attemptId);
        if (!id) return Response.json({ error: "Attempt id is required." }, { status: 400 });
        return Response.json({ result: await submitCourseExam(access.session.user, courseId, id, body.answers) });
      }
      case "request-more":
        return Response.json({ quota: await requestExamAllowance(access.session.user, courseId) });
      default:
        return Response.json({ error: "Choose a valid exam action." }, { status: 400 });
    }
  } catch (error) {
    return examError(error);
  }
}
