import { useEffect } from 'react';

/**
 * Polls for 24h and 1h appointment reminders while the app is open.
 * @param {() => void} processReminders
 * @param {import('../appointments/storage.js').Appointment[]} appointments
 */
export function useAppointmentReminders(processReminders, appointments) {
  useEffect(() => {
    processReminders();

    const intervalId = window.setInterval(processReminders, 30_000);

    const onVisible = () => {
      if (document.visibilityState === 'visible') processReminders();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [processReminders, appointments]);
}
