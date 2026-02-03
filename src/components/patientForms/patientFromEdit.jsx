import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContactHookForm from "./patientForm.jsx";
import * as specieService from "../../services/species.services.jsx";
import * as patientService from "../../services/patients.services.jsx";


export default function EditAnimalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [speciesData, setSpeciesData] = useState([]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await patientService.getPatientsById(id);
        setPatientData(response);

        console.log("Učitan pacijent:", response);
      } catch (err) {
        console.error("Greška pri dobavljanju pacijenta:", err);
      }
    };

   const fetchSpecies = async () => {
        try {
          const response = await specieService.getAllSpecies();
          setSpeciesData(response || []);
          console.log("Učitane vrste:", response);
        } catch (err) {
          console.error("Greška pri dobavljanju vrsta zivotinja:", err);
        }
      };
   
   
      fetchPatient();
      fetchSpecies();
  }, [id]);

  const handleUpdate = async (updatedAthlete) => {
    try {
      await patientService.updatePatient(updatedAthlete)
      navigate("/patients");
    } catch (err) {
      const serverMessage = err.response?.data?.message || "Greška na serveru.";
      alert(`Izmena nije uspela: ${serverMessage}`);
    }
  };

  if (!athleteData) return <p>Učitavanje...</p>;

  return (
    <div>
      <h2>Izmeni Pacijenta</h2>
      <ContactHookForm
        initialData={patientData}
        species={speciesData}
        onSubmitBook ={handleUpdate}
        onCancel={() => navigate("/patients")}
      />
    </div>
  );
}
