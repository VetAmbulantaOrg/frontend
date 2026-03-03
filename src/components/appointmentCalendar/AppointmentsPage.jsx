import React, { useState, useEffect, useContext } from 'react';
import './styles/appointments.scss';
import CalendarView from './CalendarView.jsx';
import AppointmentDayModal from './modals/AppointmentDayModal.jsx';
import AppointmentDetailModal from './modals/AppointmentDetailModal.jsx';
import CreateAppointmentModal from './modals/AppointmentCreationModal.jsx';
import CancelAppointmentModal from './modals/AppointmentCancelModal.jsx';
import SubmitReportModal from './modals/AppointmentReportModal.jsx';
import * as appointmentService from '../../services/appointment.service.jsx';
import * as userService from '../../services/user.services.jsx';
import { AuthContext } from '../../AuthContext.jsx';

export default function AppointmentsPage() {
  const { role, user, isVet } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [modals, setModals] = useState({
    day: false,
    detail: false,
    create: false,
    cancel: false,
    report: false,
  });
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [vets, setVets] = useState([]);
  const [vetId, setVetId] = useState(null);

  useEffect(() => {
    if (role === 'Veterinar' && user?.id) {
      setVetId(user.id);
    } else {
      fetchVets();
    }
  }, [role, user]);

  useEffect(() => {
    if (vetId) fetchAppointments();
  }, [vetId, currentDate]);

  const fetchVets = async () => {
    try {
      const data = await userService.getAllVets();
      setVets(data);
      if (data.length > 0) setVetId(data[0].id);
    } catch (error) {
      console.error('Error fetching vets:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const data = await appointmentService.getAppointmentsByMonth({ vetId, year, month });
      setEvents(mapAppointmentsToEvents(data));
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const mapAppointmentsToEvents = (data) =>
    data.flatMap((day) =>
      day.appointments.map((app) => ({
        id: app.id,
        title: `${app.patient.name} (${app.patient.species})`,
        start: new Date(app.startAt),
        end: new Date(new Date(app.startAt).getTime() + app.durationMinutes * 60000),
        patient: app.patient,
        status: app.status,
        report: app.report,
        cancellationReason: app.cancellationReason,
      }))
    );

  const handleDayClick = (date) => {
    const dayAppointments = events.filter((e) => e.start.toDateString() === date.toDateString());
    setSelectedAppointments(dayAppointments);
    toggleModal('day', true);
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    toggleModal('day', false);
    toggleModal('detail', true);
  };

  const handleCreateAppointment = async (appointment) => {
    try {
      await appointmentService.createAppointment(appointment);
      window.location.reload();
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const handleCancelAppointment = async (reason) => {
    try {
      await appointmentService.cancelAppointment({
        AppointmentId: selectedAppointment.id,
        VetId: vetId,
        Reason: reason,
      });
      toggleModal('cancel', false);
      fetchAppointments();
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  const toggleModal = (modal, isOpen) => {
    setModals((prev) => ({ ...prev, [modal]: isOpen }));
  };

  const renderVetDropdown = () => (
    <div style={{ marginBottom: '20px' }}>
      <label>Veterinar: </label>
      <select
        value={vetId ?? ''}
        onChange={(e) => setVetId(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">-- Izaberi veterinara --</option>
        {vets.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name} {v.surname}
          </option>
        ))}
      </select>
      <button
        className="addAppointment"
        style={{ marginLeft: '20px' }}
        onClick={() => toggleModal('create', true)}
      >
        + Novi pregled
      </button>
    </div>
  );

  const renderVetHeader = () => (
    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ marginBottom: '10px' }}>
        Pregledi za veterinara {user.Name} {user.Surname}
      </h2>
      <button
        className="addAppointment"
        style={{ marginTop: '10px' }}
        onClick={() => toggleModal('create', true)}
      >
        + Novi pregled
      </button>
    </div>
  );

  return (
    <>
      {role !== 'Veterinar' && renderVetDropdown()}
      {role === 'Veterinar' && user && renderVetHeader()}

      {vetId && (
        <>
          <CalendarView
            events={events}
            onDayClick={handleDayClick}
            onEventClick={handleSelectAppointment}
            onNavigate={setCurrentDate}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: getEventBackgroundColor(event.status),
                color: '#fff',
                borderRadius: '4px',
                border: 'none',
                padding: '2px 4px',
              },
            })}
          />

          <AppointmentDayModal
            isOpen={modals.day}
            onClose={() => toggleModal('day', false)}
            appointments={selectedAppointments}
            onSelectAppointment={handleSelectAppointment}
          />

          <AppointmentDetailModal
            isOpen={modals.detail}
            onClose={() => toggleModal('detail', false)}
            appointment={selectedAppointment}
            cancelAppointment={() => toggleModal('cancel', true)}
            isVet={isVet}
          />

          <CreateAppointmentModal
            isOpen={modals.create}
            onClose={() => toggleModal('create', false)}
            vetId={vetId}
            onCreate={handleCreateAppointment}
          />

          <CancelAppointmentModal
            isOpen={modals.cancel}
            onClose={() => toggleModal('cancel', false)}
            onConfirm={handleCancelAppointment}
          />

          <SubmitReportModal
            isOpen={modals.report}
            onClose={() => toggleModal('report', false)}
            appointment={selectedAppointment}
            vetId={vetId}
          />
        </>
      )}
    </>
  );
}

const getEventBackgroundColor = (status) => {
  switch (status) {
    case 'Scheduled':
      return '#28a745'; // green
    case 'Cancelled':
      return '#6c757d'; // gray
    case 'Completed':
      return '#007bff'; // blue
    default:
      return '#3174ad'; // default blue
  }
};
