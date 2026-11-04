/*
|-----------------------------------------
| setting up course staff exam results and allowance review
|-----------------------------------------
*/

import { authorizeCourseExam, examError, examId } from "@/app/api/lib/course-exam-access";
import { adminCourseExams, reviewExamAllowance } from "@/lib/services/course-exams";

export async function GET(request: Request) {
  const access = await authorizeCourseExam(request, true);
  if (access.error) return access.error;
  const params = new URL(request.url).searchParams;
  const courseId = examId(params.get("courseId"));
  const page = Number(params.get("page") || 1);
  if (!courseId || !Number.isInteger(page) || page < 1 || page > 100_000)
    return Response.json({ error: "Provide a course and valid page." }, { status: 400 });
  try {
    return Response.json(await adminCourseExams(courseId, page), { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return examError(error);
  }
}

export async function PATCH(request: Request) {
  const access = await authorizeCourseExam(request, true);
  if (access.error || !access.session) return access.error;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const courseId = examId(body?.courseId),
    userId = examId(body?.userId),
    requestId = examId(body?.requestId);
  if (!courseId || !userId || !requestId || !["approve", "reject"].includes(String(body?.action)))
    return Response.json({ error: "Provide a student, course, request, and review action." }, { status: 400 });
  try {
    return Response.json({
      quota: await reviewExamAllowance(courseId, userId, requestId, body?.action === "approve", access.session.user.id),
    });
  } catch (error) {
    return examError(error);
  }
}
