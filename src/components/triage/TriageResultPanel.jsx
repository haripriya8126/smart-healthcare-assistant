import { useState } from 'react';
import { toUiSeverity } from '../../triage/index.js';
import { downloadTriageReportPdf } from '../../reports/triageReportPdf.js';
import { EmergencyAlert } from './EmergencyAlert.jsx';
import { HomeCareAssistant } from './HomeCareAssistant.jsx';
import { NearbyHospitalsButton } from './NearbyHospitalsButton.jsx';
import './triage.css';

/**
 * @param {Object} props
 * @param {import('../../triage/types.js').TriageResult} props.result
 * @param {{ age?: string | number; gender?: string; symptomsText?: string }} [props.patientContext]
 * @param {React.ReactNode} [props.sparkleIcon]
 * @param {React.ReactNode} [props.placeholderIcon]
 */
export function TriageResultPanel({ result, patientContext, sparkleIcon, placeholderIcon }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadReport = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      await downloadTriageReportPdf({
        result,
        symptomsText: patientContext?.symptomsText ?? '',
        age: patientContext?.age,
        gender: patientContext?.gender,
        generatedAt: new Date(),
      });
    } finally {
      setDownloading(false);
    }
  };
  if (!result) {
    return (
      <div className="results-placeholder">
        <div className="results-placeholder-icon">{placeholderIcon}</div>
        <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: 'var(--text-main)' }}>
          Awaiting Triage Analysis
        </h4>
        <p
          style={{
            fontSize: '12.5px',
            color: 'var(--text-muted)',
            maxWidth: '280px',
            margin: '0 auto',
          }}
        >
          Complete the symptoms form and run the Medical Triage Engine to view risk scoring and
          explainable clinical guidance.
        </p>
      </div>
    );
  }

  const uiSeverity = toUiSeverity(result.riskLevel, result.isEmergency);

  return (
    <div style={{ width: '100%' }}>
      {result.isEmergency && <EmergencyAlert symptoms={result.emergencySymptoms} />}

      <div
        className="clinical-report-card"
        style={{ margin: 0, padding: 0, background: 'transparent', border: 'none' }}
      >
        <div className="triage-score-row">
          <div>
            <div className="triage-score-value">{result.riskScore}</div>
            <div className="triage-score-label">RISK SCORE / 100</div>
          </div>
          <div
            className={`clinical-header-badge ${uiSeverity}`}
            style={{ fontSize: '11px', padding: '6px 10px', margin: 0 }}
          >
            {sparkleIcon}
            {result.displayTitle}
          </div>
        </div>

        <p
          style={{
            fontSize: '13.5px',
            lineHeight: '1.45',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            textAlign: 'left',
          }}
        >
          {result.explanation.summary}
        </p>

        <div className="triage-report-actions">
          <button
            type="button"
            className="triage-download-btn"
            onClick={handleDownloadReport}
            disabled={downloading}
          >
            {downloading ? 'Generating PDF…' : 'Download Report'}
          </button>
        </div>

        <NearbyHospitalsButton result={result} />

        <HomeCareAssistant
          result={result}
          symptomsText={patientContext?.symptomsText ?? ''}
        />

        <div className="triage-explain-block">
          <h4 className="triage-explain-heading">WHY THIS RISK LEVEL?</h4>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              margin: '0 0 10px 0',
              lineHeight: 1.45,
            }}
          >
            {result.explanation.riskLevelRationale}
          </p>
          {result.explanation.factors.map((factor) => (
            <div key={factor.symptomId + factor.matchedPhrase} className="triage-factor-item">
              <div className="triage-factor-header">
                <span className="triage-factor-name">{factor.label}</span>
                <span className="triage-factor-points">+{factor.points} pts</span>
              </div>
              <p className="triage-factor-detail">
                Matched &quot;{factor.matchedPhrase}&quot;
                {factor.clinicalContext ? ` — ${factor.clinicalContext}` : ''}
              </p>
            </div>
          ))}
          {result.explanation.ageAdjustment && (
            <div className="triage-factor-item">
              <div className="triage-factor-header">
                <span className="triage-factor-name">Age adjustment</span>
                <span className="triage-factor-points">
                  ×{result.explanation.ageAdjustment.multiplier}
                  {result.explanation.ageAdjustment.add > 0
                    ? ` +${result.explanation.ageAdjustment.add}`
                    : ''}
                </span>
              </div>
              <p className="triage-factor-detail">{result.explanation.ageAdjustment.reason}</p>
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '0.5px',
            marginBottom: '12px',
            color: '#FFF',
            textAlign: 'left',
          }}
        >
          DIFFERENTIAL CONSIDERATIONS (NOT A DIAGNOSIS):
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
          {result.possibleConditions.map((cond) => (
            <div
              key={cond.name}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px',
                }}
              >
                <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#FFF' }}>
                  {cond.name}
                </span>
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--primary)' }}>
                  {cond.relevance}% relevance
                </span>
              </div>
              <div
                style={{
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${cond.relevance}%`,
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                    borderRadius: '2px',
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: '11.5px',
                  color: 'var(--text-muted)',
                  margin: 0,
                  lineHeight: '1.4',
                  textAlign: 'left',
                }}
              >
                <strong style={{ color: '#FFF' }}>Guidance:</strong> {cond.recommendation}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '0.5px',
            marginBottom: '10px',
            color: '#FFF',
            textAlign: 'left',
          }}
        >
          RECOMMENDED ACTIONS:
        </div>
        <ul
          className="clinical-bullet-list"
          style={{ paddingLeft: '16px', margin: '0 0 16px 0', fontSize: '12.5px' }}
        >
          {result.recommendedActions.map((action) => (
            <li key={action} style={{ marginBottom: '6px' }}>
              {action}
            </li>
          ))}
        </ul>

        <div
          className="clinical-doctor-booking"
          style={{
            background: 'rgba(255,255,255,0.02)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div className="clinical-doctor-info">
            <span className="clinical-doctor-label">SUGGESTED CARE PATHWAY:</span>
            <span className="clinical-doctor-name" style={{ color: 'var(--primary)' }}>
              {result.specialistRouting}
            </span>
          </div>
          <button
            type="button"
            className="clinical-book-btn"
            onClick={() =>
              alert(
                result.isEmergency
                  ? 'If this is an emergency, call 911 now. This demo does not place live consults.'
                  : `Care pathway: ${result.specialistRouting}`,
              )
            }
          >
            {result.isEmergency ? 'Emergency Info' : 'View Pathway'}
          </button>
        </div>

        <p className="triage-disclaimer">{result.disclaimer}</p>
      </div>
    </div>
  );
}
