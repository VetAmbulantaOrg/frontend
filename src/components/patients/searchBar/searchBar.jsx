import React, { useState, useEffect } from "react";
import * as speciesService from "../../../services/species.services.jsx";
import * as patientService from "../../../services/patients.services.jsx";
import "./searchBar.scss";

export default function SearchBar({ onSearch, triggerRefresh }) {
    const [fullNameVet, setFullNameVet] = useState("");
    const [petName, setPetName] = useState("");
    const [species, setSpecies] = useState("");
    const [speciesList, setSpeciesList] = useState([]);
    const [minAge, setMinAge] = useState("");
    const [maxAge, setMaxAge] = useState("");
    const [sortType, setSortType] = useState("NameAsc");
    const [isVisible, setIsVisible] = useState(true);


    useEffect(() => {
        speciesService.getAllSpecies()
            .then(res => setSpeciesList(res || []))
            .catch(err => console.error("Greška pri učitavanju vrsta:", err));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();

        const payload = {
            FullNameVet: fullNameVet || null,
            PetName: petName || null,
            Species: species || null,
            MinAge: minAge ? parseInt(minAge) : null,
            MaxAge: maxAge ? parseInt(maxAge) : null,
            SortType: sortType || "NameAsc"
        };

        try {
            // resetujemo na prvu stranicu sa default pageSize = 5
            const result = await patientService.searchPatients(payload, 1, 5);
            onSearch(result); // prosleđuje PagedResult (Items + TotalCount)
        } catch (err) {
            console.error("Greška pri pretrazi:", err);
        }
    };

    const resetFilters = () => {
        setFullNameVet("");
        setPetName("");
        setSpecies("");
        setMinAge("");
        setMaxAge("");
        setSortType("NameAsc");
        triggerRefresh(); // osvežava listu pacijenata
    };

    return (
        <div className="search-bar-wrapper">
            <div className="search-bar-header">
                <button 
                type="button" 
                onClick={() => setIsVisible(prev => !prev)} 
                className="toggle-search-button"
                >
                {isVisible ? "-" : "+"}
                </button>
                <h3 className="search-title">Pretraga pacijenata</h3>
            </div>

            {isVisible && (
            <form onSubmit={handleSearch} className="patient-search-form">
                <fieldset>
                    <legend>Filteri</legend>
                    <div className="form-grid">
                        <label>
                            Veterinar (ime i prezime):
                            <input type="text" value={fullNameVet} onChange={e => setFullNameVet(e.target.value)} />
                        </label>

                        <label>
                            Ime pacijenta:
                            <input type="text" value={petName} onChange={e => setPetName(e.target.value)} />
                        </label>

                        <label>
                            Vrsta:
                            <select value={species} onChange={e => setSpecies(e.target.value)}>
                                <option value="">-- Izaberi vrstu --</option>
                                {speciesList.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </label>

                        <label>
                            Minimalne godine:
                            <input type="number" value={minAge} onChange={e => setMinAge(e.target.value)} />
                        </label>

                        <label>
                            Maksimalne godine:
                            <input type="number" value={maxAge} onChange={e => setMaxAge(e.target.value)} />
                        </label>

                        <label>
                            Sortiraj po:
                            <select value={sortType} onChange={e => setSortType(e.target.value)}>
                                <option value="NameAsc">Ime pacijenta (A-Z)</option>
                                <option value="NameDesc">Ime pacijenta (Z-A)</option>
                                <option value="SpeciesAsc">Vrsta (A-Z)</option>
                                <option value="SpeciesDesc">Vrsta (Z-A)</option>
                                <option value="VetAsc">Veterinar (A-Z)</option>
                                <option value="VetDesc">Veterinar (Z-A)</option>
                                <option value="AgeAsc">Godine (rastuce)</option>
                                <option value="AgeDesc">Godine (opadajuce)</option>
                            </select>
                        </label>
                    </div>
                </fieldset>

                <div className="form-actions">
                    <button type="submit">Pretraži</button>
                    <button type="button" onClick={resetFilters}>Resetuj</button>
                </div>
            </form>
            )}
        </div>
    );
}
