import { SYMPTOM_REGISTRY } from './symptomRegistry.js';

/**
 * @param {string} text
 * @returns {string}
 */
export function normalizeSymptomText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {string} symptomsText
 * @returns {import('./types.js').MatchedSymptom[]}
 */
export function parseSymptoms(symptomsText) {
  const normalized = normalizeSymptomText(symptomsText);
  if (!normalized) return [];

  /** @type {Map<string, import('./types.js').MatchedSymptom>} */
  const byId = new Map();

  for (const def of SYMPTOM_REGISTRY) {
    const matchedPhrase = def.patterns.find((pattern) => normalized.includes(pattern));
    if (!matchedPhrase) continue;

    if (!byId.has(def.id)) {
      byId.set(def.id, {
        id: def.id,
        label: def.label,
        category: def.category,
        riskWeight: def.riskWeight,
        isEmergency: def.isEmergency,
        matchedPhrase,
        clinicalContext: def.clinicalContext,
      });
    }
  }

  return Array.from(byId.values()).sort((a, b) => b.riskWeight - a.riskWeight);
}
