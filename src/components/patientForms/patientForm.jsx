import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "../Login_Register/login_register.scss";

function ContactHookForm({user , vets, species , initialData = {}, onSubmit, onCancel }) {
    const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0 && vets.length > 0) {
      reset({
        name: initialData.name || "",
        dateOfBirth: initialData.dateOfBirth
          ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
          : "",
        species: initialData.species?.id || "",
        vet: initialData.vet?.id
          ? Number(initialData.vet.id)                // ako pacijent ima veterinara
          : (user?.role === "Veterinar" ? Number(user.Id) : null) // ako nema, setuj ulogovanog veterinara
      });
    }
  }, [initialData, vets, reset, user]);
  
  


  const onSubmitPatient = (data) => {
    const patient = {
      id: initialData?.id,
      name: data.name,
      speciesId: data.species ? Number(data.species) : null,
      vetId: data.vet ? Number(data.vet) : null,
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
            <select {...register("species")}>
            <option value="">-- Bez vrste --</option>
            {species.map((specie) => (
                <option key={specie.id} value={specie.id}>
                {specie.name}
                </option>
            ))}
            </select>
        </label>
        </div>


        {!initialData.id && (
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

        {initialData.id && (
            <div className="form-section">
            <label>
                Izaberite vaseg veterinara:
                <select {...register("vet")}>
                <option value="">-- Bez veterinara --</option>
                {vets.map((vet) => (
                    <option key={vet.id} value={vet.id}>
                    {vet.name} {" "} {vet.surname}
                    </option>
                ))}
                </select>
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
