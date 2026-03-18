import React, { useEffect, useState } from "react";
import * as speciesService from "../../services/species.services.jsx";
import * as patientService from "../../services/patients.services.jsx";
import * as userService from "../../services/user.services.jsx";
import ContactHookForm from "./patientForm.jsx";
import { useNavigate } from "react-router-dom";

export default function CreateAnimalPage() {
  const navigate = useNavigate();

  const [speciesData, setSpeciesData] = useState([]);
  const [vetsData, setVetsData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speciesRes, vetsRes] = await Promise.all([
          speciesService.getAllSpecies(),
          userService.getAllVets(),
        ]);
        setSpeciesData(speciesRes ?? []);
        setVetsData(vetsRes ?? []);
        setError(null);
      } catch (err) {
        console.error("Greška pri dobavljanju podataka:", err);
        setError("Nije moguće učitati podatke za izmenu pacijenta.");
      }
    };

    fetchData();
  }, []);

  // Kreiranje pacijenta
  const handleCreate = async (patient) => {
    try {
      await patientService.createPatient(patient);
      navigate("/patients");
    } catch (err) {
      const serverMessage = err.response?.data?.message || "Dodavanje nije uspelo.";
      alert(serverMessage);
    }
  };

  return (
    <div className="create-animal-page">
      <h2>Dodaj novog pacijenta</h2>
      {error && <p className="error">{error}</p>}
      <ContactHookForm
        species={speciesData}
        vets={vetsData}
        onSubmit={handleCreate}
        onCancel={() => navigate("/patients")}
      />
    </div>
  );
}
