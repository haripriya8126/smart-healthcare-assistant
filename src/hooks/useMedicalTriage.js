import { useCallback, useState } from 'react';
import { runMedicalTriage } from '../triage/index.js';

/**
 * React hook wrapping the Medical Triage Engine.
 */
export function useMedicalTriage() {
  const [loading, setLoading] = useState(false);
  /** @type {[import('../triage/types.js').TriageResult | null, Function]} */
  const [result, setResult] = useState(null);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  const analyze = useCallback(async ({ symptomsText, age, gender }) => {
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      if (!symptomsText?.trim()) {
        throw new Error('Please describe your symptoms first.');
      }

      const triageResult = runMedicalTriage({ symptomsText, age, gender });
      setResult(triageResult);
      return triageResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Triage analysis failed.';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { analyze, reset, loading, result, error };
}
