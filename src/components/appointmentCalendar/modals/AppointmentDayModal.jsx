import React from 'react';
import Modal from 'react-modal';
import '../styles/modal.scss';

Modal.setAppElement('#root');

export default function AppointmentDayModal({ isOpen, onClose, appointments, onSelectAppointment }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Pregledi za dan"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >

      {/* Dugme X u gornjem desnom uglu */}
      <button className="close-button" onClick={onClose}>
          ×
        </button>

      <h2>Pregledi za dan</h2>
      {appointments.length === 0 ? (
        <p>Nema pregleda.</p>
      ) : (
        <ul className="appointment-list">
          {appointments.map(app => (
            <li key={app.id}>
              <button onClick={() => onSelectAppointment(app)}>
                {app.start.toLocaleTimeString()} – {app.patient.name} ({app.patient.species}, {app.patient.age} god.)
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
