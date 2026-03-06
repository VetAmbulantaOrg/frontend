import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AsyncSelect from "react-select/async"; // važno: koristi AsyncSelect
import "../Login_Register/login_register.scss";
import * as userService from "../../services/user.services.jsx";

function ContactHookForm({ user, vets = [], species = [], initialData = {}, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [selectedOwner, setSelectedOwner] = useState(null);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        name: initialData.name || "",
        dateOfBirth: initialData.dateOfBirth
          ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
          : "",
        species: initialData.species?.id || "",
        vet: initialData.vet?.id
          ? Number(initialData.vet.id)
          : user?.role === "Veterinar"
          ? Number(user.Id)
          : null,
      });

      if (initialData.owner) {
        setSelectedOwner({
          value: initialData.owner.id,
          label: `${initialData.owner.name} ${initialData.owner.surname} (${initialData.owner.adress})`,
        });
      }
    }
  }, [initialData, reset, user]);

  // asinhrona pretraga vlasnika
  const loadOwners = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];
    try {
      const data = await userService.searchOwners(inputValue);
      return data.map((o) => ({
        value: o.id,
        label: `${o.name} ${o.surname} (${o.adress})`,
      }));
    } catch (error) {
      console.error("Greška pri pretrazi vlasnika:", error);
      return [];
    }
  };

  const onSubmitPatient = (data) => {
    const patient = {
      id: initialData?.id,
      name: data.name,
      speciesId: data.species ? Number(data.species) : null,
      vetId: data.vet ? Number(data.vet) : null,
      dateOfBirth: data.dateOfBirth,
      ownerId: selectedOwner ? selectedOwner.value : null,
    };

    console.log("Podaci iz forme:", patient);
    onSubmit(patient);
    reset();
  };

  const renderInputField = (label, name, type, validation, additionalProps = {}) => (
    <div className="form-section">
      <label>
        {label}
        <input type={type} {...register(name, validation)} {...additionalProps} />
        {errors[name] && <p className="error">{errors[name].message}</p>}
      </label>
    </div>
  );

  const renderSelectField = (label, name, options, additionalProps = {}) => (
    <div className="form-section">
      <label>
        {label}
        <select {...register(name)} {...additionalProps}>
          <option value="">-- Bez opcije --</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name || `${option.name} ${option.surname}`}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <form className="forma" onSubmit={handleSubmit(onSubmitPatient)}>
      <h2>{initialData?.id ? "Izmena pacijenta" : "Dodaj pacijenta"}</h2>

      {renderInputField("Ime:", "name", "text", {
        required: "Obavezno je uneti ime pacijenta!",
      })}

      {renderInputField("Datum rođenja:", "dateOfBirth", "date", {
        required: "Obavezno je uneti datum rođenja!",
        setValueAs: (value) => (value ? new Date(value).toISOString() : null),
      })}

      {renderSelectField("Vrsta pacijenta:", "species", species)}

      {/* Pretraga vlasnika */}
      <div className="form-section">
        <label>
          Vlasnik:
          <AsyncSelect
            cacheOptions
            loadOptions={loadOwners}
            defaultOptions
            value={selectedOwner}
            onChange={setSelectedOwner}
            placeholder="Pretraži vlasnike..."
            isSearchable
          />
        </label>
      </div>

      {initialData.id &&
        renderSelectField("Izaberite vašeg veterinara:", "vet", vets)}

      <button type="submit">
        {initialData?.id ? "Sačuvaj izmene" : "Dodaj pacijenta"}
      </button>

      <button type="button" onClick={onCancel}>
        Otkaži
      </button>
    </form>
  );
}

export default ContactHookForm;
