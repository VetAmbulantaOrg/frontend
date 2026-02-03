import AxiosConfig from "./AxiosConfig.js";

export async function getAllSpecies() {
  const response = await AxiosConfig.get('/Animal/');
  return response.data;
}

export async function getSpeciesById(id) {
    const response = await AxiosConfig.get(`/Animal/${id}`);
    return response.data;
}

export async function createSpecies(speciesData) {
    const response = await AxiosConfig.post("/Animal/", speciesData);
    return response.data;
}

export async function updateSpecies(speciesData) {
    const response = await AxiosConfig.put("/Animal/", speciesData);
    return response.data;
}

export async function deleteSpecies(id) {
    const response = await AxiosConfig.delete(`/Animal/${id}`);
    return response.data;
}