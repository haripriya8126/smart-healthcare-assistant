import { useSpeechRecognition } from '../../hooks/useSpeechRecognition.js';

function MicrophoneIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
    </svg>
  );
}

/**
 * Symptom textarea with voice dictation (Web Speech API).
 *
 * @param {Object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {string} props.id
 * @param {string} [props.placeholder]
 * @param {number} [props.rows]
 */
export function VoiceSymptomField({ value, onChange, id, placeholder, rows = 4 }) {
  const {
    isListening,
    isSupported,
    error,
    toggleListening,
    stopListening,
    clearError,
  } = useSpeechRecognition({
    onTextChange: onChange,
  });

  const handleToggle = () => {
    clearError();
    toggleListening(value);
  };

  return (
    <div className="form-group voice-symptom-field">
      <div className="voice-symptom-label-row">
        <label className="form-label" htmlFor={id}>
          Describe Your Symptoms
        </label>
        {isSupported ? (
          <button
            type="button"
            className={`voice-mic-btn ${isListening ? 'listening' : ''}`}
            onClick={handleToggle}
            aria-pressed={isListening}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            title={isListening ? 'Stop listening' : 'Describe symptoms by voice'}
          >
            {isListening ? <StopIcon /> : <MicrophoneIcon />}
            <span>{isListening ? 'Stop' : 'Voice'}</span>
          </button>
        ) : (
          <span className="voice-unsupported-hint" title="Use Chrome, Edge, or Safari for voice input">
            Voice unavailable
          </span>
        )}
      </div>

      <div className={`voice-textarea-wrap ${isListening ? 'is-listening' : ''}`}>
        <textarea
          id={id}
          className="input-field voice-symptom-textarea"
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (isListening) stopListening();
            onChange(e.target.value);
          }}
          style={{ resize: 'none' }}
          required
          aria-describedby={isListening ? `${id}-voice-status` : undefined}
        />
        {isListening && (
          <div className="voice-listening-indicator" id={`${id}-voice-status`} role="status">
            <span className="voice-pulse-dot" />
            Listening… speak clearly at a normal pace
          </div>
        )}
      </div>

      {error && (
        <p className="voice-input-error" role="alert">
          {error}
        </p>
      )}

      {isSupported && !error && (
        <p className="voice-input-hint">
          Tap the microphone to dictate symptoms. Your speech is converted to text and fills this
          field automatically. Works on desktop and mobile browsers that support voice input.
        </p>
      )}
    </div>
  );
}
