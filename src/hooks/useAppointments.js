import { useCallback, useEffect, useState } from 'react';
import {
  clearReminderFlags,
  processAppointmentReminders,
  requestNotificationPermission,
} from '../appointments/notifications.js';
import { loadAppointments, saveAppointments } from '../appointments/storage.js';
import {
  createAppointmentId,
  getUpcomingAppointments,
  validateAppointmentForm,
} from '../appointments/utils.js';

const EMPTY_FORM = {
  doctorName: '',
  specialty: '',
  date: '',
  time: '',
  notes: '',
};

/**
 * @param {typeof EMPTY_FORM} form
 */
function formToAppointmentPayload(form) {
  return {
    doctorName: form.doctorName.trim(),
    specialty: form.specialty.trim(),
    date: form.date,
    time: form.time,
    notes: form.notes.trim(),
  };
}

export function useAppointments() {
  const [appointments, setAppointments] = useState(() => loadAppointments());
  const [editingId, setEditingId] = useState(/** @type {string | null} */ (null));
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState(/** @type {string | null} */ (null));
  const [notificationPermission, setNotificationPermission] = useState(
    /** @type {NotificationPermission | 'unsupported'>} */ ('default'),
  );

  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported');
      return;
    }
    setNotificationPermission(Notification.permission);
  }, []);

  const upcoming = getUpcomingAppointments(appointments);
  const scheduled = appointments.filter((a) => a.status === 'scheduled');

  const resetForm = useCallback(() => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setFormError(null);
  }, []);

  const updateFormField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  }, []);

  const startEdit = useCallback((appointment) => {
    setEditingId(appointment.id);
    setForm({
      doctorName: appointment.doctorName,
      specialty: appointment.specialty,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes ?? '',
    });
    setFormError(null);
  }, []);

  const bookOrUpdate = useCallback(async () => {
    const validationError = validateAppointmentForm(form);
    if (validationError) {
      setFormError(validationError);
      return false;
    }

    const payload = formToAppointmentPayload(form);
    const now = new Date().toISOString();

    if (editingId) {
      clearReminderFlags(editingId);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, ...payload, updatedAt: now, status: 'scheduled' }
            : a,
        ),
      );
    } else {
      const newAppt = {
        id: createAppointmentId(),
        ...payload,
        status: /** @type {const} */ ('scheduled'),
        createdAt: now,
        updatedAt: now,
      };
      setAppointments((prev) => [...prev, newAppt]);
    }

    const perm = await requestNotificationPermission();
    if (perm !== 'unsupported') setNotificationPermission(perm);

    resetForm();
    return true;
  }, [form, editingId, resetForm]);

  const cancelAppointment = useCallback((id) => {
    clearReminderFlags(id);
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: /** @type {const} */ ('cancelled'), updatedAt: new Date().toISOString() }
          : a,
      ),
    );
    if (editingId === id) resetForm();
  }, [editingId, resetForm]);

  const deleteAppointment = useCallback((id) => {
    clearReminderFlags(id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    if (editingId === id) resetForm();
  }, [editingId, resetForm]);

  const enableNotifications = useCallback(async () => {
    const perm = await requestNotificationPermission();
    if (perm !== 'unsupported') setNotificationPermission(perm);
    return perm;
  }, []);

  return {
    appointments,
    upcoming,
    scheduled,
    form,
    formError,
    editingId,
    notificationPermission,
    updateFormField,
    bookOrUpdate,
    cancelAppointment,
    deleteAppointment,
    startEdit,
    resetForm,
    enableNotifications,
    processReminders: () => processAppointmentReminders(appointments),
  };
}
