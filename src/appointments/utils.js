/**
 * @typedef {import('./storage.js').Appointment} Appointment
 */

/**
 * @param {Appointment} appointment
 */
export function getAppointmentDateTime(appointment) {
  return new Date(`${appointment.date}T${appointment.time}`);
}

/**
 * @param {Appointment} appointment
 */
export function isScheduled(appointment) {
  return appointment.status === 'scheduled';
}

/**
 * @param {Appointment} appointment
 */
export function isUpcoming(appointment) {
  if (!isScheduled(appointment)) return false;
  return getAppointmentDateTime(appointment).getTime() > Date.now();
}

/**
 * @param {Appointment[]} appointments
 */
export function getUpcomingAppointments(appointments) {
  return appointments
    .filter(isUpcoming)
    .sort(
      (a, b) =>
        getAppointmentDateTime(a).getTime() - getAppointmentDateTime(b).getTime(),
    );
}

/**
 * @param {Appointment} appointment
 */
export function formatRelativeTime(appointment) {
  const diffMs = getAppointmentDateTime(appointment).getTime() - Date.now();
  if (diffMs <= 0) return 'Starting soon';

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return `In ${days} day${days === 1 ? '' : 's'}`;
  }
  if (hours >= 1) {
    return `In ${hours} hour${hours === 1 ? '' : 's'}`;
  }
  const minutes = Math.floor(diffMs / (1000 * 60));
  return `In ${Math.max(minutes, 1)} min`;
}

/**
 * @param {Appointment} appointment
 */
export function formatDisplayDateTime(appointment) {
  const dt = getAppointmentDateTime(appointment);
  return dt.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * @returns {string}
 */
export function createAppointmentId() {
  return `appt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * @param {Object} form
 */
export function validateAppointmentForm(form) {
  if (!form.doctorName?.trim()) return 'Doctor name is required.';
  if (!form.specialty?.trim()) return 'Specialty is required.';
  if (!form.date) return 'Appointment date is required.';
  if (!form.time) return 'Appointment time is required.';

  const dt = new Date(`${form.date}T${form.time}`);
  if (Number.isNaN(dt.getTime())) return 'Invalid date or time.';
  if (dt.getTime() <= Date.now()) {
    return 'Please choose a future date and time.';
  }
  return null;
}
