import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/modal.scss';

Modal.setAppElement('#root');

export default function CancelAppointmentModal({ isOpen, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Otkaži pregled"
      className="ReactModal__Content_cancel"
      overlayClassName="ReactModal__Overlay_cancel"
    >
      <h2>Otkaži pregled</h2>
      <div className="modal-body">
        <label>
          Razlog otkazivanja:
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ width: "100%", marginTop: "10px" }}
          />
        </label>
      </div>

      <div className="modal-actions">
        <button onClick={onClose}>Odustani</button>
        <button className="confirm" onClick={() => onConfirm(reason)}>Potvrdi</button>
      </div>
    </Modal>
  );
}
