/*
|-----------------------------------------
| setting up CourseStatus.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 7 November, 2026
|-----------------------------------------
*/

import { EXAM_PASS_PERCENTAGE } from "@/lib/dashboard/course-status";

export function StatusBadge({ label, style }: { label: string; style: string }) {
  return (
    <span className={"inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold " + style}>
      {label}
    </span>
  );
}
export function ExamStatusLegend() {
  return (
    <div
      className="flex flex-wrap gap-x-5 gap-y-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-xs text-slate-600"
      aria-label="Exam status colors"
    >
      <span>
        <i aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-emerald-500" />
        Above 80%: excellent
      </span>
      <span>
        <i aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-sky-500" />
        {EXAM_PASS_PERCENTAGE}% to 80%: passed
      </span>
      <span>
        <i aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-rose-400" />
        Below {EXAM_PASS_PERCENTAGE}%: failed / unfinished
      </span>
    </div>
  );
}
