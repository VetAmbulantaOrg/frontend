import React, { useState, useEffect, useContext } from "react";
import "./login_register.scss";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import * as authService from "../../services/auth.services.jsx";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [feedback, setFeedback] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { username, password } = formData;

  useEffect(() => {
    const valid = username.trim().length > 2 && password.length >= 8;
    setIsValid(valid);
    setFeedback(
      valid
        ? "Podaci su validni. Možete se prijaviti."
        : "Molimo vas da unesete ispravno korisničko ime i lozinku."
    );
  }, [username, password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const myToken = await authService.login({ username, password });
      sessionStorage.setItem("token", myToken);
      login(myToken);
      alert(`Dobrodošao, ${username}!`);
      navigate("/patients");
    } catch (error) {
      alert("Neispravno korisničko ime ili lozinka.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="forma" onSubmit={handleSubmit}>
      <section className="form-section">
        <h2>🔐 Prijava</h2>
        <input
          type="text"
          name="username"
          placeholder="Korisničko ime"
          value={username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Lozinka"
          value={password}
          onChange={handleChange}
          required
        />
      </section>

      <section className="form-section">
        <button type="submit" disabled={!isValid || loading}>
          {loading ? "Prijavljivanje..." : "Prijavi se"}
        </button>
      </section>
    </form>
  );
};

export default LoginForm;
