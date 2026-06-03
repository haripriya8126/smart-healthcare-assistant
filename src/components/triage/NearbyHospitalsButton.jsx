import { useState } from 'react';
import { openNearbyHospitalsInMaps, shouldShowNearbyHospitals } from '../../lib/nearbyHospitals.js';
import './triage.css';

function HospitalIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M12 9h.01" />
    </svg>
  );
}

/**
 * @param {Object} props
 * @param {import('../../triage/types.js').TriageResult} props.result
 */
export function NearbyHospitalsButton({ result }) {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(/** @type {string | null} */ (null));

  if (!shouldShowNearbyHospitals(result)) {
    return null;
  }

  const handleFindHospitals = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const { notice: locationNotice } = await openNearbyHospitalsInMaps();
      if (locationNotice) setNotice(locationNotice);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nearby-hospitals-block">
      <button
        type="button"
        className="nearby-hospitals-btn"
        onClick={handleFindHospitals}
        disabled={loading}
        aria-busy={loading}
      >
        <HospitalIcon />
        {loading ? 'Locating…' : 'Find Nearby Hospitals'}
      </button>
      <p className="nearby-hospitals-hint">
        Uses your device location to open Google Maps with hospitals near you. Opens in a new tab.
      </p>
      {notice && (
        <p className="nearby-hospitals-notice" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
