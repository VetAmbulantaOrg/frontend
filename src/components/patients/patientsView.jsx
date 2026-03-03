import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext.jsx";
import "./patients.scss";

export default function PatientsTable({ patients, page, pageSize, totalCount, onPageChange, onDelete }) {
  const navigate = useNavigate();
  const { isVet, isHelp } = useContext(AuthContext);

  const totalPages = Math.ceil(totalCount / pageSize);
  const canManage = isVet || isHelp;

  return (
    <div className="patients-wrapper">
      <button
        className="add-patient-button"
        onClick={() => navigate("/create-patient")}
      >
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
            {canManage && (
              <>
                <th>Izbriši</th>
                <th>Izmeni</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={canManage ? 7 : 5} className="no-data">
                Nema pacijenata
              </td>
            </tr>
          ) : (
            patients.map((patient) => renderRow(patient, canManage, navigate, onDelete))
          )}
        </tbody>
      </table>

      {renderPagination(page, totalPages, onPageChange)}
    </div>
  );
}

// Pomoćna funkcija za renderovanje reda
function renderRow(patient, canManage, navigate, onDelete) {
  return (
    <tr key={patient.id}>
      <td>{patient.name}</td>
      <td>{patient.species?.name}</td>
      <td>{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
      <td>{`${patient.owner?.name ?? ""} ${patient.owner?.surname ?? ""}`}</td>
      <td>{`${patient.vet?.name ?? ""} ${patient.vet?.surname ?? ""}`}</td>
      {canManage && (
        <>
          <td>
            <button onClick={() => onDelete(patient.id)}>Izbriši</button>
          </td>
          <td>
            <button onClick={() => navigate(`/edit-patient/${patient.id}`)}>Izmeni</button>
          </td>
        </>
      )}
    </tr>
  );
}

// Pomoćna funkcija za paginaciju
function renderPagination(page, totalPages, onPageChange) {
  return (
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
  );
}
