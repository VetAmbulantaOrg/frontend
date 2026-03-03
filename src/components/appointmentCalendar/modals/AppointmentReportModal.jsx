import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import { AuthContext } from '../../../AuthContext.jsx';
import * as appointmentService from '../../../services/appointment.service.jsx';
import '../styles/modal.scss';

Modal.setAppElement('#root');

export default function SubmitReportModal({ isOpen, onClose, appointment }) {
  const [formData, setFormData] = useState({ weight: '', anamnesis: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (appointment?.report) {
      setFormData({
        weight: appointment.report.weight || '',
        anamnesis: appointment.report.anamnesis || '',
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const report = {
      appointmentId: appointment.id,
      weight: parseFloat(formData.weight),
      anamnesis: formData.anamnesis,
      vetId: user.Id,
    };

    try {
      if (appointment?.report) {
        await appointmentService.updateReport(report);
      } else {
        await appointmentService.submitReport(report);
      }
      window.location.reload();
      onClose();
    } catch (error) {
      console.error('Error submitting or updating report:', error);
      alert('An error occurred while submitting or updating the report.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Submit Report"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <button className="close-button" onClick={onClose}>×</button>
      <h2>{appointment?.report ? 'Edit Report' : 'Submit Report'}</h2>

      <div className="report-form">
        <div className="form-group">
          <label>Pet Weight (kg):</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label>Anamnesis:</label>
          <textarea
            name="anamnesis"
            value={formData.anamnesis}
            onChange={handleChange}
            rows="5"
          />
        </div>

        <div className="modal-actions">
          <button onClick={handleSubmit} className="submit">
            {appointment?.report ? 'Edit' : 'Submit'}
          </button>
          <button onClick={onClose} className="cancel">Cancel</button>
        </div>
      </div>
    </Modal>
  );
}