/*
|-----------------------------------------
| setting up compact Unicode PDF results with paginated MCQ answer review
|-----------------------------------------
*/

import { marksheetLogo } from "./exam-marksheet";
import { mcqDate, mcqDuration, mcqQuestionMarks, type McqResult } from "./mcq-exams";

/** Both student and admin downloads use the attempt's original questions and answers. */
export async function downloadMcqMarksheet(result: McqResult) {
  const [{ jsPDF }, logo] = await Promise.all([import("jspdf"), marksheetLogo(), document.fonts.ready]);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("PDF rendering is unavailable in this browser.");
  const ctx = context;
  const margin = 64,
    width = canvas.width - margin * 2,
    bottom = canvas.height - 100;
  const palette = {
    brand: "#cf302b",
    ink: "#292524",
    muted: "#706764",
    line: "#e8ddd6",
    correct: "#176849",
    incorrect: "#b32c29",
  };
  let y = 0,
    page = 0,
    continuation = "";
  function font(size: number, bold = false) {
    ctx.font = `${bold ? "bold " : ""}${size}px Arial, "Nirmala UI", sans-serif`;
  }
  function text(value: string, x: number, top: number, size = 18, bold = false, color = palette.ink) {
    font(size, bold);
    ctx.fillStyle = color;
    ctx.fillText(value, x, top + size);
  }
  function wrap(value: string, maxWidth = width, size = 18, bold = false) {
    font(size, bold);
    const lines: string[] = [];
    for (const block of value.split(/\r?\n/)) {
      let row = "";
      for (const token of block.split(/(\s+)/u).filter(Boolean)) {
        const tokenWidth = ctx.measureText(token).width;
        if (row && tokenWidth <= maxWidth && ctx.measureText(row + token).width > maxWidth) {
          lines.push(row.trimEnd());
          row = "";
        }
        if (tokenWidth > maxWidth) {
          for (const { segment } of new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(token)) {
            if (row && ctx.measureText(row + segment).width > maxWidth) {
              lines.push(row);
              row = "";
            }
            row += segment;
          }
        } else row += token;
      }
      lines.push(row.trim());
    }
    return lines;
  }
  function rule(top: number) {
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, top);
    ctx.lineTo(canvas.width - margin, top);
    ctx.stroke();
  }
  function startPage() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = palette.brand;
    ctx.fillRect(0, 0, canvas.width, 6);
    const logoWidth = 170,
      logoHeight = Math.min(65, (logo.height / logo.width) * logoWidth);
    ctx.drawImage(logo, margin, 30, logoWidth, logoHeight);
    ctx.save();
    ctx.textAlign = "right";
    text("MCQ RESULT SHEET", canvas.width - margin, 31, 22, true, palette.brand);
    text("TestPrep Center | Examination record", canvas.width - margin, 64, 15, false, palette.muted);
    ctx.restore();
    rule(110);
    y = 132;
    if (continuation) {
      text(`${continuation} - continued`, margin, y, 15, true, palette.muted);
      y += 28;
    }
  }
  function flushPage() {
    rule(bottom + 20);
    text(`Result ID: ${result.id}`, margin, bottom + 32, 13, false, palette.muted);
    text(`Mobile: ${result.mobile} | Attempt ${result.attemptNumber}`, margin, bottom + 53, 13, false, palette.muted);
    ctx.save();
    ctx.textAlign = "right";
    text(`Page ${page + 1}`, canvas.width - margin, bottom + 41, 14, false, palette.muted);
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
  function paragraph(value: string, size = 18, bold = false, color = palette.ink, indent = 0, background?: string) {
    const lineHeight = size + 8;
    for (const line of wrap(value, width - indent - (background ? 20 : 0), size, bold)) {
      space(lineHeight);
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(margin + indent, y, width - indent, lineHeight);
      }
      text(line, margin + indent + (background ? 10 : 0), y + 1, size, bold, color);
      y += lineHeight;
    }
  }

  startPage();
  paragraph(result.examTitle, 25, true);
  y += 12;
  const columns = [
    [
      { label: "STUDENT", value: result.studentName },
      { label: "MOBILE NUMBER", value: result.mobile },
    ],
    [
      { label: "COMPLETED (BANGLADESH TIME)", value: mcqDate(result.submittedAt) },
      { label: "ATTEMPT", value: String(result.attemptNumber) },
    ],
  ];
  const columnWidth = (width - 72) / 2;
  const metadataHeight =
    Math.max(
      ...columns.map((column) =>
        column.reduce((sum, field) => sum + 27 + wrap(field.value, columnWidth, 18, true).length * 26 + 12, 0),
      ),
    ) + 18;
  space(metadataHeight);
  ctx.fillStyle = "#fffaf0";
  ctx.fillRect(margin, y, width, metadataHeight);
  columns.forEach((column, index) => {
    const x = margin + 18 + index * (width / 2);
    let rowY = y + 12;
    for (const field of column) {
      text(field.label, x, rowY, 13, true, palette.muted);
      rowY += 27;
      for (const line of wrap(field.value, columnWidth, 18, true)) {
        text(line, x, rowY, 18, true);
        rowY += 26;
      }
      rowY += 12;
    }
  });
  y += metadataHeight + 16;
  space(110);
  ctx.fillStyle = "#fff1ee";
  ctx.fillRect(margin, y, width, 96);
  const percentage = result.totalMarks ? Math.round((result.score / result.totalMarks) * 1000) / 10 : 0;
  const metrics = [
    { label: "MARKS OBTAINED", value: `${result.score} / ${result.totalMarks}` },
    { label: "PERCENTAGE", value: `${percentage}%` },
    { label: "TOTAL TIME", value: mcqDuration(result.totalTimeMs) },
    { label: "QUESTIONS", value: String(result.questions.length) },
  ];
  metrics.forEach((metric, index) => {
    const x = margin + 18 + index * (width / 4);
    text(metric.label, x, y + 14, 13, true, palette.muted);
    text(metric.value, x, y + 42, index === 2 ? 22 : 30, true, palette.brand);
  });
  y += 115;
  paragraph("Questions and answer review", 20, true);
  paragraph(
    "Correct answers are highlighted in green. Your selected answers and question timings appear below.",
    15,
    false,
    palette.muted,
  );
  y += 12;

  result.questions.forEach((question, index) => {
    const selected = result.answers[index],
      correct = selected === question.correctOptionIndex;
    const color = correct ? palette.correct : palette.incorrect;
    const questionLines = wrap(question.question, width, 18, true);
    const optionRows = question.options.map((option, optionIndex) => {
      const isCorrect = optionIndex === question.correctOptionIndex,
        isSelected = optionIndex === selected;
      const suffix = [isCorrect ? "Correct answer" : "", isSelected ? "Selected answer" : ""]
        .filter(Boolean)
        .join(" | ");
      const value = `${String.fromCharCode(65 + optionIndex)}. ${option}${suffix ? `  [${suffix}]` : ""}`;
      return { value, isCorrect, isSelected, lines: wrap(value, width - 36, 17, isCorrect) };
    });
    const blockHeight =
      36 + questionLines.length * 26 + optionRows.reduce((sum, option) => sum + option.lines.length * 25 + 3, 0) + 34;
    continuation = "";
    space(blockHeight <= bottom - 160 ? blockHeight : 100);
    continuation = `Question ${index + 1}`;
    ctx.fillStyle = "#f5f3f0";
    ctx.fillRect(margin, y, width, 29);
    text(`QUESTION ${index + 1}`, margin + 10, y + 5, 14, true);
    ctx.save();
    ctx.textAlign = "right";
    text(
      `${correct ? "Correct" : "Incorrect"} | ${correct ? mcqQuestionMarks(question) : 0} / ${mcqQuestionMarks(question)} marks | ${(result.questionTimesMs[index] / 1000).toFixed(2)}s`,
      canvas.width - margin - 10,
      y + 5,
      14,
      true,
      color,
    );
    ctx.restore();
    y += 36;
    paragraph(question.question, 18, true);
    for (const option of optionRows) {
      space(Math.min(2, option.lines.length) * 25);
      paragraph(
        option.value,
        17,
        option.isCorrect,
        option.isCorrect ? palette.correct : option.isSelected ? palette.incorrect : palette.ink,
        16,
        option.isCorrect ? "#eef8f1" : option.isSelected ? "#fff0ee" : undefined,
      );
      y += 3;
    }
    y += 12;
    if (y < bottom) rule(y);
    y += 16;
    continuation = "";
  });
  flushPage();
  pdf.setProperties({
    title: `${result.examTitle} - Result Sheet`,
    subject: "MCQ examination result and complete answer review",
    author: "TestPrep Center",
  });
  const filenameTitle =
    result.examTitle
      .replace(/[<>:"/\\|?*]/g, "-")
      .replace(/\p{Cc}/gu, " ")
      .replace(/\s+/g, " ")
      .trim() || "Exam";
  pdf.save(`TPC-${filenameTitle}-${result.attemptNumber}.pdf`);
}
