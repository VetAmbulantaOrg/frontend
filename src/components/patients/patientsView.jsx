import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext.jsx";
import "./patients.scss";

const PatientsTable = ({ patients, onDelete, triggerRefresh }) => {
  const navigate = useNavigate();
  const { isVet, isHelp } = useContext(AuthContext);

  // Paginacija state
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5; // broj pacijenata po stranici

  // Izračunaj indekse
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

  const totalPages = Math.ceil(patients.length / patientsPerPage);

  return (
    <div className="patients-wrapper">
        <button className="add-patient-button" onClick={() => navigate("/create-patient")}>
          Dodaj novog pacijenta
        </button>
      <table className="patients-table">
        <thead>
          <tr>
            <th>Ime ljubimca</th>
            <th>Vrsta životinje</th>
            <th>Datum rođenja</th>
            <th>Vlasnik (korisničko ime)</th>
            {(isVet || isHelp) && (
              <>
                <th>Izbriši</th>
                <th>Izmeni</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {currentPatients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.petName}</td>
              <td>{patient.animalType}</td>
              <td>{patient.birthDate}</td>
              <td>{patient.ownerUserName}</td>
              {(isVet || isHelp) && (
                <>
                  <td>
                    <button
                      onClick={() => {
                        onDelete(patient.id);
                        triggerRefresh();
                      }}
                    >
                      Izbriši
                    </button>
                  </td>
                  <td>
                    <button onClick={() => navigate(`/edit-patient/${patient.id}`)}>
                      Izmeni
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginacija */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ← Prethodna
        </button>
        <span>
          Stranica {currentPage} od {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Sledeća →
        </button>
      </div>
    </div>
  );
};

export default PatientsTable;
