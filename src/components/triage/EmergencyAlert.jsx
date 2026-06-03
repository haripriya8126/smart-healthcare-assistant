import './triage.css';

/**
 * @param {{ symptoms: string[] }} props
 */
export function EmergencyAlert({ symptoms }) {
  if (!symptoms?.length) return null;

  return (
    <div className="triage-emergency-banner" role="alert" aria-live="assertive">
      <h3 className="triage-emergency-title">
        <span aria-hidden="true">🚨</span>
        EMERGENCY — SEEK IMMEDIATE MEDICAL CARE
      </h3>
      <p className="triage-emergency-body">
        Critical symptom patterns were detected. Call <strong>911</strong> (or your local emergency
        number) if you are in immediate danger or symptoms are severe.
      </p>
      <ul className="triage-emergency-list">
        {symptoms.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </div>
  );
}
