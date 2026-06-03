import {
  getHomeCareGuidance,
  getEmergencyCareGuidance,
  MEDICATION_DISCLAIMER,
} from '../../homeCare/index.js';
import './triage.css';

/**
 * @param {Object} props
 * @param {import('../../triage/types.js').TriageResult} props.result
 * @param {string} [props.symptomsText]
 */
export function HomeCareAssistant({ result, symptomsText = '' }) {
  const homeCare = getHomeCareGuidance(result, symptomsText);
  const emergencyCare = getEmergencyCareGuidance(result);

  if (!homeCare && !emergencyCare) return null;

  if (emergencyCare) {
    return (
      <section className="home-care-section home-care-emergency" aria-labelledby="home-care-heading">
        <h4 id="home-care-heading" className="home-care-heading">
          Care guidance
        </h4>
        <p className="home-care-intro">{emergencyCare.intro}</p>
        <div className="home-care-card home-care-card-emergency">
          <h5 className="home-care-card-title">What to do now</h5>
          <ul className="home-care-list">
            {emergencyCare.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (!homeCare) return null;

  return (
    <section className="home-care-section" aria-labelledby="home-care-heading">
      <h4 id="home-care-heading" className="home-care-heading">
        <span aria-hidden="true">🏠</span> Home Care Assistant
      </h4>
      <p className="home-care-intro">{homeCare.intro}</p>

      <div className="home-care-card">
        <h5 className="home-care-card-title">Home remedies</h5>
        <ul className="home-care-list">
          {homeCare.homeRemedies.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="home-care-card">
        <h5 className="home-care-card-title">Common OTC options</h5>
        <ul className="home-care-list">
          {homeCare.otcOptions.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        <p className="home-care-med-disclaimer">{MEDICATION_DISCLAIMER}</p>
      </div>

      <div className="home-care-card">
        <h5 className="home-care-card-title">Hydration, rest &amp; nutrition</h5>
        <ul className="home-care-list">
          {homeCare.wellnessTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
