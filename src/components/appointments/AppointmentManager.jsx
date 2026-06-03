import { useAppointments } from '../../hooks/useAppointments.js';
import { useAppointmentReminders } from '../../hooks/useAppointmentReminders.js';
import {
  formatDisplayDateTime,
  formatRelativeTime,
  isUpcoming,
} from '../../appointments/utils.js';
import './appointments.css';

const SPECIALTY_SUGGESTIONS = [
  'General Practice',
  'Cardiology',
  'Pulmonology',
  'Neurology',
  'Dermatology',
  'Gastroenterology',
  'ENT',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Emergency Medicine',
];

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.calendarIcon]
 */
export function AppointmentManager({ calendarIcon }) {
  const {
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
    processReminders,
  } = useAppointments();

  useAppointmentReminders(processReminders, scheduled);

  const todayMin = new Date().toISOString().slice(0, 10);
  const nextAppt = upcoming[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await bookOrUpdate();
  };

  const handleCancel = (id, doctorName) => {
    if (window.confirm(`Cancel appointment with ${doctorName}?`)) {
      cancelAppointment(id);
    }
  };

  return (
    <section className="analyzer-section container" id="appointments">
      <div className="analyzer-title-group">
        <span className="hero-badge" style={{ marginBottom: '12px' }}>
          {calendarIcon}
          Care Scheduling
        </span>
        <h2 className="analyzer-section-title">Appointment Manager</h2>
        <p className="analyzer-section-subtitle">
          Book and manage clinical visits locally on your device. Reminders notify you 24 hours and
          1 hour before each upcoming appointment.
        </p>
      </div>

      <div
        className={`appt-notify-bar ${notificationPermission === 'granted' ? 'enabled' : ''}`}
      >
        {notificationPermission === 'granted' ? (
          <span>Reminders enabled — you will be notified 24 hours and 1 hour before each visit.</span>
        ) : notificationPermission === 'denied' ? (
          <span>
            Notifications are blocked. Enable them in your browser settings to receive appointment
            reminders.
          </span>
        ) : notificationPermission === 'unsupported' ? (
          <span>Browser notifications are not supported on this device.</span>
        ) : (
          <>
            <span>Enable reminders for 24-hour and 1-hour appointment alerts.</span>
            <button type="button" className="appt-notify-btn" onClick={enableNotifications}>
              Enable reminders
            </button>
          </>
        )}
      </div>

      <div className="appt-layout">
        <div className="analyzer-card appt-dashboard-card">
          <div className="appt-dashboard-header">
            <h3 className="appt-section-label" style={{ margin: 0 }}>
              Upcoming dashboard
            </h3>
            <span className="appt-count-badge">{upcoming.length} upcoming</span>
          </div>

          {upcoming.length === 0 ? (
            <div className="appt-empty-state">
              {calendarIcon}
              <h4 style={{ margin: '12px 0 0', color: 'var(--text-main)', fontSize: '15px' }}>
                No upcoming visits
              </h4>
              <p>Book an appointment using the form — your next visits will appear here.</p>
            </div>
          ) : (
            <div className="appt-upcoming-list">
              {upcoming.map((appt) => (
                <article
                  key={appt.id}
                  className={`appt-item ${nextAppt?.id === appt.id ? 'is-next' : ''}`}
                >
                  <div className="appt-item-header">
                    <h4 className="appt-doctor-name">{appt.doctorName}</h4>
                    <span className="appt-relative">{formatRelativeTime(appt)}</span>
                  </div>
                  <p className="appt-meta">{appt.specialty}</p>
                  <p className="appt-meta">{formatDisplayDateTime(appt)}</p>
                  {appt.notes && <p className="appt-notes-preview">{appt.notes}</p>}
                  <div className="appt-item-actions">
                    <button
                      type="button"
                      className="appt-action-btn edit"
                      onClick={() => startEdit(appt)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="appt-action-btn cancel"
                      onClick={() => handleCancel(appt.id, appt.doctorName)}
                    >
                      Cancel
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="analyzer-card">
          <h3 className="appt-section-label">
            {editingId ? 'Edit appointment' : 'Book appointment'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="appt-doctor">
                Doctor name
              </label>
              <input
                id="appt-doctor"
                className="input-field"
                placeholder="e.g. Dr. Sarah Chen"
                value={form.doctorName}
                onChange={(e) => updateFormField('doctorName', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="appt-specialty">
                Specialty
              </label>
              <input
                id="appt-specialty"
                className="input-field"
                list="appt-specialty-list"
                placeholder="e.g. Cardiology"
                value={form.specialty}
                onChange={(e) => updateFormField('specialty', e.target.value)}
                required
              />
              <datalist id="appt-specialty-list">
                {SPECIALTY_SUGGESTIONS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="appt-date">
                  Date
                </label>
                <input
                  id="appt-date"
                  type="date"
                  className="input-field"
                  min={todayMin}
                  value={form.date}
                  onChange={(e) => updateFormField('date', e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="appt-time">
                  Time
                </label>
                <input
                  id="appt-time"
                  type="time"
                  className="input-field"
                  value={form.time}
                  onChange={(e) => updateFormField('time', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="appt-notes">
                Notes (optional)
              </label>
              <textarea
                id="appt-notes"
                className="input-field"
                rows={3}
                placeholder="Symptoms to discuss, insurance info, fasting instructions..."
                value={form.notes}
                onChange={(e) => updateFormField('notes', e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>

            {formError && (
              <p className="appt-form-error" role="alert">
                {formError}
              </p>
            )}

            <div className="appt-form-actions">
              <button type="submit" className="btn btn-gradient" style={{ height: '44px' }}>
                {editingId ? 'Save changes' : 'Book appointment'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-glass"
                  style={{ height: '44px' }}
                  onClick={resetForm}
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {appointments.length > 0 && (
        <div className="analyzer-card appt-all-list">
          <h3 className="appt-section-label">All appointments</h3>
          <div className="appt-upcoming-list" style={{ maxHeight: 'none' }}>
            {[...appointments]
              .sort(
                (a, b) =>
                  new Date(`${b.date}T${b.time}`).getTime() -
                  new Date(`${a.date}T${a.time}`).getTime(),
              )
              .map((appt) => {
                const upcomingAppt = isUpcoming(appt);
                return (
                  <article
                    key={appt.id}
                    className={`appt-item ${appt.status === 'cancelled' ? 'appt-status-cancelled' : ''}`}
                  >
                    <div className="appt-item-header">
                      <h4 className="appt-doctor-name">{appt.doctorName}</h4>
                      <span className="appt-relative">
                        {appt.status === 'cancelled'
                          ? 'Cancelled'
                          : upcomingAppt
                            ? formatRelativeTime(appt)
                            : 'Past'}
                      </span>
                    </div>
                    <p className="appt-meta">{appt.specialty}</p>
                    <p className="appt-meta">{formatDisplayDateTime(appt)}</p>
                    {appt.notes && <p className="appt-notes-preview">{appt.notes}</p>}
                    {appt.status === 'scheduled' && (
                      <div className="appt-item-actions">
                        {upcomingAppt && (
                          <>
                            <button
                              type="button"
                              className="appt-action-btn edit"
                              onClick={() => startEdit(appt)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="appt-action-btn cancel"
                              onClick={() => handleCancel(appt.id, appt.doctorName)}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {!upcomingAppt && (
                          <button
                            type="button"
                            className="appt-action-btn cancel"
                            onClick={() => deleteAppointment(appt.id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
          </div>
        </div>
      )}
    </section>
  );
}
