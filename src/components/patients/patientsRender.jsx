import React, { useState, useEffect, useContext } from "react";
import PatientsTable from "./patientsView.jsx";
import SearchBar from "./searchBar/searchBar.jsx";
import * as patientService from "../../services/patients.services.jsx";
import { AuthContext } from "../../AuthContext.jsx";

export default function PatientsPage() {
  const { isVet, user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalCount, setTotalCount] = useState(0);

  // Centralizovana funkcija za dohvat pacijenata
  const fetchPatients = async (searchParams = {}) => {
    try {
      if (isVet && user?.Id) {
        const data = await patientService.getPatientsByVet(user.Id);
        const items = Array.isArray(data) ? data : (data.items ?? []);
        setPatients(items);
        setTotalCount(Array.isArray(data) ? data.length : (data.totalCount ?? items.length));
      } else {
        const data = await patientService.searchPatients(searchParams, page, pageSize);
        setPatients(data.items ?? []);
        setTotalCount(data.totalCount ?? 0);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError(`Greška pri učitavanju pacijenata: ${err.message || err}`);
    }
  };

  // Učitavanje pacijenata kada se promeni stranica
  useEffect(() => {
    fetchPatients();
  }, [page, isVet]);

  // Brisanje pacijenta
  const deletePatient = async (id) => {
    try {
      await patientService.deletePatient(id);
      fetchPatients();
    } catch (err) {
      console.error(err);
      setError(`Greška pri brisanju pacijenta: ${err.message || err}`);
    }
  };

  // Rukovanje pretragom
  const handleSearch = (res) => {
    setPatients(res.items ?? []);
    setTotalCount(res.totalCount ?? 0);
  };

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        triggerRefresh={fetchPatients}
        vetId={isVet ? user?.Id : null}
      />
      <h2 style={{ marginLeft: "2%" }}>{isVet ? "Moji Pacijenti" : "Svi Pacijenti"}</h2>
      {error && <p className="error">{error}</p>}
      <PatientsTable
        patients={patients}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onDelete={deletePatient}
      />
    </div>
  );
}
