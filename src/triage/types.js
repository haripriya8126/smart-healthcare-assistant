/**
 * @typedef {'low' | 'moderate' | 'high'} RiskLevel
 */

/**
 * @typedef {Object} TriageInput
 * @property {string} symptomsText - Free-text symptom description
 * @property {number} [age] - Patient age in years
 * @property {string} [gender] - Optional demographic context for narrative only
 */

/**
 * @typedef {Object} MatchedSymptom
 * @property {string} id
 * @property {string} label
 * @property {string} category
 * @property {number} riskWeight
 * @property {boolean} isEmergency
 * @property {string} matchedPhrase
 * @property {string} [clinicalContext]
 */

/**
 * @typedef {Object} ScoreContribution
 * @property {string} symptomId
 * @property {string} label
 * @property {number} points
 * @property {string} matchedPhrase
 * @property {string} [clinicalContext]
 */

/**
 * @typedef {Object} ExplainabilityReport
 * @property {string} summary
 * @property {string} riskLevelRationale
 * @property {ScoreContribution[]} factors
 * @property {{ label: string; multiplier: number; add: number; reason: string } | null} ageAdjustment
 * @property {string} scoringMethod
 */

/**
 * @typedef {Object} PossibleCondition
 * @property {string} name
 * @property {number} relevance - 0-100 relative likelihood indicator
 * @property {string} recommendation
 */

/**
 * @typedef {Object} TriageResult
 * @property {number} riskScore - 0-100 composite score
 * @property {RiskLevel} riskLevel
 * @property {boolean} isEmergency
 * @property {string[]} emergencySymptoms
 * @property {MatchedSymptom[]} matchedSymptoms
 * @property {ExplainabilityReport} explanation
 * @property {PossibleCondition[]} possibleConditions
 * @property {string[]} recommendedActions
 * @property {string} specialistRouting
 * @property {string} displayTitle
 * @property {string} disclaimer
 */

export const RISK_LEVELS = /** @type {const} */ ({
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
});

export const RISK_THRESHOLDS = {
  LOW_MAX: 30,
  MODERATE_MAX: 60,
};

export const MEDICAL_DISCLAIMER =
  'This triage engine provides decision-support guidance only. It is not a diagnosis and does not replace licensed medical care. Call emergency services (911) for life-threatening symptoms.';
