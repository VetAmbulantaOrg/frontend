import React from 'react';
import Modal from 'react-modal';
import './styles/modal.scss';

Modal.setAppElement('#root'); // Required to avoid accessibility issues

const modalStyles = {
  content: {
    width: '500px',
    margin: 'auto',
    borderRadius: '8px',
  },
};

export default function AppointmentModal({ isOpen, onClose, appointments = [] }) {
  const renderAppointments = () => {
    if (appointments.length === 0) {
      return <p>Nema pregleda.</p>;
    }

    return (
      <ul>
        {appointments.map(({ id, start, patient }) => (
          <li key={id}>
            {start.toLocaleTimeString()} – {patient.name} ({patient.species}, {patient.age} god.)
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Pregledi za dan"
      style={modalStyles}
    >
      <h2>Pregledi za dan</h2>
      {renderAppointments()}
      <button onClick={onClose}>Zatvori</button>
    </Modal>
  );
}
