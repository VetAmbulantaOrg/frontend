import React, { useEffect, useState } from "react";
import * as specieService from "../../services/species.services.jsx";
import * as patientService from "../../services/patients.services.jsx";
import ContactHookForm from "./patientForm.jsx";
import { useNavigate } from "react-router-dom";

export default function CreateAnimalPage() {
  const navigate = useNavigate();
  const [speciesData, setSpeciesData] = useState([]);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await specieService.getAllSpecies();
        setSpeciesData(response || []);
        console.log("Učitane vrste:", response);
      } catch (err) {
        console.error("Greška pri dobavljanju vrsta zivotinja:", err);
      }
    };

    fetchSpecies();
  }, []);

  

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
    <div>
      <h2>Dodaj novog Pacijenta</h2>
      <ContactHookForm
        species={speciesData}
        onSubmit={(patient) => {
          console.log("Šaljem ka serveru:", patient);
          handleCreate(patient);
        }}
        onCancel={() => navigate("/patients")}
      />
    </div>
  );
}
