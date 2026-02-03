import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "../Login_Register/login_register.scss";

function ContactHookForm({ species , initialData = {}, onSubmit, onCancel }) {
    const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setValue("name", initialData.name || "");
      setValue("dateOfBirth", initialData.dateOfBirth || "");
      setValue("species", initialData.species.id || "");
    }
  }, [initialData, setValue]);


  const onSubmitPatient = (data) => {
    const patient = {
      id: initialData?.id,
      name: data.name,
      speciesId: data.species ? Number(data.species) : null,
      dateOfBirth: data.dateOfBirth,
      ownerUsername: data.owner,
    };

    console.log("Podaci iz forme:", patient);
    onSubmit(patient);
    reset();
  };
  

  return (
    <form className="forma" onSubmit={handleSubmit(onSubmitPatient)}>
        <h2>{initialData?.id ? "Izmena pacijenta" : "Dodaj pacijenta"}</h2>

        <div className="form-section">
            <label>
            Ime:
            <input
                type="text"
                {...register("name", {
                required: "Obavezno je uneti ime pacijenta!",
                })}
            />
            {errors.name && <p className="error">{errors.name.message}</p>}
            </label>
        </div>

        <div className="form-section">
            <label>
            Datum rođenja:
            <input
                type="date"
                {...register("dateOfBirth", {
                required: "Obavezno je uneti datum rođenja!",
                setValueAs: (value) => {
                    if (!value) return null;
                    return new Date(value).toISOString();
                },
                })}
            />
            {errors.dateOfBirth && (
                <p className="error">{errors.dateOfBirth.message}</p>
            )}
            </label>
        </div>

        <div className="form-section">
            <label>
            Vrsta pacijenta:
            <select
                {...register("species")}
                defaultValue={initialData?.species?.id ?? ""}
            >
                <option value="">-- Bez vrste --</option>
                {species.map((specie) => (
                <option key={specie.id} value={specie.id}>
                    {specie.name}
                </option>
                ))}
            </select>
            </label>
        </div>

        {initialData && (
            <div className="form-section">
            <label>
                Korisničko ime vlasnika:
                <input
                type="text"
                {...register("owner", {
                    required: "Obavezno je uneti korisničko ime vlasnika!",
                })}
                />
                {errors.owner && <p className="error">{errors.owner.message}</p>}
            </label>
            </div>
        )}

        <button type="submit">
            {initialData?.id ? "Sačuvaj izmene" : "Dodaj pacijenta"}
        </button>

        {initialData?.id && (
            <button type="button" onClick={onCancel}>
            Otkaži
            </button>
        )}
    </form>
  );
}

export default ContactHookForm;
