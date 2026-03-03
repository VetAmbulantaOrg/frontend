import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContactHookForm from "./patientForm.jsx";
import { AuthContext } from "../../AuthContext";
import * as speciesService from "../../services/species.services.jsx";
import * as patientService from "../../services/patients.services.jsx";
import * as userService from "../../services/user.services.jsx";

export default function EditAnimalPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState(null);
  const [speciesData, setSpeciesData] = useState([]);
  const [vetsData, setVetsData] = useState([]);
  const [error, setError] = useState(null);

  // Dohvatanje podataka
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, speciesRes, vetsRes] = await Promise.all([
          patientService.getPatientsById(id),
          speciesService.getAllSpecies(),
          userService.getAllVets(),
        ]);

        setPatientData(patientRes);
        setSpeciesData(speciesRes ?? []);
        setVetsData(vetsRes ?? []);
        setError(null);

        console.log("Učitan pacijent:", patientRes);
        console.log("Učitane vrste:", speciesRes);
        console.log("Učitani veterinari:", vetsRes);
      } catch (err) {
        console.error("Greška pri dobavljanju podataka:", err);
        setError("Nije moguće učitati podatke za izmenu pacijenta.");
      }
    };

    fetchData();
  }, [id]);

  // Ažuriranje pacijenta
  const handleUpdate = async (updatedPatient) => {
    try {
      await patientService.updatePatient(updatedPatient);
      navigate("/patients");
    } catch (err) {
      const serverMessage = err.response?.data || "Greška na serveru.";
      alert(`Izmena nije uspela: ${serverMessage}`);
      navigate("/patients");
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!patientData) return <p>Učitavanje...</p>;

  return (
    <div className="edit-animal-page">
      <h2>Izmeni pacijenta</h2>
      <ContactHookForm
        initialData={patientData}
        species={speciesData}
        vets={vetsData}
        user={user}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/patients")}
      />
    </div>
  );
}
