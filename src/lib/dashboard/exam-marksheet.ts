/*
|-----------------------------------------
| setting up branded PDF marksheets with highlighted marks and Unicode answer review
|-----------------------------------------
*/

import { examDuration, examResultSummary, type ExamResult } from "./course-exams";
import { questionMarks } from "./courses";

const palette = {
  brand: "#cf302b",
  ink: "#292524",
  muted: "#706764",
  line: "#e8ddd6",
  blush: "#fff1ee",
  correct: "#176849",
  correctBg: "#eef8f1",
  incorrect: "#b32c29",
  incorrectBg: "#fff0ee",
  unanswered: "#915609",
  unansweredBg: "#fff7e6",
};
const fontFamily = 'Arial, "Nirmala UI", sans-serif';

/** Trim only the logo's white margins in memory; the original brand asset stays unchanged. */
export async function marksheetLogo() {
  const logo = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the marksheet logo."));
    image.src = "/Logo.png";
  });
  const source = document.createElement("canvas");
  source.width = logo.naturalWidth;
  source.height = logo.naturalHeight;
  const context = source.getContext("2d");
  if (!context) throw new Error("Could not prepare the marksheet logo.");
  context.drawImage(logo, 0, 0);
  const pixels = context.getImageData(0, 0, source.width, source.height).data;
  let left = source.width,
    top = source.height,
    right = 0,
    bottom = 0;
  for (let y = 0; y < source.height; y++) {
    for (let x = 0; x < source.width; x++) {
      const offset = (y * source.width + x) * 4;
      if (pixels[offset + 3] > 16 && (pixels[offset] < 245 || pixels[offset + 1] < 245 || pixels[offset + 2] < 245)) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  }
  if (right <= left || bottom <= top) return source;
  left = Math.max(0, left - 12);
  top = Math.max(0, top - 12);
  const cropped = document.createElement("canvas");
  cropped.width = Math.min(source.width - left, right - left + 13);
  cropped.height = Math.min(source.height - top, bottom - top + 13);
  const cropContext = cropped.getContext("2d");
  if (!cropContext) throw new Error("Could not prepare the marksheet logo.");
  cropContext.fillStyle = "#ffffff";
  cropContext.fillRect(0, 0, cropped.width, cropped.height);
  cropContext.drawImage(source, left, top, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);
  return cropped;
}

/** Browser shaping preserves Bengali and other scripts in the exported PDF. */
export async function downloadExamMarksheet(result: ExamResult) {
  const [{ jsPDF }, logo] = await Promise.all([import("jspdf"), marksheetLogo(), document.fonts.ready]);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("PDF rendering is unavailable in this browser.");
  const ctx = context;
  const margin = 72,
    width = canvas.width - margin * 2,
    bottom = canvas.height - 112;
  const summary = examResultSummary(result);
  let y = 0,
    page = 0,
    currentQuestion = "";

  function font(size: number, bold = false) {
    ctx.font = `${bold ? "bold " : ""}${size}px ${fontFamily}`;
  }
  function text(value: string, x: number, top: number, size = 22, bold = false, color = palette.ink) {
    font(size, bold);
    ctx.fillStyle = color;
    ctx.fillText(value, x, top + size);
  }
  function box(x: number, top: number, w: number, h: number, color: string, border?: string, radius = 14) {
    ctx.beginPath();
    ctx.roundRect(x, top, w, h, radius);
    ctx.fillStyle = color;
    ctx.fill();
    if (border) {
      ctx.strokeStyle = border;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
  function wrap(value: string, maxWidth = width, size = 22, bold = false) {
    font(size, bold);
    const lines: string[] = [];
    for (const block of value.split(/\r?\n/)) {
      let current = "";
      for (const token of block.split(/(\s+)/u).filter(Boolean)) {
        if (current && ctx.measureText(current + token).width > maxWidth) {
          lines.push(current.trimEnd());
          current = "";
        }
        if (ctx.measureText(token).width > maxWidth) {
          for (const { segment } of new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(token)) {
            if (current && ctx.measureText(current + segment).width > maxWidth) {
              lines.push(current);
              current = "";
            }
            current += segment;
          }
        } else current += token;
      }
      lines.push(current.trim());
    }
    return lines;
  }
  function startPage() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = palette.brand;
    ctx.fillRect(0, 0, canvas.width, 10);
    const logoWidth = 216,
      logoHeight = Math.min(100, (logo.height / logo.width) * logoWidth);
    ctx.drawImage(logo, margin, 43, logoWidth, logoHeight);
    ctx.save();
    ctx.textAlign = "right";
    text("EXAMINATION RESULT", canvas.width - margin, 43, 16, true, palette.brand);
    text("MCQ Marksheet", canvas.width - margin, 68, 34, true);
    text("Student copy", canvas.width - margin, 113, 17, false, palette.muted);
    ctx.restore();
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(margin, 159);
    ctx.lineTo(canvas.width - margin, 159);
    ctx.stroke();
    y = 183;
    if (currentQuestion) {
      text(`${currentQuestion} - continued`, margin, y, 17, true, palette.muted);
      y += 38;
    }
  }
  function flushPage() {
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, bottom + 25);
    ctx.lineTo(canvas.width - margin, bottom + 25);
    ctx.stroke();
    text("TestPrep Center | Examination record", margin, canvas.height - 68, 16, true, palette.muted);
    text(`Attempt: ${result.id}`, margin, canvas.height - 42, 14, false, palette.muted);
    ctx.save();
    ctx.textAlign = "right";
    text(`Page ${page + 1}`, canvas.width - margin, canvas.height - 58, 17, false, palette.muted);
    ctx.restore();
    if (page) pdf.addPage();
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 210, 297);
    page++;
  }
  function space(height: number) {
    if (y + height > bottom) {
      flushPage();
      startPage();
    }
  }
  function paragraph(value: string, size = 22, bold = false, color = palette.ink) {
    for (const line of wrap(value, width, size, bold)) {
      space(size + 12);
      text(line, margin, y, size, bold, color);
      y += size + 12;
    }
  }

  startPage();
  text("COURSE", margin, y, 15, true, palette.muted);
  y += 26;
  paragraph(result.courseName, 31, true);
  paragraph(result.examTitle, 23, false, palette.brand);
  y += 18;
  const columns = [
    [
      { label: "STUDENT", value: result.studentName },
      { label: "EMAIL", value: result.studentEmail },
    ],
    [
      {
        label: "SUBMITTED (BANGLADESH TIME)",
        value: new Date(result.submittedAt!).toLocaleString("en-GB", {
          timeZone: "Asia/Dhaka",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      { label: "STATUS", value: "Completed" },
    ],
  ];
  const columnWidth = (width - 72) / 2;
  const columnHeights = columns.map((column) =>
    column.reduce(
      (height, item) => height + wrap(item.value, columnWidth, 21, item.label === "STUDENT").length * 30 + 38,
      0,
    ),
  );
  const metadataHeight = Math.max(...columnHeights) + 24;
  space(metadataHeight);
  box(margin, y, width, metadataHeight, "#fffaf5", palette.line);
  columns.forEach((column, index) => {
    let rowY = y + 20;
    const x = margin + 24 + index * (columnWidth + 24);
    column.forEach(({ label, value }) => {
      text(label, x, rowY, 15, true, palette.muted);
      rowY += 28;
      for (const line of wrap(value, columnWidth, 21, label === "STUDENT")) {
        text(line, x, rowY, 21, label === "STUDENT");
        rowY += 30;
      }
      rowY += 10;
    });
  });
  y += metadataHeight + 24;
  space(300);
  box(margin, y, width, 180, palette.blush, "#edc4bd", 20);
  text("MARKS OBTAINED", margin + 26, y + 20, 17, true, palette.brand);
  text(`${result.score ?? 0} / ${result.totalMarks}`, margin + 26, y + 47, 62, true, palette.brand);
  text("Your total marks for this examination", margin + 28, y + 124, 19, false, palette.muted);
  box(canvas.width - margin - 234, y + 20, 210, 126, "#ffffff", undefined, 16);
  ctx.save();
  ctx.textAlign = "center";
  text(`${summary.percentage}%`, canvas.width - margin - 129, y + 32, 43, true, palette.brand);
  text("PERCENTAGE", canvas.width - margin - 129, y + 91, 15, true, palette.muted);
  ctx.restore();
  box(margin + 28, y + 158, width - 56, 5, "#efd5ce", undefined, 2);
  if (summary.percentage > 0)
    box(margin + 28, y + 158, ((width - 56) * Math.min(100, summary.percentage)) / 100, 5, palette.brand, undefined, 2);
  y += 198;
  const metrics = [
    { label: "CORRECT", value: String(summary.correct), color: palette.correct, bg: palette.correctBg },
    { label: "INCORRECT", value: String(summary.incorrect), color: palette.incorrect, bg: palette.incorrectBg },
    { label: "UNANSWERED", value: String(summary.unanswered), color: palette.unanswered, bg: palette.unansweredBg },
    { label: "TIME TAKEN", value: examDuration(result.elapsedSeconds ?? 0), color: palette.ink, bg: "#f5f3f0" },
  ];
  const metricWidth = (width - 42) / 4;
  metrics.forEach((metric, index) => {
    const x = margin + index * (metricWidth + 14);
    box(x, y, metricWidth, 94, metric.bg);
    text(metric.label, x + 18, y + 15, 15, true, metric.color);
    text(metric.value, x + 18, y + 40, 29, true, metric.color);
  });
  y += 125;
  paragraph("Answer breakdown", 27, true);
  paragraph("Highlighted answers show the correct choice and your selected response.", 18, false, palette.muted);
  y += 16;

  result.questions.forEach((question, index) => {
    currentQuestion = "";
    const selected = result.answers[index];
    const correct = selected === question.correctOptionIndex;
    const status = selected == null ? "UNANSWERED" : correct ? "CORRECT" : "INCORRECT";
    const color = selected == null ? palette.unanswered : correct ? palette.correct : palette.incorrect;
    const tint = selected == null ? palette.unansweredBg : correct ? palette.correctBg : palette.incorrectBg;
    const earned = correct ? questionMarks(question) : 0;
    const titleLines = wrap(`${index + 1}. ${question.title}`, width - 260, 23, true);
    const titleHeight = Math.max(98, titleLines.length * 34 + 24);
    const optionsHeight = question.options.reduce((height, option, optionIndex) => {
      const highlighted = optionIndex === question.correctOptionIndex || optionIndex === selected;
      return (
        height +
        wrap(
          `${String.fromCharCode(65 + optionIndex)}. ${option}`,
          width - 40,
          22,
          optionIndex === question.correctOptionIndex,
        ).length *
          32 +
        32 +
        (highlighted ? 27 : 0)
      );
    }, 0);
    const questionHeight =
      titleHeight +
      24 +
      wrap(question.question).length * 34 +
      optionsHeight +
      (selected == null ? 36 : 0) +
      (question.explanation ? 27 + wrap(question.explanation, width, 21).length * 33 : 0) +
      27;
    space(questionHeight <= bottom - 221 ? questionHeight : titleHeight + 76);
    currentQuestion = `Question ${index + 1}`;
    box(margin, y, width, titleHeight, "#faf8f5", palette.line);
    titleLines.forEach((line, position) => text(line, margin + 18, y + 14 + position * 34, 23, true));
    box(canvas.width - margin - 220, y + 12, 202, 43, tint);
    text(`${earned} / ${questionMarks(question)} marks`, canvas.width - margin - 204, y + 19, 21, true, color);
    text(status, canvas.width - margin - 204, y + 64, 14, true, color);
    y += titleHeight + 14;
    paragraph(question.question);
    y += 10;
    question.options.forEach((option, optionIndex) => {
      const isCorrect = optionIndex === question.correctOptionIndex,
        isSelected = optionIndex === selected;
      const rowColor = isCorrect ? palette.correct : isSelected ? palette.incorrect : palette.ink;
      const rowBg = isCorrect ? palette.correctBg : isSelected ? palette.incorrectBg : "#ffffff";
      const label = [isCorrect ? "Correct answer" : "", isSelected ? "Your answer" : ""].filter(Boolean).join(" | ");
      const lines = wrap(`${String.fromCharCode(65 + optionIndex)}. ${option}`, width - 40, 22, isCorrect);
      const height = lines.length * 32 + 24 + (label ? 27 : 0);
      space(height + 8);
      box(margin, y, width, height, rowBg, isCorrect ? "#bcd8c5" : isSelected ? "#edc4bd" : palette.line, 10);
      lines.forEach((line, position) => text(line, margin + 20, y + 10 + position * 32, 22, isCorrect, rowColor));
      if (label) text(label, margin + 20, y + 12 + lines.length * 32, 17, true, rowColor);
      y += height + 8;
    });
    if (selected == null) {
      paragraph("Your answer: Unanswered", 19, true, palette.unanswered);
      y += 5;
    }
    if (question.explanation) {
      space(74);
      paragraph("EXPLANATION", 15, true, palette.muted);
      paragraph(question.explanation, 21, false, palette.muted);
    }
    y += 27;
  });
  flushPage();
  pdf.setProperties({
    title: `${result.examTitle} - Marksheet`,
    subject: result.courseName,
    author: "TestPrep Center",
  });
  pdf.save(`marksheet-${result.id}.pdf`);
}
