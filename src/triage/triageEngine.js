import { parseSymptoms } from './symptomParser.js';
import { calculateRiskScore } from './riskScorer.js';
import { classifyRisk } from './riskClassifier.js';
import { buildExplainability } from './explainability.js';
import {
  buildRecommendedActions,
  derivePossibleConditions,
  routeSpecialist,
} from './recommendations.js';
import { MEDICAL_DISCLAIMER } from './types.js';

/**
 * Medical Triage Engine — primary API for symptom-based risk assessment.
 * Deterministic, explainable clinical decision support (not a diagnostic device).
 *
 * @param {import('./types.js').TriageInput} input
 * @returns {import('./types.js').TriageResult}
 */
export function runMedicalTriage(input) {
  const symptomsText = input.symptomsText?.trim() ?? '';
  const age =
    input.age != null && input.age !== ''
      ? Number.parseInt(String(input.age), 10)
      : undefined;
  const parsedAge = Number.isNaN(age) ? undefined : age;
  const gender = input.gender?.trim() || undefined;

  const matchedSymptoms = parseSymptoms(symptomsText);
  const emergencySymptoms = matchedSymptoms
    .filter((s) => s.isEmergency)
    .map((s) => s.label);
  const isEmergency = emergencySymptoms.length > 0;

  const { total, contributions, ageAdjustment } = calculateRiskScore(
    matchedSymptoms,
    parsedAge,
  );

  const classification = classifyRisk(total, isEmergency);

  const explanation = buildExplainability({
    riskScore: total,
    classification,
    contributions,
    ageAdjustment,
    isEmergency,
    age: parsedAge,
    gender,
  });

  const possibleConditions = derivePossibleConditions(matchedSymptoms);
  const recommendedActions = buildRecommendedActions(
    classification.level,
    isEmergency,
    matchedSymptoms,
  );
  const specialistRouting = routeSpecialist(
    classification.level,
    isEmergency,
    matchedSymptoms,
  );

  return {
    riskScore: total,
    riskLevel: classification.level,
    isEmergency,
    emergencySymptoms,
    matchedSymptoms,
    explanation,
    possibleConditions,
    recommendedActions,
    specialistRouting,
    displayTitle: classification.label,
    disclaimer: MEDICAL_DISCLAIMER,
  };
}
