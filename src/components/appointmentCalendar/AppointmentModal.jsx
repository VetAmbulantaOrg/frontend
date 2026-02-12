import React from 'react';
import Modal from 'react-modal';
import './styles/modal.scss';

Modal.setAppElement('#root'); // obavezno da bi se izbegle accessibility greške

export default function AppointmentModal({ isOpen, onClose, appointments }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Pregledi za dan"
      style={{
        content: { width: '500px', margin: 'auto', borderRadius: '8px' }
      }}
    >
      <h2>Pregledi za dan</h2>
      {appointments.length === 0 ? (
        <p>Nema pregleda.</p>
      ) : (
        <ul>
          {appointments.map(app => (
           <li key={app.id}> 
                {app.start.toLocaleTimeString()} – {app.patient.name} ({app.patient.species}, {app.patient.age} god.) 
           </li>
          ))}
        </ul>
      )}
      <button onClick={onClose}>Zatvori</button>
    </Modal>
  );
}
