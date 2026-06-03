import { normalizeSymptomText } from '../triage/symptomParser.js';
import { RISK_LEVELS } from '../triage/types.js';

export const MEDICATION_DISCLAIMER =
  'Consult a healthcare professional before taking any medication.';

/**
 * @typedef {Object} HomeCareProfile
 * @property {string} title
 * @property {string[]} symptomIds
 * @property {string[]} [textPatterns]
 * @property {string[]} homeRemedies
 * @property {string[]} otcOptions
 * @property {string[]} wellnessTips
 */

/** @type {HomeCareProfile[]} */
const HOME_CARE_PROFILES = [
  {
    title: 'Cold & cough comfort',
    symptomIds: ['cough', 'sore_throat'],
    textPatterns: ['cold', 'runny nose', 'congestion', 'stuffy nose'],
    homeRemedies: [
      'Sip warm fluids such as herbal tea, broth, or warm water with honey (not for children under 1 year).',
      'Try salt-water gargles several times a day to soothe a sore throat.',
      'Use a cool-mist humidifier or steam from a warm shower to ease congestion.',
      'Get plenty of rest and keep your head slightly elevated when lying down.',
    ],
    otcOptions: [
      'Throat lozenges or sprays for temporary sore-throat relief (follow package directions).',
      'Saline nasal spray or rinses to help clear nasal passages.',
      'Acetaminophen (paracetamol) or ibuprofen for discomfort, if appropriate for you.',
    ],
    wellnessTips: [
      'Drink fluids regularly — water, warm soups, and herbal teas help you stay hydrated.',
      'Prioritize rest; your body recovers best when you slow down for a day or two.',
      'Choose soft, easy-to-digest foods — soups, fruits, and light meals are gentle on the system.',
    ],
  },
  {
    title: 'Fever care',
    symptomIds: ['fever', 'high_fever'],
    textPatterns: ['temperature', 'feeling feverish'],
    homeRemedies: [
      'Rest in a comfortable, cool room and wear lightweight clothing.',
      'Use a cool, damp cloth on your forehead or wrists if you feel overheated.',
      'Take lukewarm baths or sponging only if it helps you feel better — avoid cold shocks.',
    ],
    otcOptions: [
      'Acetaminophen (paracetamol) for fever reduction, at the lowest effective dose on the label.',
      'Oral rehydration solution (ORS) or electrolyte drinks if you have been sweating or unwell.',
      'Ibuprofen may be used for fever in some adults — confirm suitability with a pharmacist if unsure.',
    ],
    wellnessTips: [
      'Hydration is key — sip water, ORS, coconut water, or clear broths throughout the day.',
      'Allow your body to rest; short naps and early nights support recovery.',
      'Eat small, nourishing meals when appetite returns — bananas, rice, toast, and yogurt are easy options.',
    ],
  },
  {
    title: 'Headache relief',
    symptomIds: ['headache'],
    textPatterns: ['head pain', 'migraine'],
    homeRemedies: [
      'Rest in a quiet, dimly lit room away from screens and loud noise.',
      'Apply a cool or warm compress to your forehead or neck — use whichever feels soothing.',
      'Gentle neck and shoulder stretches may ease tension-type headaches.',
      'Practice slow, deep breathing for a few minutes to reduce stress-related tension.',
    ],
    otcOptions: [
      'Acetaminophen (paracetamol) for mild to moderate headache relief.',
      'Ibuprofen may help some tension headaches — take with food if your stomach is sensitive.',
    ],
    wellnessTips: [
      'Drink a full glass of water — dehydration is a common headache trigger.',
      'Aim for consistent sleep; even one night of better rest can make a difference.',
      'Eat regular meals and limit excess caffeine, which can sometimes worsen headaches.',
    ],
  },
  {
    title: 'Acidity & stomach comfort',
    symptomIds: ['abdominal_pain'],
    textPatterns: ['acidity', 'heartburn', 'acid reflux', 'indigestion', 'gastric', 'upset stomach'],
    homeRemedies: [
      'Eat smaller, more frequent meals rather than large portions.',
      'Avoid lying down for 2–3 hours after eating; prop your head up slightly if resting.',
      'Identify and limit common triggers — spicy foods, citrus, chocolate, caffeine, or alcohol.',
      'Ginger tea or chamomile may feel soothing for some mild stomach upset.',
    ],
    otcOptions: [
      'Antacids (e.g., calcium carbonate, magnesium hydroxide) for occasional heartburn relief.',
      'H2 blockers or proton-pump inhibitors are available OTC for frequent reflux — ask a pharmacist which fits you.',
    ],
    wellnessTips: [
      'Stay hydrated with water; avoid large amounts of carbonated or acidic drinks.',
      'Give your digestive system a break with bland foods — rice, bananas, toast, and oatmeal.',
      'Manage stress with light walks or relaxation — it can ease gut symptoms for some people.',
    ],
  },
  {
    title: 'General recovery support',
    symptomIds: ['fatigue', 'body_aches', 'dizziness', 'rash'],
    homeRemedies: [
      'Listen to your body — light activity is fine, but avoid pushing through exhaustion.',
      'Keep your living space comfortable: fresh air, moderate temperature, and minimal irritants.',
    ],
    otcOptions: [
      'Acetaminophen (paracetamol) for general aches, if appropriate and not contraindicated for you.',
    ],
    wellnessTips: [
      'Sip fluids steadily through the day to support energy and circulation.',
      'Rest when you need to; gradual return to normal activity is perfectly okay.',
      'Focus on balanced meals with protein, vegetables, and whole grains when you feel up to eating.',
    ],
  },
];

/** @type {HomeCareProfile} */
const BASELINE_WELLNESS = {
  title: 'Everyday wellness',
  symptomIds: [],
  homeRemedies: [],
  otcOptions: [],
  wellnessTips: [
    'Keep a glass of water nearby and sip regularly — hydration supports your whole recovery.',
    'Give yourself permission to rest; healing often speeds up when you slow down.',
    'Choose nourishing, easy-to-eat foods until you feel back to your usual self.',
  ],
};

/**
 * @param {import('../triage/types.js').TriageResult} result
 * @param {string} [symptomsText]
 * @returns {boolean}
 */
export function shouldShowHomeCare(result) {
  if (result.isEmergency) return false;
  if (result.riskLevel === RISK_LEVELS.HIGH) return false;
  return result.riskLevel === RISK_LEVELS.LOW || result.riskLevel === RISK_LEVELS.MODERATE;
}

/**
 * @param {import('../triage/types.js').TriageResult} result
 * @param {string} [symptomsText]
 * @returns {boolean}
 */
export function shouldShowEmergencyCareOnly(result) {
  return result.riskLevel === RISK_LEVELS.HIGH || result.isEmergency;
}

/**
 * @param {import('../triage/types.js').MatchedSymptom[]} matchedSymptoms
 * @param {string} symptomsText
 * @returns {HomeCareProfile[]}
 */
function resolveProfiles(matchedSymptoms, symptomsText) {
  const normalized = normalizeSymptomText(symptomsText);
  const matchedIds = new Set(matchedSymptoms.map((s) => s.id));

  const selected = HOME_CARE_PROFILES.filter((profile) => {
    const idMatch = profile.symptomIds.some((id) => matchedIds.has(id));
    const textMatch = profile.textPatterns?.some((p) => normalized.includes(p));
    return idMatch || textMatch;
  });

  if (selected.length === 0) {
    return [
      {
        ...BASELINE_WELLNESS,
        homeRemedies: [
          'Take it easy today and monitor how you feel over the next 24–48 hours.',
          'Keep a simple symptom diary (time, severity) to share with a clinician if needed.',
        ],
        otcOptions: [
          'Only use over-the-counter medicines if you are familiar with them and they are appropriate for your situation.',
        ],
      },
    ];
  }

  return selected;
}

/**
 * Deduplicates an array of remedy/tip strings (preserves order).
 * @param {string[]} items
 * @returns {string[]}
 */
function dedupeList(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out;
}

/**
 * @param {import('../triage/types.js').TriageResult} result
 * @param {string} [symptomsText]
 * @returns {{ intro: string; homeRemedies: string[]; otcOptions: string[]; wellnessTips: string[]; profiles: string[] } | null}
 */
export function getHomeCareGuidance(result, symptomsText = '') {
  if (!shouldShowHomeCare(result)) return null;

  const profiles = resolveProfiles(result.matchedSymptoms, symptomsText);
  const riskLabel = result.riskLevel === RISK_LEVELS.LOW ? 'low' : 'moderate';

  return {
    intro: `Your triage level is ${riskLabel}, which often responds well to gentle self-care at home. The suggestions below may help you feel more comfortable while you keep an eye on your symptoms. If anything worsens, don't hesitate to seek medical advice.`,
    profiles: profiles.map((p) => p.title),
    homeRemedies: dedupeList([
      ...profiles.flatMap((p) => p.homeRemedies),
      ...BASELINE_WELLNESS.homeRemedies,
    ]),
    otcOptions: dedupeList(profiles.flatMap((p) => p.otcOptions)),
    wellnessTips: dedupeList([
      ...profiles.flatMap((p) => p.wellnessTips),
      ...BASELINE_WELLNESS.wellnessTips,
    ]),
  };
}

/**
 * Friendly emergency-only messaging for high-risk presentations.
 * @param {import('../triage/types.js').TriageResult} result
 */
export function getEmergencyCareGuidance(result) {
  if (!shouldShowEmergencyCareOnly(result)) return null;

  return {
    intro:
      'Your symptoms suggest a higher level of concern. Home remedies and over-the-counter medicines are not recommended right now — please focus on getting professional or emergency care.',
    actions: result.recommendedActions,
  };
}
