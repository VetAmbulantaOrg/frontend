import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import '../styles/modal.scss';
import * as patientService from '../../../services/patients.services.jsx';

Modal.setAppElement('#root');

export default function CreateAppointmentModal({ isOpen, onClose, vetId, onCreate }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [startAt, setStartAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);

  useEffect(() => {
    if (!vetId) return;

    const fetchPatients = async () => {
      try {
        const data = await patientService.getPatientsByVet(vetId);
        const options = data.map((p) => ({
          value: p.id,
          label: `${p.name} (${p.species.name}, ${p.owner.name} ${p.owner.surname})`,
        }));
        setPatients(options);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [vetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const newAppointment = {
      vetId,
      patientId: selectedPatient.value,
      startAt: new Date(startAt).toISOString(),
      durationMinutes: parseInt(durationMinutes, 10),
      status: 0, // Scheduled
    };

    try {
      const response = await onCreate(newAppointment);
      console.log('Appointment created:', response);
      alert('Pregled uspešno kreiran!');
      onClose();
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data.message || 'Došlo je do greške.';

      switch (status) {
        case 400:
          alert(`Neispravan zahtev: ${message}`);
          break;
        case 409:
          alert(`Konflikt: ${message}`);
          break;
        case 500:
          alert(`Greška na serveru: ${message}`);
          break;
        default:
          alert(message);
      }
    } else {
      alert('Greška u komunikaciji sa serverom.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Novi pregled"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <button className="close-button" onClick={onClose}>
        ×
      </button>
      <h2>Kreiraj novi pregled</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <FormField label="Pacijent:">
          <Select
            options={patients}
            value={selectedPatient}
            onChange={setSelectedPatient}
            placeholder="Pretraži pacijente..."
            isSearchable
          />
        </FormField>
        <FormField label="Početak pregleda:">
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Trajanje (min):">
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            required
          />
        </FormField>
        <div className="form-actions">
          <button type="submit">Sačuvaj</button>
        </div>
      </form>
    </Modal>
  );
}

function FormField({ label, children }) {
  return (
    <label>
      {label}
      {children}
    </label>
  );
}
