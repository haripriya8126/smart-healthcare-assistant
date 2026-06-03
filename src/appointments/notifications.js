import { loadReminderState, saveReminderState } from './storage.js';
import { getAppointmentDateTime, isUpcoming } from './utils.js';

const REMINDER_WINDOWS_MS = 5 * 60 * 1000;

/**
 * @returns {Promise<NotificationPermission | 'unsupported'>}
 */
export async function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
}

/**
 * @param {import('./storage.js').Appointment} appointment
 * @param {'h24' | 'h1'} type
 */
function buildNotificationContent(appointment, type) {
  const when = formatDisplayShort(appointment);
  const doctor = appointment.doctorName;
  const specialty = appointment.specialty;

  if (type === 'h24') {
    return {
      title: 'Appointment tomorrow',
      body: `Reminder: ${doctor} (${specialty}) — ${when}.`,
      tag: `${appointment.id}-24h`,
    };
  }
  return {
    title: 'Appointment in 1 hour',
    body: `${doctor} (${specialty}) at ${when}. Please prepare to leave soon.`,
    tag: `${appointment.id}-1h`,
  };
}

/**
 * @param {import('./storage.js').Appointment} appointment
 */
function formatDisplayShort(appointment) {
  return getAppointmentDateTime(appointment).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * @param {number} appointmentMs
 * @param {number} offsetMs
 * @param {number} now
 */
function isInReminderWindow(appointmentMs, offsetMs, now) {
  const triggerAt = appointmentMs - offsetMs;
  return now >= triggerAt && now < triggerAt + REMINDER_WINDOWS_MS;
}

/**
 * Checks all appointments and fires browser notifications when due.
 * @param {import('./storage.js').Appointment[]} appointments
 */
export function processAppointmentReminders(appointments) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const now = Date.now();
  const fired = loadReminderState();
  let changed = false;

  for (const appointment of appointments) {
    if (!isUpcoming(appointment)) continue;

    const apptMs = getAppointmentDateTime(appointment).getTime();
    const entry = fired[appointment.id] ?? {};

    const checks = [
      { key: 'h24', offset: 24 * 60 * 60 * 1000 },
      { key: 'h1', offset: 60 * 60 * 1000 },
    ];

    for (const { key, offset } of checks) {
      if (entry[key]) continue;
      if (!isInReminderWindow(apptMs, offset, now)) continue;

      const content = buildNotificationContent(appointment, key);
      try {
        new Notification(content.title, {
          body: content.body,
          tag: content.tag,
          icon: '/favicon.svg',
        });
        entry[key] = true;
        changed = true;
      } catch {
        /* ignore */
      }
    }

    fired[appointment.id] = entry;
  }

  if (changed) saveReminderState(fired);
}

/**
 * Clears reminder flags for an appointment (e.g. after cancel or reschedule).
 * @param {string} appointmentId
 */
export function clearReminderFlags(appointmentId) {
  const fired = loadReminderState();
  if (fired[appointmentId]) {
    delete fired[appointmentId];
    saveReminderState(fired);
  }
}
