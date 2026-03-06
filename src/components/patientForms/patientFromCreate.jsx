import React, { useEffect, useState } from "react";
import * as speciesService from "../../services/species.services.jsx";
import * as patientService from "../../services/patients.services.jsx";
import ContactHookForm from "./patientForm.jsx";
import { useNavigate } from "react-router-dom";

export default function CreateAnimalPage() {
  const navigate = useNavigate();

  const [speciesData, setSpeciesData] = useState([]);
  const [error, setError] = useState(null);

  // Dohvatanje vrsta životinja
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await speciesService.getAllSpecies();
        setSpeciesData(response ?? []);
        setError(null);
      } catch (err) {
        console.error("Greška pri dobavljanju vrsta životinja:", err);
        setError("Nije moguće učitati vrste životinja.");
      }
    };

    fetchSpecies();
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
        onSubmit={handleCreate}
        onCancel={() => navigate("/patients")}
      />
    </div>
  );
}
