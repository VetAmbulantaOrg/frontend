import React from 'react';
import Modal from 'react-modal';
import '../styles/modal.scss';

Modal.setAppElement('#root');

export default function AppointmentDetailModal({ isOpen, onClose, appointment, isVet, cancelAppointment }) {
  if (!appointment) return null;
  console.log("Detalji pregleda:", appointment);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Detalji pregleda"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
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
            <p><strong>Razlog otkazivanja</strong> : {appointment.cancellationReason}</p>
          </div>
        )}
        {appointment.status === "Completed" && <p><strong>Status:</strong> Završeno</p>}

        <div className="modal-actions">
          <button onClick={onClose}>Zatvori</button>
          {isVet && appointment.status === "Scheduled" && (
          <button className="cancel" onClick={cancelAppointment}>
            Otkaži
          </button>
          )}
        </div>
      </div>

    </Modal>
  );
}
