const APPOINTMENTS_KEY = 'smartassist-appointments';
const REMINDERS_KEY = 'smartassist-appointment-reminders';

/**
 * @typedef {Object} Appointment
 * @property {string} id
 * @property {string} doctorName
 * @property {string} specialty
 * @property {string} date - YYYY-MM-DD
 * @property {string} time - HH:mm
 * @property {string} notes
 * @property {'scheduled' | 'cancelled'} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @returns {Appointment[]}
 */
export function loadAppointments() {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * @param {Appointment[]} appointments
 */
export function saveAppointments(appointments) {
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
}

/**
 * @returns {Record<string, { h24?: boolean; h1?: boolean }>}
 */
export function loadReminderState() {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * @param {Record<string, { h24?: boolean; h1?: boolean }>} state
 */
export function saveReminderState(state) {
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(state));
}
