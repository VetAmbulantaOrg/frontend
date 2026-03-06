import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import "../Login_Register/login_register.scss";
import * as userService from "../../services/user.services.jsx";

function ContactHookForm({ user, vets = [], species = [], initialData = {}, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      dateOfBirth: initialData?.dateOfBirth
        ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
        : "",
      species: initialData?.species?.id || "",
      vet: initialData?.vet?.id
        ? Number(initialData.vet.id)
        : user?.role === "Veterinar"
        ? Number(user.Id)
        : null,
      owner: initialData?.owner
        ? {
            value: initialData.owner.id,
            label: `${initialData.owner.name} ${initialData.owner.surname} (${initialData.owner.adress})`,
          }
        : null,
    },
  });

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
        owner: initialData.owner
          ? {
              value: initialData.owner.id,
              label: `${initialData.owner.name} ${initialData.owner.surname} (${initialData.owner.adress})`,
            }
          : null,
      });
    }
    // nema reset() u else grani → nema beskonačne petlje
  }, [initialData, user]);

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
      ownerId: data.owner ? data.owner.value : null,
    };

    console.log("Podaci iz forme:", patient);
    onSubmit(patient);
    reset(); // reset nakon submit-a
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

      <div className="form-section">
        <label>
          Vlasnik:
          <Controller
            name="owner"
            control={control}
            rules={{ required: "Vlasnik je obavezan!" }}
            render={({ field }) => (
              <AsyncSelect
                cacheOptions
                loadOptions={loadOwners}
                defaultOptions
                value={field.value}
                onChange={field.onChange}
                placeholder="Pretraži vlasnike..."
                isSearchable
              />
            )}
          />
          {errors.owner && <p className="error">{errors.owner.message}</p>}
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
