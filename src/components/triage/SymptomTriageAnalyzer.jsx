import { useState } from 'react';
import { useMedicalTriage } from '../../hooks/useMedicalTriage.js';
import { TriageResultPanel } from './TriageResultPanel.jsx';
import { VoiceSymptomField } from './VoiceSymptomField.jsx';
import './triage.css';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.sparkleIcon
 * @param {React.ReactNode} props.stethoscopeIcon
 * @param {React.ReactNode} props.arrowRightIcon
 */
export function SymptomTriageAnalyzer({ sparkleIcon, stethoscopeIcon, arrowRightIcon }) {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const { analyze, loading, result, error } = useMedicalTriage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await analyze({ symptomsText: symptoms, age, gender });
  };

  return (
    <section className="analyzer-section container" id="analyzer">
      <div className="analyzer-title-group">
        <span className="hero-badge" style={{ marginBottom: '12px' }}>
          {stethoscopeIcon}
          Medical Triage Engine
        </span>
        <h2 className="analyzer-section-title">AI Symptom Triage Analyzer</h2>
        <p className="analyzer-section-subtitle">
          Rule-based clinical decision support with risk scoring, explainable symptom mapping, and
          emergency detection. Not a substitute for professional diagnosis.
        </p>
      </div>

      <div className="analyzer-card">
        <div className="analyzer-grid">
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
          >
            <VoiceSymptomField
              id="symptoms-input"
              value={symptoms}
              onChange={setSymptoms}
              placeholder="e.g., fever and cough for 2 days, or sudden chest discomfort with shortness of breath..."
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '8px',
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="age-input">
                  Age
                </label>
                <input
                  type="number"
                  id="age-input"
                  className="input-field"
                  placeholder="e.g. 35"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Biological Gender</label>
                <div className="gender-options">
                  <button
                    type="button"
                    className={`gender-btn ${gender === 'Female' ? 'active' : ''}`}
                    onClick={() => setGender('Female')}
                  >
                    Female
                  </button>
                  <button
                    type="button"
                    className={`gender-btn ${gender === 'Male' ? 'active' : ''}`}
                    onClick={() => setGender('Male')}
                  >
                    Male
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-gradient ${loading ? 'disabled' : ''}`}
              style={{ width: '100%', height: '48px', marginTop: '16px' }}
              disabled={loading}
            >
              {loading ? 'Running Triage Engine...' : 'Run Medical Triage'}
              {arrowRightIcon}
            </button>

            {error && <p className="triage-form-error">{error}</p>}
          </form>

          <div className="results-panel">
            {loading ? (
              <div className="typing-indicator" style={{ background: 'transparent' }}>
                <div className="typing-dot" style={{ backgroundColor: 'var(--primary)' }} />
                <div className="typing-dot" style={{ backgroundColor: 'var(--secondary)' }} />
                <div className="typing-dot" style={{ backgroundColor: 'var(--accent-purple)' }} />
              </div>
            ) : (
              <TriageResultPanel
                result={result}
                patientContext={{ age, gender, symptomsText: symptoms }}
                sparkleIcon={sparkleIcon}
                placeholderIcon={stethoscopeIcon}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
