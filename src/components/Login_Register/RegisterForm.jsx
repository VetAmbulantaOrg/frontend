import React, { useState, useEffect } from "react";
import "./login_register.scss";
import * as userService from "../../services/user.services.jsx";
import { useNavigate } from "react-router-dom";
import ConfirmPetModal from "./modals/ConfirmPetModal.jsx";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    adress: "",
    phoneNumber: "",
  });

  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState([]); // <<< dodato za prikaz grešaka

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const { name, surname, adress, phoneNumber } = formData;
    const valid =
      name.trim().length > 1 &&
      surname.trim().length > 1 &&
      adress.trim().length > 5 &&
      phoneNumber.trim().length >= 6;

    setIsValid(valid);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]); // očisti stare greške

    const { name, surname, adress, phoneNumber } = formData;
    const payload = { name, surname, adress, phoneNumber };

    try {
      await userService.createOwner(payload);
      setShowModal(true);
    } catch (error) {
      const backendErrors = error?.response?.data;
      const messages = Array.isArray(backendErrors)
        ? backendErrors.map(
            (err) => err.description || err.message || "Greška u registraciji."
          )
        : [error.message || "Došlo je do greške."];

      console.error("Register error:", error);
      setErrors(messages); // <<< prikaži poruke korisniku
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (type, name, placeholder) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={formData[name]}
      onChange={handleInputChange}
      required
    />
  );

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;

  return (
    <>
      <form className="forma" onSubmit={handleSubmit}>
        <section className="form-section">
          <h2>👤 Podaci o vlasniku</h2>

          {/* prikaz grešaka */}
          {errors.length > 0 && (
            <ul className="error-list">
              {errors.map((msg, idx) => (
                <li key={idx} className="error">{msg}</li>
              ))}
            </ul>
          )}

          {renderInput("text", "name", "Ime")}
          {renderInput("text", "surname", "Prezime")}
          {renderInput("text", "adress", "Adresa")}
          {renderInput("text", "phoneNumber", "Broj Telefona")}
        </section>

        <section className="form-section">
          <button type="submit" disabled={!isValid}>
            Registruj vlasnika
          </button>
        </section>
      </form>

      <ConfirmPetModal
        isOpen={showModal}
        onClose={() => navigate("/patients")}
        onConfirm={() =>
          navigate("/create-patient", {
            state: { ownerUsername: formData.name + " " + formData.surname },
          })
        }
      />
    </>
  );
};

export default RegisterForm;
