import React, { useState } from 'react';
import Modal from 'react-modal';
import SubmitReportModal from './AppointmentReportModal.jsx'; // import modala za izveštaj
import '../styles/modal.scss';

Modal.setAppElement('#root');

export default function AppointmentDetailModal({ isOpen, onClose, appointment, isVet, cancelAppointment }) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  if (!appointment) return null;

  const isFutureAppointment = new Date(appointment.start) > new Date();
  const canCancel = isVet && appointment.status === "Scheduled" && isFutureAppointment;

  // pregled je prošao ako je start < sada i status je Scheduled
  const canSubmitReport = isVet && appointment.status === "Scheduled" && new Date(appointment.start) < new Date();

  const canUpdateReport = isVet && appointment.status === "Completed" && 
  new Date() <= new Date(appointment.end).setDate(new Date(appointment.end).getDate() + 3);

  console.log("Detalji pregleda:", appointment);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Detalji pregleda"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <button className="close-button" onClick={onClose}>×</button>

      <h2>Detalji pregleda</h2>
      <div className="appointment-detail">
        <p><strong>Pacijent:</strong> {appointment.patient.name}</p>
        <p><strong>Vrsta:</strong> {appointment.patient.species}</p>
        <p><strong>Starost:</strong> {appointment.patient.age} god.</p>
        <p><strong>Početak:</strong> {appointment.start.toLocaleString()}</p>

        {appointment.status === "Scheduled" && <p><strong>Status:</strong> Zakazano</p>}
        {appointment.status === "Cancelled" && (
          <div>
            <p><strong>Status:</strong> Otkazano</p>
            <p><strong>Razlog otkazivanja:</strong> {appointment.cancellationReason}</p>
          </div>
        )}
        {appointment.status === "Completed" && <p><strong>Status:</strong> Završeno</p>}

        <div className="modal-actions">
          {canCancel && (
            <button className="cancel" onClick={cancelAppointment}>
              Otkaži
            </button>
          )}

          {canSubmitReport && (
            <button className="submit-report" onClick={() => setIsReportModalOpen(true)}>
              Podnesi izveštaj
            </button>
          )}

          {canUpdateReport && (
            <button className="submit-report" onClick={() => setIsReportModalOpen(true)}>
              Izmeni izveštaj
            </button>
          )}
        </div>
      </div>

      {/* Ugnježdeni modal za podnošenje izveštaja */}
      <SubmitReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        appointment={appointment}
        vetId={appointment.vetId}
      />
    </Modal>
  );
}
