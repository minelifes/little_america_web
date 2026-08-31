import { jsPDF } from "jspdf";
import type { OrderDetail } from "../api/types";
import { formatUkrainianDateTime } from "./date";
import { PT_MONO_BASE64 } from "./ptMonoFontBase64";
import { useBonuses } from "../api/constants";

// NOT ported from Dart — client-side PDF receipt for the storefront's
// account pages ("ЗАВАНТАЖИТИ ЧЕК" button, see ReceiptView.tsx). Deliberately
// mirrors the LAYOUT of the in-store thermal receipt printed by the admin
// app's ReceiptCheckBuilder (smartseller/lib/helpers/esc_pos/receipt_check_builder.dart)
// via CheckPrinterHelper.instance.createAndPrintReceipt: same 57mm paper
// width, same "Чек №/Назва-К-сть-Ціна table/Сума/footer" structure, and a
// fixed-width "Courier"-style font to match a real thermal printout — this
// runs entirely in the browser from the customer-facing order-detail API
// response, which has no access to PRRO fiscal fields (fiscal number, RRN,
// terminal id, cash register QR) or payment-method breakdown, only what
// CustomerOrderDetailDto exposes.

const PAGE_WIDTH_MM = 57;
const MARGIN_MM = 3;
const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2;

const FONT_NAME = "PTMono";

function registerReceiptFont(doc: jsPDF) {
  doc.addFileToVFS("PTMono-Regular.ttf", PT_MONO_BASE64);
  doc.addFont("PTMono-Regular.ttf", FONT_NAME, "normal");
}

/** Draws the full receipt starting at y = MARGIN_MM and returns the final y
 * position reached — used both to measure the exact page height needed
 * (dry run on an oversized page) and, a second time, to draw onto the
 * correctly-sized real page. Purely a function of `order`, so both passes
 * produce identical layouts. */
function drawReceipt(doc: jsPDF, order: OrderDetail): number {
  const centerX = PAGE_WIDTH_MM / 2;
  let y = MARGIN_MM + 2;

  // PT Mono only ships a Regular cut (no bold) — "bold" here fakes a
  // heavier weight by filling the glyph and then stroking its outline, so
  // headers/totals still read as emphasized without a second font weight.
  const setFont = (weight: "normal" | "bold", size: number) => {
    doc.setFont(FONT_NAME, "normal");
    doc.setFontSize(size);
    if (weight === "bold") {
      doc.setLineWidth(Math.max(0.12, size * 0.018));
      doc.setDrawColor(0, 0, 0);
    }
  };

  const textOpts = (weight: "normal" | "bold", align: "left" | "center" | "right") =>
    weight === "bold" ? { align, renderingMode: "fillThenStroke" as const } : { align };

  const centerText = (text: string, weight: "normal" | "bold", size: number, gapAfter = 4) => {
    setFont(weight, size);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH_MM);
    for (const line of lines) {
      doc.text(line, centerX, y, textOpts(weight, "center"));
      y += size * 0.42;
    }
    y += gapAfter;
  };

  const hr = (gapBefore = 1, gapAfter = 3.5) => {
    y += gapBefore;
    doc.setLineWidth(0.15);
    doc.line(MARGIN_MM, y, PAGE_WIDTH_MM - MARGIN_MM, y);
    y += gapAfter;
  };

  const row = (left: string, right: string, weight: "normal" | "bold" = "normal", size = 8) => {
    setFont(weight, size);
    doc.text(left, MARGIN_MM, y, textOpts(weight, "left"));
    doc.text(right, PAGE_WIDTH_MM - MARGIN_MM, y, textOpts(weight, "right"));
    y += size * 0.45;
  };

  // --- Header ---
  centerText("LITTLE AMERICA", "bold", 11, 2);
  centerText("ІПН: 3637510801", "normal", 6.5, 0.5);
  centerText("ФОП: Серватович В.О.", "normal", 6.5, 3);
  centerText(`Чек №${order.number}`, "bold", 9, 3);

  // --- Item table header ---
  setFont("bold", 7);
  doc.text("Назва", MARGIN_MM, y, textOpts("bold", "left"));
  doc.text("К-сть", centerX + 4, y, textOpts("bold", "center"));
  doc.text("Ціна", PAGE_WIDTH_MM - MARGIN_MM, y, textOpts("bold", "right"));
  y += 1.2;
  doc.setLineWidth(0.1);
  doc.line(MARGIN_MM, y, PAGE_WIDTH_MM - MARGIN_MM, y);
  y += 3;

  // --- Items ---
  for (const item of order.items) {
    setFont("normal", 8);
    const nameLines = doc.splitTextToSize(item.title, CONTENT_WIDTH_MM * 0.55);
    doc.text(nameLines[0], MARGIN_MM, y);
    doc.text(String(item.count), centerX + 4, y, { align: "center" });
    doc.text((item.price * item.count).toFixed(2), PAGE_WIDTH_MM - MARGIN_MM, y, { align: "right" });
    y += 3.4;
    for (let i = 1; i < nameLines.length; i++) {
      doc.text(nameLines[i], MARGIN_MM, y);
      y += 3.4;
    }
    if (item.variant) {
      setFont("normal", 6.5);
      const variantLines = doc.splitTextToSize(item.variant, CONTENT_WIDTH_MM);
      for (const line of variantLines) {
        doc.text(line, MARGIN_MM, y);
        y += 2.8;
      }
    }
    y += 1.5;
  }

  hr();
  row("Сума", `${order.sum.toFixed(2)} UAH`, "bold", 9);

  // Payment breakdown — mirrors the thermal receipt's card/cash rows
  // (ReceiptCheckBuilder). Card and certificate can appear together (a
  // certificate covering part of the sum, the rest paid by card/cash), so
  // these are independent checks, not a switch on `payment.type`.
  const { payment } = order;
  if (payment.type === "card") {
    row("Карта", `${(payment.cardSum ?? 0).toFixed(2)} UAH`, "bold");
    row("ЕПЗ", payment.cardNumber ?? "", "bold");
    row("Термінал", payment.terminalId ?? "", "bold");
    row("Код авторизації", payment.authCode ?? "", "bold");
    row("RRN", payment.rrn ?? "", "bold");
    row("Номер чеку", payment.billNumber ?? "", "bold");
  } else if (payment.type === "cash") {
    row("Готівка", `${(payment.cashInput ?? 0).toFixed(2)} UAH`);
    if (payment.cashOutput != null) {
      row("Решта", `${payment.cashOutput.toFixed(2)} UAH`);
    }
  }
  if (payment.certificateSum != null && payment.certificateSum > 0) {
    row("Сертифікат", `${payment.certificateSum.toFixed(2)} UAH`);
  }

  if (order.isOnline && order.deliveryFee > 0) {
    row("Доставка", `${order.deliveryFee.toFixed(2)} UAH`);
  }
  if (useBonuses && order.bonusesEarned > 0) {
    row("Нараховані бали", `+${order.bonusesEarned} Б`);
  }
  hr();

  // --- Footer ---
  centerText(formatUkrainianDateTime(order.createdAt), "normal", 7, 3);

  setFont("normal", 7);
  const footerLines = [
    "Інстаграм: @little_america_",
    "Інстаграм: @makeup_queen_ua",
    "Сайт: littleamerica.store",
    "Адреса: вул. Богдана Хмельницького 40а/1",
  ];
  for (const line of footerLines) {
    const wrapped = doc.splitTextToSize(line, CONTENT_WIDTH_MM);
    for (const w of wrapped) {
      doc.text(w, MARGIN_MM, y);
      y += 3;
    }
  }

  return y;
}

/** Builds the receipt PDF for `order` and returns it as a jsPDF instance
 * ready for `.save(filename)` — two-pass: first drawn on an oversized page
 * just to measure the content height, then redrawn on a page trimmed to
 * that exact height so the PDF isn't mostly blank space, matching a real
 * thermal receipt's look (fixed 57mm width, only as tall as it needs to be). */
export function buildReceiptPdf(order: OrderDetail): jsPDF {
  const measureDoc = new jsPDF({ unit: "mm", format: [PAGE_WIDTH_MM, 1000] });
  registerReceiptFont(measureDoc);
  const measuredHeight = drawReceipt(measureDoc, order) + MARGIN_MM;

  const doc = new jsPDF({ unit: "mm", format: [PAGE_WIDTH_MM, measuredHeight] });
  registerReceiptFont(doc);
  drawReceipt(doc, order);
  return doc;
}
