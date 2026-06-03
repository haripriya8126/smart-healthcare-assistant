/** @type {Record<string, import('./types.js').PossibleCondition[]>} */
const CATEGORY_CONDITIONS = {
  cardiovascular: [
    {
      name: 'Acute coronary syndrome (rule-out)',
      relevance: 72,
      recommendation: 'Emergency department evaluation with ECG and troponin if chest symptoms persist.',
    },
    {
      name: 'Musculoskeletal chest wall pain',
      relevance: 45,
      recommendation: 'Consider if pain is reproducible with palpation and no red flags.',
    },
  ],
  respiratory: [
    {
      name: 'Asthma / reactive airway exacerbation',
      relevance: 65,
      recommendation: 'Monitor peak flow if available; seek care if wheeze or breathlessness worsens.',
    },
    {
      name: 'Lower respiratory infection',
      relevance: 58,
      recommendation: 'Hydration, rest; seek care for high fever, hypoxia, or persistent cough > 10 days.',
    },
  ],
  neurological: [
    {
      name: 'Tension-type or migraine headache',
      relevance: 60,
      recommendation: 'Rest, hydration, OTC analgesics per label; escalate for thunderclap or neuro deficits.',
    },
    {
      name: 'Vestibular dysfunction',
      relevance: 50,
      recommendation: 'Avoid driving; seek evaluation if vertigo is sudden or accompanied by weakness.',
    },
  ],
  infectious: [
    {
      name: 'Viral upper respiratory infection',
      relevance: 70,
      recommendation: 'Supportive care, isolation if flu-like, monitor fever curve.',
    },
    {
      name: 'Bacterial infection (consider)',
      relevance: 40,
      recommendation: 'Seek care if fever > 3 days, worsening pain, or toxicity.',
    },
  ],
  gastrointestinal: [
    {
      name: 'Gastroenteritis',
      relevance: 62,
      recommendation: 'Oral rehydration; urgent care if severe pain, blood in stool, or dehydration.',
    },
  ],
  general: [
    {
      name: 'Nonspecific viral syndrome',
      relevance: 55,
      recommendation: 'Rest and monitor; escalate if new red-flag symptoms appear.',
    },
  ],
  ent: [
    {
      name: 'Pharyngitis / tonsillitis',
      relevance: 68,
      recommendation: 'Warm fluids, analgesics; strep testing if exudate or high fever.',
    },
  ],
  dermatologic: [
    {
      name: 'Allergic or viral rash',
      relevance: 58,
      recommendation: 'Avoid triggers; emergency care if airway or lip swelling occurs.',
    },
  ],
  hematologic: [
    {
      name: 'Gastrointestinal or pulmonary hemorrhage (rule-out)',
      relevance: 80,
      recommendation: 'Emergency evaluation for hemoptysis, melena, or uncontrolled bleeding.',
    },
  ],
  allergy: [
    {
      name: 'Anaphylaxis',
      relevance: 85,
      recommendation: 'Use epinephrine if prescribed; call emergency services immediately.',
    },
  ],
  mental_health: [
    {
      name: 'Acute mental health crisis',
      relevance: 90,
      recommendation: 'Contact local crisis line or emergency services; do not remain alone if unsafe.',
    },
  ],
};

/**
 * @param {import('./types.js').MatchedSymptom[]} matchedSymptoms
 * @returns {import('./types.js').PossibleCondition[]}
 */
export function derivePossibleConditions(matchedSymptoms) {
  if (matchedSymptoms.length === 0) {
    return [
      {
        name: 'Undifferentiated symptom presentation',
        relevance: 40,
        recommendation:
          'Monitor for 24–48 hours with rest and hydration. Seek care if symptoms worsen or new red flags develop.',
      },
    ];
  }

  /** @type {Map<string, import('./types.js').PossibleCondition>} */
  const merged = new Map();

  for (const symptom of matchedSymptoms) {
    const options = CATEGORY_CONDITIONS[symptom.category] ?? CATEGORY_CONDITIONS.general;
    for (const condition of options) {
      const key = condition.name;
      const existing = merged.get(key);
      if (!existing || condition.relevance > existing.relevance) {
        merged.set(key, { ...condition });
      }
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 4);
}

/**
 * @param {import('./types.js').RiskLevel} riskLevel
 * @param {boolean} isEmergency
 * @param {import('./types.js').MatchedSymptom[]} matchedSymptoms
 * @returns {string[]}
 */
export function buildRecommendedActions(riskLevel, isEmergency, matchedSymptoms) {
  if (isEmergency) {
    return [
      'Call emergency services (911 or your local number) now if symptoms are active or worsening.',
      'Do not drive yourself; stay with someone who can assist if possible.',
      'If prescribed (e.g., epinephrine, nitroglycerin), use as directed while awaiting help.',
      'Prepare a brief symptom timeline and medication list for responders.',
    ];
  }

  const actions = [];

  if (riskLevel === 'high') {
    actions.push(
      'Seek same-day urgent care or emergency evaluation depending on symptom progression.',
      'Avoid strenuous activity until evaluated by a licensed clinician.',
    );
  } else if (riskLevel === 'moderate') {
    actions.push(
      'Schedule a clinical visit within 24–48 hours or use telehealth triage.',
      'Track temperature, pain level, and hydration; seek care sooner if worsening.',
    );
  } else {
    actions.push(
      'Use supportive self-care: rest, fluids, and OTC medicines only as directed on labels.',
      'Re-assess if symptoms persist beyond 48 hours or new red flags appear.',
    );
  }

  if (matchedSymptoms.some((s) => s.category === 'respiratory')) {
    actions.push('Monitor breathing comfort; seek care if oxygen levels drop or breathlessness increases.');
  }
  if (matchedSymptoms.some((s) => s.category === 'infectious')) {
    actions.push('Practice hand hygiene and isolation if contagious illness is suspected.');
  }

  return actions;
}

/**
 * @param {import('./types.js').RiskLevel} riskLevel
 * @param {boolean} isEmergency
 * @param {import('./types.js').MatchedSymptom[]} matchedSymptoms
 */
export function routeSpecialist(riskLevel, isEmergency, matchedSymptoms) {
  if (isEmergency) {
    const emergency = matchedSymptoms.find((s) => s.isEmergency);
    if (emergency?.category === 'cardiovascular') return 'Emergency Cardiology / Chest Pain Unit';
    if (emergency?.category === 'neurological') return 'Emergency Neurology / Stroke Team';
    if (emergency?.category === 'respiratory') return 'Emergency Pulmonary / Respiratory Care';
    if (emergency?.category === 'mental_health') return 'Crisis Mental Health Services';
    return 'Emergency Department — General Triage';
  }

  const primary = matchedSymptoms[0]?.category;
  const map = {
    cardiovascular: 'Cardiology Clinic',
    respiratory: 'Pulmonology / Primary Care',
    neurological: 'Neurology or Primary Care',
    infectious: 'Infectious Disease / Primary Care',
    gastrointestinal: 'Gastroenterology / Primary Care',
    dermatologic: 'Dermatology / Primary Care',
    ent: 'ENT / Primary Care',
    general: 'Primary Care / Telehealth',
  };

  if (riskLevel === 'high') {
    return `Urgent ${map[primary] ?? 'Primary Care'}`;
  }
  return map[primary] ?? 'Primary Care / Telehealth';
}
