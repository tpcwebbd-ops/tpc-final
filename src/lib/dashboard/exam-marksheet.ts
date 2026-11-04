/*
|-----------------------------------------
| setting up paginated PDF marksheets with browser-shaped Unicode text
|-----------------------------------------
*/

import { examDuration, type ExamResult } from "./course-exams";
import { questionMarks } from "./courses";

/** Canvas preserves Bengali and other scripts using the browser's installed fonts. */
export async function downloadExamMarksheet(result: ExamResult) {
  const { jsPDF } = await import("jspdf");
  await document.fonts.ready;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("PDF rendering is unavailable in this browser.");
  const margin = 80,
    width = canvas.width - margin * 2,
    bottom = canvas.height - 95;
  let currentQuestion = "";
  let y = 0,
    page = 0;
  function startPage() {
    context!.fillStyle = "#ffffff";
    context!.fillRect(0, 0, canvas.width, canvas.height);
    context!.fillStyle = "#173e35";
    context!.fillRect(0, 0, canvas.width, 18);
    context!.font = 'bold 28px Arial, "Nirmala UI", sans-serif';
    context!.fillText("TestPrep Center | MCQ Marksheet", margin, 78);
    if (currentQuestion) {
      context!.font = '20px Arial, "Nirmala UI", sans-serif';
      context!.fillText(`${currentQuestion} (continued)`, margin, 118);
    }
    y = currentQuestion ? 160 : 128;
  }
  function flushPage() {
    context!.font = '18px Arial, "Nirmala UI", sans-serif';
    context!.fillStyle = "#647067";
    context!.fillText(`Attempt ${result.id} | Page ${page + 1}`, margin, canvas.height - 45);
    if (page) pdf.addPage();
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 210, 297);
    page++;
  }
  function line(text: string, bold = false, color = "#253e33") {
    if (y + 34 > bottom) {
      flushPage();
      startPage();
    }
    context!.font = `${bold ? "bold " : ""}23px Arial, "Nirmala UI", sans-serif`;
    context!.fillStyle = color;
    context!.fillText(text, margin, y);
    y += 34;
  }
  function paragraph(text: string, bold = false, color?: string) {
    context!.font = `${bold ? "bold " : ""}23px Arial, "Nirmala UI", sans-serif`;
    for (const block of text.split(/\r?\n/)) {
      let current = "";
      for (const token of block.split(/(\s+)/u).filter(Boolean)) {
        if (current && context!.measureText(current + token).width > width) {
          line(current.trimEnd(), bold, color);
          current = "";
        }
        if (context!.measureText(token).width > width) {
          const segments = new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(token);
          for (const { segment } of segments) {
            if (current && context!.measureText(current + segment).width > width) {
              line(current, bold, color);
              current = "";
            }
            current += segment;
          }
        } else current += token;
      }
      line(current.trim(), bold, color);
    }
  }
  startPage();
  paragraph(result.courseName, true);
  paragraph(result.examTitle, true);
  paragraph(`Student: ${result.studentName}`);
  paragraph(`Email: ${result.studentEmail}`);
  paragraph(
    `Submitted: ${new Date(result.submittedAt!).toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })} (Bangladesh time)`,
  );
  paragraph(
    `Marks: ${result.score} / ${result.totalMarks} | Correct: ${result.correctCount} / ${result.questionCount} | Time: ${examDuration(result.elapsedSeconds ?? 0)}`,
    true,
  );
  y += 22;
  result.questions.forEach((question, index) => {
    currentQuestion = "";
    if (y + 140 > bottom) {
      flushPage();
      startPage();
    }
    const selected = result.answers[index];
    currentQuestion = `Question ${index + 1}`;
    const earned = selected === question.correctOptionIndex ? questionMarks(question) : 0;
    paragraph(`${index + 1}. ${question.title} (${earned} / ${questionMarks(question)} marks)`, true);
    paragraph(question.question);
    question.options.forEach((option, optionIndex) =>
      paragraph(
        `${String.fromCharCode(65 + optionIndex)}. ${option}${optionIndex === question.correctOptionIndex ? " [Correct answer]" : ""}${optionIndex === selected ? " [Your answer]" : ""}`,
        optionIndex === question.correctOptionIndex,
      ),
    );
    if (selected === null) paragraph("Your answer: Unanswered", false, "#a34328");
    if (question.explanation) paragraph(`Explanation: ${question.explanation}`, false, "#56665c");
    y += 24;
  });
  flushPage();
  pdf.save(`marksheet-${result.id}.pdf`);
}
