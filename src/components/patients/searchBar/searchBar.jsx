import React, { useState, useEffect } from "react";
import * as speciesService from "../../../services/species.services.jsx";
import * as patientService from "../../../services/patients.services.jsx";
import "./searchBar.scss";

export default function SearchBar({ onSearch, triggerRefresh }) {
    const [filters, setFilters] = useState({
        fullNameVet: "",
        petName: "",
        species: "",
        minAge: "",
        maxAge: "",
        sortType: "NameAsc",
    });
    const [speciesList, setSpeciesList] = useState([]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        speciesService.getAllSpecies()
            .then(res => setSpeciesList(res || []))
            .catch(err => console.error("Greška pri učitavanju vrsta:", err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        const payload = {
            FullNameVet: filters.fullNameVet || null,
            PetName: filters.petName || null,
            Species: filters.species || null,
            MinAge: filters.minAge ? parseInt(filters.minAge) : null,
            MaxAge: filters.maxAge ? parseInt(filters.maxAge) : null,
            SortType: filters.sortType || "NameAsc",
        };

        try {
            const result = await patientService.searchPatients(payload, 1, 5);
            onSearch(result);
        } catch (err) {
            console.error("Greška pri pretrazi:", err);
        }
    };

    const resetFilters = () => {
        setFilters({
            fullNameVet: "",
            petName: "",
            species: "",
            minAge: "",
            maxAge: "",
            sortType: "NameAsc",
        });
        triggerRefresh();
    };

    return (
        <div className="search-bar-wrapper">
            <div className="search-bar-header">
                <button
                    type="button"
                    onClick={() => setIsVisible((prev) => !prev)}
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
                            {renderInput("Veterinar (ime i prezime):", "fullNameVet", filters.fullNameVet, handleInputChange)}
                            {renderInput("Ime pacijenta:", "petName", filters.petName, handleInputChange)}
                            {renderSelect("Vrsta:", "species", filters.species, speciesList, handleInputChange)}
                            {renderInput("Minimalne godine:", "minAge", filters.minAge, handleInputChange, "number")}
                            {renderInput("Maksimalne godine:", "maxAge", filters.maxAge, handleInputChange, "number")}
                            {renderSortSelect("Sortiraj po:", "sortType", filters.sortType, handleInputChange)}
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

function renderInput(label, name, value, onChange, type = "text") {
    return (
        <label>
            {label}
            <input type={type} name={name} value={value} onChange={onChange} />
        </label>
    );
}

function renderSelect(label, name, value, options, onChange) {
    return (
        <label>
            {label}
            <select name={name} value={value} onChange={onChange}>
                <option value="">-- Izaberi vrstu --</option>
                {options.map((option) => (
                    <option key={option.id} value={option.name}>
                        {option.name}
                    </option>
                ))}
            </select>
        </label>
    );
}

function renderSortSelect(label, name, value, onChange) {
    const sortOptions = [
        { value: "NameAsc", label: "Ime pacijenta (A-Z)" },
        { value: "NameDesc", label: "Ime pacijenta (Z-A)" },
        { value: "SpeciesAsc", label: "Vrsta (A-Z)" },
        { value: "SpeciesDesc", label: "Vrsta (Z-A)" },
        { value: "VetAsc", label: "Veterinar (A-Z)" },
        { value: "VetDesc", label: "Veterinar (Z-A)" },
        { value: "AgeAsc", label: "Godine (rastuce)" },
        { value: "AgeDesc", label: "Godine (opadajuce)" },
    ];

    return (
        <label>
            {label}
            <select name={name} value={value} onChange={onChange}>
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
