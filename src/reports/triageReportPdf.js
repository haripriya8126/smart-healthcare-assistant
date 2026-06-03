/** UI palette (RGB) */
const COLORS = {
  bg: [9, 11, 17],
  card: [17, 25, 40],
  border: [45, 55, 72],
  text: [248, 250, 252],
  muted: [148, 163, 184],
  primary: [0, 242, 254],
  secondary: [79, 172, 254],
  low: [16, 185, 129],
  moderate: [245, 158, 11],
  high: [239, 68, 68],
};

/**
 * @typedef {Object} TriageReportPdfInput
 * @property {import('../triage/types.js').TriageResult} result
 * @property {string} symptomsText
 * @property {string | number} [age]
 * @property {string} [gender]
 * @property {Date} [generatedAt]
 */

/**
 * @param {import('../triage/types.js').RiskLevel} level
 * @returns {number[]}
 */
function riskLevelRgb(level, isEmergency) {
  if (isEmergency || level === 'high') return COLORS.high;
  if (level === 'moderate') return COLORS.moderate;
  return COLORS.low;
}

/**
 * @param {string} level
 */
function formatRiskLevelLabel(level, isEmergency) {
  const base = level.toUpperCase();
  if (isEmergency) return `${base} — EMERGENCY INDICATORS`;
  return base;
}

/**
 * @param {jsPDF} doc
 * @param {number} margin
 * @param {number} contentWidth
 * @param {number} y
 * @param {number} required
 * @param {number} pageHeight
 */
function ensureSpace(doc, margin, contentWidth, y, required, pageHeight) {
  if (y + required <= pageHeight - margin) return y;
  doc.addPage();
  paintPageBackground(doc, pageHeight, contentWidth + margin * 2);
  return margin + 8;
}

/**
 * @param {jsPDF} doc
 * @param {number} pageHeight
 * @param {number} pageWidth
 */
function paintPageBackground(doc, pageHeight, pageWidth) {
  doc.setFillColor(...COLORS.bg);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
}

/**
 * @param {jsPDF} doc
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {number} maxWidth
 * @param {number} lineHeight
 */
function wrapText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line, i) => {
    doc.text(line, x, y + i * lineHeight);
  });
  return y + lines.length * lineHeight;
}

/**
 * Generates and downloads a clinical triage PDF report.
 * @param {TriageReportPdfInput} input
 */
export async function downloadTriageReportPdf(input) {
  const { jsPDF } = await import('jspdf');
  const { result, symptomsText, age, gender } = input;
  const generatedAt = input.generatedAt ?? new Date();

  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  paintPageBackground(doc, pageHeight, pageWidth);

  // Header gradient bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 3, 'F');
  doc.setFillColor(...COLORS.secondary);
  doc.rect(pageWidth * 0.55, 0, pageWidth * 0.45, 3, 'F');

  y += 6;
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SmartAssist.AI', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.text('Medical Triage Clinical Report', margin, y + 6);

  doc.setFontSize(8);
  const timestampStr = generatedAt.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  doc.text(`Generated: ${timestampStr}`, pageWidth - margin, y, { align: 'right' });
  doc.text('Report ID: TRI-' + generatedAt.getTime().toString(36).toUpperCase(), pageWidth - margin, y + 5, {
    align: 'right',
  });

  y += 18;
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.2);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Patient demographics card
  doc.setFillColor(...COLORS.card);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, 'FD');

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.text('PATIENT INFORMATION', margin + 6, y);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  const ageLabel = age != null && String(age).trim() !== '' ? `${age} years` : 'Not provided';
  const genderLabel = gender?.trim() || 'Not provided';
  doc.text(`Age: ${ageLabel}`, margin + 6, y);
  doc.text(`Biological gender: ${genderLabel}`, margin + 6 + contentWidth / 2, y);

  y += 22;

  // Symptoms
  y = ensureSpace(doc, margin, contentWidth, y, 40, pageHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.primary);
  doc.text('REPORTED SYMPTOMS', margin, y);
  y += 6;

  doc.setFillColor(...COLORS.card);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.text);
  y = wrapText(doc, symptomsText.trim() || '—', margin + 5, y + 7, contentWidth - 10, 4.5);
  y += 14;

  // Risk assessment row
  y = ensureSpace(doc, margin, contentWidth, y, 45, pageHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.primary);
  doc.text('RISK ASSESSMENT', margin, y);
  y += 8;

  const riskRgb = riskLevelRgb(result.riskLevel, result.isEmergency);
  doc.setFillColor(...COLORS.card);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...COLORS.text);
  doc.text(String(result.riskScore), margin + 8, y + 18);
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text('/ 100', margin + 22, y + 18);

  doc.setFillColor(...riskRgb);
  const badgeW = 72;
  doc.roundedRect(pageWidth - margin - badgeW - 6, y + 8, badgeW, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(9, 11, 17);
  const badgeLabel = formatRiskLevelLabel(result.riskLevel, result.isEmergency);
  doc.text(badgeLabel, pageWidth - margin - badgeW / 2 - 6, y + 16.5, { align: 'center' });

  y += 38;

  if (result.isEmergency) {
    y = ensureSpace(doc, margin, contentWidth, y, 28, pageHeight);
    doc.setFillColor(48, 18, 22);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
    doc.setDrawColor(...COLORS.high);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.high);
    doc.text('EMERGENCY — SEEK IMMEDIATE MEDICAL CARE (CALL 911)', margin + 5, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.text);
    const emergText = result.emergencySymptoms.join(', ') || 'Critical patterns detected';
    y = wrapText(doc, emergText, margin + 5, y + 14, contentWidth - 10, 3.8);
    y += 12;
  }

  // Clinical summary
  y = ensureSpace(doc, margin, contentWidth, y, 30, pageHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.primary);
  doc.text('CLINICAL SUMMARY', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  y = wrapText(doc, result.explanation.summary, margin, y, contentWidth, 4.2);
  y += 8;

  // Differential considerations
  y = ensureSpace(doc, margin, contentWidth, y, 20, pageHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.primary);
  doc.text('DIFFERENTIAL CONSIDERATIONS (NOT A DIAGNOSIS)', margin, y);
  y += 7;

  result.possibleConditions.forEach((cond) => {
    const blockHeight = 26;
    y = ensureSpace(doc, margin, contentWidth, y, blockHeight, pageHeight);
    doc.setFillColor(...COLORS.card);
    doc.roundedRect(margin, y, contentWidth, blockHeight - 4, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.text);
    doc.text(cond.name, margin + 5, y + 7);
    doc.setTextColor(...COLORS.primary);
    doc.text(`${cond.relevance}% relevance`, pageWidth - margin - 5, y + 7, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    wrapText(doc, cond.recommendation, margin + 5, y + 13, contentWidth - 10, 3.6);
    y += blockHeight;
  });

  y += 4;

  // Recommendations
  y = ensureSpace(doc, margin, contentWidth, y, 20, pageHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.primary);
  doc.text('RECOMMENDATIONS', margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.text);
  result.recommendedActions.forEach((action, index) => {
    y = ensureSpace(doc, margin, contentWidth, y, 12, pageHeight);
    doc.setTextColor(...COLORS.primary);
    doc.text(`${index + 1}.`, margin, y);
    doc.setTextColor(...COLORS.text);
    y = wrapText(doc, action, margin + 6, y, contentWidth - 8, 4.2);
    y += 2;
  });

  y += 6;

  // Care pathway
  y = ensureSpace(doc, margin, contentWidth, y, 18, pageHeight);
  doc.setFillColor(...COLORS.card);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text('SUGGESTED CARE PATHWAY', margin + 5, y + 6);
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.primary);
  doc.text(result.specialistRouting, margin + 5, y + 11);
  y += 20;

  // Footer disclaimer
  y = ensureSpace(doc, margin, contentWidth, y, 24, pageHeight);
  doc.setDrawColor(...COLORS.border);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  wrapText(doc, result.disclaimer, margin, y, contentWidth, 3.4);

  const dateSlug = generatedAt.toISOString().slice(0, 10);
  const filename = `SmartAssist-Triage-Report-${dateSlug}.pdf`;
  doc.save(filename);
}
