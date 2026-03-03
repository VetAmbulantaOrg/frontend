import React, { useState, useEffect } from "react";
import PatientsTable from "./patientsView.jsx";
import SearchBar from "./searchBar/searchBar.jsx";
import * as patientService from "../../services/patients.services.jsx";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalCount, setTotalCount] = useState(0);

  // Centralizovana funkcija za dohvat pacijenata
  const fetchPatients = async (searchParams = {}) => {
    try {
      const data = await patientService.searchPatients(searchParams, page, pageSize);
      setPatients(data.items ?? []);
      setTotalCount(data.totalCount ?? 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(`Greška pri učitavanju pacijenata: ${err.message || err}`);
    }
  };

  // Učitavanje pacijenata kada se promeni stranica
  useEffect(() => {
    fetchPatients();
  }, [page]);

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
      />
      <h2 style={{ marginLeft: "2%" }}>Svi Pacijenti</h2>
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
