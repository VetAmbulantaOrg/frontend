import React, { useState, useEffect } from 'react';
import { AuthContext } from '../../../AuthContext.jsx';
import { useContext } from 'react';
import * as appointmentService from '../../../services/appointment.service.jsx';
import Modal from 'react-modal';
import '../styles/modal.scss';

Modal.setAppElement('#root');

export default function SubmitReportModal({ isOpen, onClose, appointment, vetId }) {
  const [weight, setWeight] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  const { user } = useContext(AuthContext);

  // Popunjavanje forme ako je reč o izmeni izveštaja
  useEffect(() => {
    if (appointment?.report) {
      setWeight(appointment.report.weight || '');
      setAnamnesis(appointment.report.anamnesis || '');
    }
  }, [appointment]);

  const handleSubmit = async () => {
    const report = {
      appointmentId: appointment.id,
      weight: parseFloat(weight),
      anamnesis: anamnesis,
      vetId: user.Id,
    };

    try {
      if (appointment?.report) {
        // Ako izveštaj već postoji, poziva se updateReport
        await appointmentService.updateReport(report);
      } else {
        // Ako izveštaj ne postoji, poziva se submitReport
        await appointmentService.submitReport(report);
      }
      window.location.reload();
      onClose(); // zatvara modal
    } catch (error) {
      console.error('Greška pri podnošenju ili izmeni izveštaja:', error);
      alert('Došlo je do greške pri podnošenju ili izmeni izveštaja.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Podnošenje izveštaja"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <button className="close-button" onClick={onClose}>×</button>
      <h2>{appointment?.report ? 'Izmeni izveštaj' : 'Podnesi izveštaj'}</h2>

      <div className="report-form">
        <div className="form-group">
          <label>Kilaža ljubimca (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label>Anamneza:</label>
          <textarea
            value={anamnesis}
            onChange={(e) => setAnamnesis(e.target.value)}
            rows="5"
          />
        </div>

        <div className="modal-actions">
          <button onClick={handleSubmit} className="submit">
            {appointment?.report ? 'Izmeni' : 'Podnesi'}
          </button>
          <button onClick={onClose} className="cancel">Otkaži</button>
        </div>
      </div>
    </Modal>
  );
}