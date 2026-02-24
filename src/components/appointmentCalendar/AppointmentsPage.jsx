import React, { useState, useEffect, useContext } from 'react';
import './styles/appointments.scss'
import CalendarView from './CalendarView.jsx';
import AppointmentDayModal from './modals/AppointmentDayModal.jsx';
import AppointmentDetailModal from './modals/AppointmentDetailModal.jsx';
import CreateAppointmentModal from './modals/AppointmentCreationModal.jsx';
import * as appointmentService from '../../services/appointment.service.jsx';
import * as userService from '../../services/user.services.jsx';
import { AuthContext } from '../../AuthContext.jsx';

export default function AppointmentsPage() {
  const { role, user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  const [vets , setVets] = useState([]);
  const [vetId, setVetId] = useState(null);

  // Ako je veterinar ulogovan, odmah postavi njegov ID
  useEffect(() => {
    if (role === "Veterinar" && user?.id) {
      setVetId(user.id);
    } else {
      userService.getAllVets()
        .then(res => res)
        .then(data => {
          setVets(data);
          if (data.length > 0) {
            setVetId(data[0].id); // default prvi veterinar
          }
        }); 
    }
  }, [role, user]);

  useEffect(() => {
    if (!vetId) return; // ako nije izabran veterinar, ne šaljemo fetch
  
    appointmentService.getAppointmentsByMonth(vetId)
      .then(data => {
        const mappedEvents = data.flatMap(day =>
          day.appointments.map(app => ({
            id: app.id,
            title: `${app.patient.name} (${app.patient.species})`,
            start: new Date(app.startAt),
            end: new Date(new Date(app.startAt).getTime() + app.durationMinutes * 60000),
            patient: app.patient,
            status: app.status
          }))
        );
        setEvents(mappedEvents);
      });
  }, [vetId]);
  

  const handleDayClick = (date) => {
    const dayAppointments = events.filter(e => e.start.toDateString() === date.toDateString());
    setSelectedAppointments(dayAppointments);
    setIsDayModalOpen(true);
  };
  
  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDayModalOpen(false);
    setIsDetailModalOpen(true);
  };

  const handleCreateAppointment = async (appointment) => {
    try {
      await appointmentService.createAppointment(appointment);
      const data = await appointmentService.getAppointmentsByMonth(vetId);
      const mappedEvents = data.flatMap(day =>
        day.appointments.map(app => ({
          id: app.id,
          title: `${app.patient.name} (${app.patient.species})`,
          start: new Date(app.startAt),
          end: new Date(new Date(app.startAt).getTime() + app.durationMinutes * 60000),
          patient: app.patient,
          status: app.status
        }))
      );
      setEvents(mappedEvents);
      return mappedEvents;
    } catch (error) {
      throw error;
    }
  };
  
  return (
    <>
      {/* Dropdown se prikazuje samo ako nije Veterinar */}
      {role !== "Veterinar" && (
      <div style={{ marginBottom: '20px' }}>
        <label>Veterinar: </label>
        <select value={vetId ?? ''} onChange={(e) => { 
          const value = e.target.value;
          setVetId(value ? Number(value) : null);
        }}>
          <option value="">-- Izaberi veterinara --</option>
          {vets.map(v => (
            <option key={v.id} value={v.id}>{v.name} {v.surname}</option>
          ))}
        </select>

        <button className="addAppointment" style={{ marginLeft: '20px' }} onClick={() => setIsCreateModalOpen(true)}>
        + Novi pregled
        </button>
      </div>
    )}

     {/* Ako je veterinar ulogovan, prikaži naslov i dugme jedno ispod drugog */}
      {role === "Veterinar" && user && (
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ marginBottom: '10px' }}>
            Pregledi za veterinara {user.Name} {user.Surname}
          </h2>

          <button 
            className="addAppointment" 
            style={{ marginTop: '10px' }} 
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Novi pregled
          </button>
        </div>
      )}


      {vetId && (
        <>
          <CalendarView
            events={events}
            onDayClick={handleDayClick}
            onEventClick={handleSelectAppointment}
          />
          <AppointmentDayModal
            isOpen={isDayModalOpen}
            onClose={() => setIsDayModalOpen(false)}
            appointments={selectedAppointments}
            onSelectAppointment={handleSelectAppointment}
          />

          <AppointmentDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            appointment={selectedAppointment}
          />

          <CreateAppointmentModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            vetId={vetId}
            onCreate={handleCreateAppointment}
          />
        </>
      )}
    </>
  );
}
