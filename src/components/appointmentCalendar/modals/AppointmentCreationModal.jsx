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

  // Učitaj pacijente samo za izabranog veterinara
  useEffect(() => {
    if (!vetId) return;
    patientService.getPatientsByVet(vetId)
      .then(data => {
        console.log('Dohvaćeni pacijenti:', data);
        const options = data.map(p => ({
          value: p.id,
          label: `${p.name} (${p.species.name}, ${p.owner.name} ${p.owner.surname})`
        }));
        setPatients(options);
      });
  }, [vetId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const newAppointment = {
      vetId,
      patientId: selectedPatient.value,
      startAt: new Date(startAt).toISOString(), // ISO 8601 format
      durationMinutes: parseInt(durationMinutes, 10),
      status: 0 // Scheduled
    };

    onCreate(newAppointment);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Novi pregled"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <h2>Kreiraj novi pregled</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <label>
          Pacijent:
          <Select
            options={patients}
            value={selectedPatient}
            onChange={setSelectedPatient}
            placeholder="Pretraži pacijente..."
            isSearchable
          />
        </label>
        <label>
          Početak pregleda:
          <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} required />
        </label>
        <label>
          Trajanje (min):
          <input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} required />
        </label>
        <div className="form-actions">
          <button type="submit">Sačuvaj</button>
          <button type="button" onClick={onClose}>Otkaži</button>
        </div>
      </form>
    </Modal>
  );
}
