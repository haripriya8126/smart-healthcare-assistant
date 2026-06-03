import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * @returns {typeof SpeechRecognition | null}
 */
function getSpeechRecognitionCtor() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * @param {string} code
 */
function mapSpeechError(code) {
  const messages = {
    'not-allowed':
      'Microphone access was denied. Allow microphone permission in your browser settings and try again.',
    'service-not-allowed': 'Speech recognition is blocked on this page. Use HTTPS or localhost.',
    'no-speech': 'No speech was detected. Try speaking again, a little closer to the microphone.',
    'audio-capture': 'No microphone was found. Check your device audio settings.',
    'network': 'Speech recognition needs a network connection in this browser.',
    'aborted': 'Voice input was stopped.',
  };
  return messages[code] || `Voice input error: ${code}`;
}

/**
 * Browser Speech Recognition hook for symptom dictation.
 *
 * @param {Object} options
 * @param {(text: string) => void} options.onTextChange - Called with the full symptom field value
 * @param {string} [options.lang='en-US']
 */
export function useSpeechRecognition({ onTextChange, lang = 'en-US' }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  const recognitionRef = useRef(/** @type {SpeechRecognition | null} */ (null));
  const baseTextRef = useRef('');
  const committedRef = useRef('');
  const isListeningRef = useRef(false);

  const composeText = useCallback((interim = '') => {
    const base = baseTextRef.current.trim();
    const committed = committedRef.current.trim();
    const interimTrim = interim.trim();
    let combined = base;
    if (committed) {
      combined = combined ? `${combined} ${committed}` : committed;
    }
    if (interimTrim) {
      combined = combined ? `${combined} ${interimTrim}` : interimTrim;
    }
    return combined;
  }, []);

  const publishText = useCallback(
    (interim = '') => {
      onTextChange(composeText(interim));
    },
    [composeText, onTextChange],
  );

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    setIsSupported(Boolean(Ctor));
    if (!Ctor) return undefined;

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let newFinal = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? '';
        if (result.isFinal) {
          newFinal += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (newFinal) {
        committedRef.current += newFinal;
      }

      publishText(interimTranscript);
    };

    recognition.onerror = (event) => {
      if (event.error === 'aborted') return;
      setError(mapSpeechError(event.error));
      isListeningRef.current = false;
      setIsListening(false);
    };

    recognition.onend = () => {
      if (!isListeningRef.current) return;
      try {
        recognition.start();
      } catch {
        isListeningRef.current = false;
        setIsListening(false);
        publishText('');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      isListeningRef.current = false;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    };
  }, [lang, publishText]);

  const startListening = useCallback(
    (currentText = '') => {
      const recognition = recognitionRef.current;
      if (!recognition) {
        setError('Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.');
        return;
      }

      setError(null);
      baseTextRef.current = currentText;
      committedRef.current = '';
      isListeningRef.current = true;
      setIsListening(true);

      try {
        recognition.lang = lang;
        recognition.start();
      } catch {
        try {
          recognition.stop();
          recognition.start();
        } catch {
          setError('Could not start voice input. Wait a moment and try again.');
          isListeningRef.current = false;
          setIsListening(false);
        }
      }
    },
    [lang],
  );

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    isListeningRef.current = false;
    setIsListening(false);

    if (!recognition) return;

    try {
      recognition.stop();
    } catch {
      /* ignore */
    }

    publishText('');
  }, [publishText]);

  const toggleListening = useCallback(
    (currentText = '') => {
      if (isListeningRef.current) {
        stopListening();
      } else {
        startListening(currentText);
      }
    },
    [startListening, stopListening],
  );

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    clearError: () => setError(null),
  };
}
