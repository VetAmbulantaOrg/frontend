import React, { useState, useEffect } from "react";
import PatientsTable from "./patientsView.jsx";
import SearchBar from "./searchBar/searchBar.jsx";
import * as patientService from "../../services/patients.services.jsx";

export default function PatientsPage() {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);

    // Paginacija state
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    // Učitavanje pacijenata sa backend paginacijom
    const fetchPatients = async (searchParams = {}) => {
        try {
            const data = await patientService.searchPatients(searchParams, page, pageSize);
            setPatients(data.items || []);
            setTotalCount(data.totalCount || 0);
        } catch (error) {
            setError(`Greška pri učitavanju pacijenata: ${error}`);
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [page]); // svaki put kad se promeni stranica, povuci nove podatke

    const deletePatients = async (id) => {
        try {
            await patientService.deletePatient(id);
            fetchPatients();
        } catch (error) {
            setError(`Greška pri brisanju pacijenta: ${error}`);
            console.error(error);
        }
    };

    return (
        <div>
            <SearchBar 
                onSearch={(res) => {
                    setPatients(res.items || []);
                    setTotalCount(res.totalCount || 0);
                }} 
                triggerRefresh={() => fetchPatients()}
            />
            <h2 style={{ marginLeft: '2%'}}>Svi Pacijenti</h2>
            {error && <p className="error">{error}</p>}
            <PatientsTable
                patients={patients}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPage}
                onDelete={deletePatients}
            />
        </div>
    );
}
