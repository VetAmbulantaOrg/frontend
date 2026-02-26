import React, { useState, useEffect, useContext } from 'react';
import './styles/appointments.scss'
import CalendarView from './CalendarView.jsx';
import AppointmentDayModal from './modals/AppointmentDayModal.jsx';
import AppointmentDetailModal from './modals/AppointmentDetailModal.jsx';
import CreateAppointmentModal from './modals/AppointmentCreationModal.jsx';
import CancelAppointmentModal from './modals/AppointmentCancelModal.jsx';
import * as appointmentService from '../../services/appointment.service.jsx';
import * as userService from '../../services/user.services.jsx';
import { AuthContext } from '../../AuthContext.jsx';

export default function AppointmentsPage() {
  const { role, user, isVet } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  
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
    if (!vetId) return;
  
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const fetchData = {
      vetId,
      year,
      month
    }
  
    appointmentService.getAppointmentsByMonth(fetchData)
      .then(data => {
        const mappedEvents = data.flatMap(day =>
          day.appointments.map(app => ({
            id: app.id,
            title: `${app.patient.name} (${app.patient.species})`,
            start: new Date(app.startAt),
            end: new Date(new Date(app.startAt).getTime() + app.durationMinutes * 60000),
            patient: app.patient,
            status: app.status,
            cancellationReason: app.cancellationReason
          }))
        );
        setEvents(mappedEvents);
      });
  }, [vetId, currentDate]);
  
  

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

  const openCancelModal = () => {
    setIsDetailModalOpen(false);
    setIsCancelModalOpen(true);
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

  const handleCancelAppointment = async (reason) => {
    const cancellationData = {
      AppointmentId: selectedAppointment.id,
      VetId: vetId,
      Reason: reason
    };
  
    try {
      await appointmentService.cancelAppointment(cancellationData);
      setIsCancelModalOpen(false);
  
      // osveži listu pregleda
      const data = await appointmentService.getAppointmentsByMonth(vetId);
      const mappedEvents = data.flatMap(day =>
        day.appointments.map(app => ({
          id: app.id,
          title: `${app.patient.name} (${app.patient.species})`,
          start: new Date(app.startAt),
          end: new Date(new Date(app.startAt).getTime() + app.durationMinutes * 60000),
          patient: app.patient,
          status: app.status,
          isCancelled: app.isCancelled,
          cancellationReason: app.cancellationReason
        }))
      );
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Greška pri otkazivanju pregleda:", error);
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
            onNavigate={(date) => setCurrentDate(date)}
            eventPropGetter={(event) => {
              let backgroundColor = "#3174ad"; // default plava

              switch (event.status) {
                case "Scheduled":
                  backgroundColor = "#28a745"; // zelena
                  break;
                case "Cancelled":
                  backgroundColor = "#6c757d"; // siva
                  break;
                case "Completed":
                  backgroundColor = "#007bff"; // plava
                  break;
              }

              return {
                style: {
                  backgroundColor,
                  color: "#fff",
                  borderRadius: "4px",
                  border: "none",
                  padding: "2px 4px"
                }
              };
            }}
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
            cancelAppointment={openCancelModal}
            isVet={isVet}
          />

          <CreateAppointmentModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            vetId={vetId}
            onCreate={handleCreateAppointment}
          />

          <CancelAppointmentModal
            isOpen={isCancelModalOpen} 
            onClose={() => setIsCancelModalOpen(false)}
            onConfirm={handleCancelAppointment}
          />


        </>
      )}
    </>
  );
}
