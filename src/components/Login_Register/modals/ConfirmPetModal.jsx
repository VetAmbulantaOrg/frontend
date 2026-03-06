import React from "react";
import Modal from "react-modal";
import "../../appointmentCalendar/styles/modal.scss";

Modal.setAppElement("#root");

export default function ConfirmPetModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Potvrda registracije ljubimca"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      {/* Dugme X u gornjem desnom uglu */}
      <button className="close-button" onClick={onClose}>
        ×
      </button>

      <h2>Da li želite odmah da registrujete novog ljubimca za ovog vlasnika?</h2>

      <div className="modal-actions">
        <button onClick={onConfirm}>Da</button>
        <button onClick={onClose}>Ne</button>
      </div>
    </Modal>
  );
}
