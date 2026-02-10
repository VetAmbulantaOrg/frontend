import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext.jsx";
import "./patients.scss";

const PatientsTable = ({ patients, page, pageSize, totalCount, onPageChange, onDelete }) => {
  const navigate = useNavigate();
  const { isVet, isHelp } = useContext(AuthContext);

  const totalPages = Math.ceil(totalCount / pageSize);

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
            <th>Vlasnik</th>
            <th>Odabrani Veterinar</th>
            {(isVet || isHelp) && (
              <>
                <th>Izbriši</th>
                <th>Izmeni</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.species.name}</td>
              <td>{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
              <td>{patient.owner.name} {patient.owner.surname}</td>
              <td>{patient.vet?.name} {patient.vet?.surname}</td>
              {(isVet || isHelp) && (
                <>
                  <td>
                    <button
                      onClick={() => onDelete(patient.id)}
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
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          ← Prethodna
        </button>
        <span>
          Stranica {page} od {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Sledeća →
        </button>
      </div>
    </div>
  );
};

export default PatientsTable;
