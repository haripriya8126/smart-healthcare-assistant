/**
 * @param {number | undefined} age
 * @returns {{ multiplier: number; add: number; reason: string } | null}
 */
export function getAgeRiskAdjustment(age) {
  if (age == null || Number.isNaN(age)) return null;

  if (age < 3) {
    return {
      multiplier: 1.2,
      add: 5,
      reason: 'Infant/toddler age increases vulnerability to rapid deterioration.',
    };
  }
  if (age < 18) {
    return {
      multiplier: 1.05,
      add: 0,
      reason: 'Pediatric patients may need lower thresholds for escalation.',
    };
  }
  if (age >= 80) {
    return {
      multiplier: 1.25,
      add: 8,
      reason: 'Advanced age increases complication risk for many acute presentations.',
    };
  }
  if (age >= 65) {
    return {
      multiplier: 1.15,
      add: 5,
      reason: 'Older adults have higher baseline risk for serious outcomes.',
    };
  }
  return null;
}

/**
 * @param {import('./types.js').MatchedSymptom[]} matchedSymptoms
 * @param {number | undefined} age
 */
export function calculateRiskScore(matchedSymptoms, age) {
  /** @type {import('./types.js').ScoreContribution[]} */
  const contributions = [];

  if (matchedSymptoms.length === 0) {
    return {
      rawTotal: 12,
      total: 12,
      contributions: [
        {
          symptomId: 'unspecified',
          label: 'Unspecified symptoms',
          points: 12,
          matchedPhrase: '(no registry match)',
          clinicalContext:
            'No mapped red-flag patterns detected. Clinical review still advised if symptoms worsen.',
        },
      ],
      ageAdjustment: getAgeRiskAdjustment(age),
    };
  }

  let rawTotal = 0;
  for (const symptom of matchedSymptoms) {
    const diminishing =
      matchedSymptoms.length > 1 ? 0.92 ** contributions.length : 1;
    const points = Math.round(symptom.riskWeight * diminishing);
    rawTotal += points;
    contributions.push({
      symptomId: symptom.id,
      label: symptom.label,
      points,
      matchedPhrase: symptom.matchedPhrase,
      clinicalContext: symptom.clinicalContext,
    });
  }

  const ageAdjustment = getAgeRiskAdjustment(age);
  let total = rawTotal;
  if (ageAdjustment) {
    total = Math.round(rawTotal * ageAdjustment.multiplier + ageAdjustment.add);
  }

  const hasEmergency = matchedSymptoms.some((s) => s.isEmergency);
  if (hasEmergency) {
    total = Math.max(total, 75);
  }

  total = Math.min(100, Math.max(0, total));

  return {
    rawTotal,
    total,
    contributions,
    ageAdjustment,
  };
}
