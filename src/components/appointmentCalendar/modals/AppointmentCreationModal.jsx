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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
  
    const newAppointment = {
      vetId,
      patientId: selectedPatient.value,
      startAt: new Date(startAt).toISOString(), // ISO 8601 format
      durationMinutes: parseInt(durationMinutes, 10),
      status: 0 // Scheduled
    };
  
    try {
      const response = await onCreate(newAppointment); 
      // axios vraća response.data ako je status 2xx
      console.log('Kreirani pregled:', response);
      alert("Pregled uspešno kreiran!");
      onClose();
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message || "Došlo je do greške.";
  
        if (status === 400) {
          alert("Neispravan zahtev: " + message);
        } else if (status === 409) {
          alert("Konflikt: " + message);
        } else if (status === 500) {
          alert("Greška na serveru: " + message);
        } else {
          alert(message);
        }
      } else {
        alert("Greška u komunikaciji sa serverom.");
      }
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

      {/* Dugme X u gornjem desnom uglu */}
      <button className="close-button" onClick={onClose}>
          ×
        </button>

        
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
        </div>
      </form>
    </Modal>
  );
}
