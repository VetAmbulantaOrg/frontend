import React, { useState, useEffect, useContext } from "react";
import PatientsTable from "./patientsView.jsx";
import * as patientService from "../../services/patients.services.jsx";


export default function BooksPage() {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => { 
        patientService.getAllPatients()
         .then(res => { 
            setPatients(res || []); 
            console.log("Učitani pacijenti:", res);
        });

    }, [refresh]);

    const fetchPatients = async () => {
        try {
            const data = await patientService.getAllPatients()
            setPatients(data);
        } catch (error) {
            setError(`Greška pri učitavanju pacijenata: ${error}`);
            console.error(error);
        }
    };

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
            <h2>Svi Pacijenti</h2>
            {error && <p className="error">{error}</p>}
            <PatientsTable
              patients={patients}
              onDelete={deletePatients}
              triggerRefresh={() => setRefresh(prev => prev + 1)}
            />
        </div>
    );
}
