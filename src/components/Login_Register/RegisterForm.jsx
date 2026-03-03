import React, { useState, useEffect } from "react";
import "./login_register.scss";
import * as authService from "../../services/auth.services.jsx";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  const [feedback, setFeedback] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const { username, password, confirmPassword, email, firstName, lastName } = formData;
    const valid =
      username.trim().length > 2 &&
      password.length >= 8 &&
      password === confirmPassword &&
      email.trim().length > 5 &&
      firstName.trim().length > 1 &&
      lastName.trim().length > 1;

    setIsValid(valid);
    setFeedback(
      valid
        ? "Podaci su validni. Možete nastaviti."
        : "Molimo vas da ispravno popunite sva polja."
    );
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const { username, password, email, firstName, lastName } = formData;
    const payload = {
      userName: username,
      password,
      email,
      name: firstName,
      surname: lastName,
    };

    try {
      await authService.createUser(payload);
      alert("Registracija uspešna! Možete se prijaviti.");
      navigate("/login");
    } catch (error) {
      const backendErrors = error?.response?.data;
      const messages = Array.isArray(backendErrors)
        ? backendErrors.map(
            (err) => err.description || err.message || "Greška u registraciji."
          )
        : [error.message || "Došlo je do greške."];
      setErrors(messages);
      console.error("Register error:", error);
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
    <form className="forma" onSubmit={handleSubmit}>
      <section className="form-section">
        <h2>👤 Lični podaci</h2>
        {renderInput("text", "username", "Korisničko ime")}
        {renderInput("email", "email", "Email adresa")}
        {renderInput("text", "firstName", "Ime")}
        {renderInput("text", "lastName", "Prezime")}
      </section>

      <section className="form-section">
        <h2>🔒 Bezbednost</h2>
        {renderInput("password", "password", "Lozinka")}
        {renderInput("password", "confirmPassword", "Potvrdi lozinku")}
      </section>

      <section className="form-section">
        <button type="submit" disabled={!isValid}>
          Registruj se
        </button>
      </section>

      <div
        style={{
          marginTop: "1rem",
          fontWeight: "bold",
          color: isValid ? "green" : "red",
        }}
      >
        {feedback}
      </div>

      {errors.length > 0 && (
        <div style={{ marginTop: "1rem", color: "red", fontWeight: "bold" }}>
          <h4>Greške:</h4>
          <ul>
            {errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default RegisterForm;
