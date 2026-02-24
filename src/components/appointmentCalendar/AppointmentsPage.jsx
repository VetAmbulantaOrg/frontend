import React, { useState, useEffect } from 'react';
import './styles/appointments.scss'
import CalendarView from './CalendarView.jsx';
import AppointmentDayModal from './modals/AppointmentDayModal.jsx';
import AppointmentDetailModal from './modals/AppointmentDetailModal.jsx';
import CreateAppointmentModal from './modals/AppointmentCreationModal.jsx';
import * as appointmentService from '../../services/appointment.service.jsx';
import * as userService from '../../services/user.services.jsx';

export default function AppointmentsPage() {
  const [events, setEvents] = useState([]);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  const [vets , setVets] = useState([]);
  const [vetId, setVetId] = useState(null);

 useEffect(() => {
    userService.getAllVets()
    .then(res => res)
    .then(data => {setVets(data);
    if (data.length > 0) {
    setVetId(data[0].id); // postavi prvog veterinara kao default
    }}); 
}, []);


useEffect(() => {
    if (!vetId) return; // ako nije izabran veterinar, ne šaljemo fetch
  
    appointmentService.getAppointmentsByMonth(vetId)
      .then(data => {
        console.log('Dohvaćeni podaci o terminima:', data);
        const mappedEvents = data.flatMap(day =>
          day.appointments.map(app => ({
            id: app.id,
            title: `${app.patient.name} (${app.patient.species})`,
            start: new Date(app.startAt),
            end: new Date(new Date(app.startAt).getTime() + app.durationMinutes * 60000),
            patient: app.patient
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
      // kreiraj pregled
      await appointmentService.createAppointment(appointment);
  
      // osveži listu pregleda nakon kreiranja
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
  
      // ako je sve prošlo u redu, vrati rezultat (možeš i samo true)
      return mappedEvents;
    } catch (error) {
      // propagiraj grešku dalje da je modal može uhvatiti u catch bloku
      throw error;
    }
  };
  
  
  

  return (
    <>
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

        <button className = "addAppointment"style={{ marginLeft: '20px' }} onClick={() => setIsCreateModalOpen(true)}>
          + Novi pregled
        </button>
      </div>

  
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
