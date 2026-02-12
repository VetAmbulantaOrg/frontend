import React from 'react';
import Modal from 'react-modal';
import '../styles/modal.scss';

Modal.setAppElement('#root');

export default function AppointmentDetailModal({ isOpen, onClose, appointment }) {
  if (!appointment) return null;

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
        <button onClick={onClose}>Zatvori</button>
      </div>
    </Modal>
  );
}
