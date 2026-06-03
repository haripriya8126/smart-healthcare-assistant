import { RISK_LEVELS } from '../triage/types.js';

/**
 * @param {import('../triage/types.js').TriageResult} result
 */
export function shouldShowNearbyHospitals(result) {
  return (
    result.riskLevel === RISK_LEVELS.MODERATE || result.riskLevel === RISK_LEVELS.HIGH
  );
}

/**
 * @param {number} [lat]
 * @param {number} [lng]
 * @returns {string}
 */
export function buildGoogleMapsHospitalsUrl(lat, lng) {
  if (typeof lat === 'number' && typeof lng === 'number' && !Number.isNaN(lat) && !Number.isNaN(lng)) {
    return `https://www.google.com/maps/search/hospitals/@${lat},${lng},14z`;
  }
  return 'https://www.google.com/maps/search/hospitals+near+me/';
}

/**
 * @returns {Promise<{ lat: number; lng: number }>}
 */
export function requestUserLocation() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported on this device.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        const messages = {
          1: 'Location access was denied. Opening a general hospital search in Maps.',
          2: 'Your location could not be determined. Opening a general hospital search.',
          3: 'Location request timed out. Opening a general hospital search.',
        };
        reject(new Error(messages[error.code] || 'Could not retrieve your location.'));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 120000,
      },
    );
  });
}

/**
 * Opens Google Maps hospital search using geolocation when available.
 * @returns {Promise<{ usedLocation: boolean; notice: string | null }>}
 */
export async function openNearbyHospitalsInMaps() {
  try {
    const { lat, lng } = await requestUserLocation();
    const url = buildGoogleMapsHospitalsUrl(lat, lng);
    window.open(url, '_blank', 'noopener,noreferrer');
    return { usedLocation: true, notice: null };
  } catch (err) {
    window.open(buildGoogleMapsHospitalsUrl(), '_blank', 'noopener,noreferrer');
    const notice = err instanceof Error ? err.message : 'Opened general hospital search.';
    return { usedLocation: false, notice };
  }
}
