import { RISK_THRESHOLDS } from './types.js';

/**
 * @param {Object} params
 * @param {number} params.riskScore
 * @param {{ level: string; label: string; rationale: string }} params.classification
 * @param {import('./types.js').ScoreContribution[]} params.contributions
 * @param {{ multiplier: number; add: number; reason: string } | null} params.ageAdjustment
 * @param {boolean} params.isEmergency
 * @param {number} [params.age]
 * @param {string} [params.gender]
 * @returns {import('./types.js').ExplainabilityReport}
 */
export function buildExplainability({
  riskScore,
  classification,
  contributions,
  ageAdjustment,
  isEmergency,
  age,
  gender,
}) {
  const demographic =
    age != null && !Number.isNaN(age)
      ? `${age}-year-old${gender ? ` ${gender}` : ''} patient`
      : 'patient';

  const factorSummary =
    contributions.length > 0
      ? contributions.map((c) => `${c.label} (+${c.points} pts, matched "${c.matchedPhrase}")`).join('; ')
      : 'No registry patterns matched';

  const summary = isEmergency
    ? `Medical Triage Engine evaluated ${demographic} input and detected emergency-grade symptom patterns. ${factorSummary}.`
    : `Medical Triage Engine scored ${demographic} presentation at ${riskScore}/100 (${classification.label}). Key drivers: ${factorSummary}.`;

  return {
    summary,
    riskLevelRationale: classification.rationale,
    factors: contributions,
    ageAdjustment,
    scoringMethod: `Weighted symptom mapping with diminishing returns for co-occurring findings. Bands: Low 0–${RISK_THRESHOLDS.LOW_MAX}, Moderate ${RISK_THRESHOLDS.LOW_MAX + 1}–${RISK_THRESHOLDS.MODERATE_MAX}, High ${RISK_THRESHOLDS.MODERATE_MAX + 1}–100. Emergency patterns enforce minimum escalation.`,
  };
}
