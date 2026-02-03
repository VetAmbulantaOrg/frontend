import AxiosConfig from "./AxiosConfig.js";


export async function getAllPatients() {
  const response = await AxiosConfig.get('/Patient/');
  return response.data;
}

export async function getPatientsById(id) {
  const response = await AxiosConfig.get(`/Patient/${id}`);
  return response.data;
}

export async function createPatient(productData) {
  const response = await AxiosConfig.post("/Patient/", productData);
  return response.data;
}

export async function updatePatient(productData) {
  const response = await AxiosConfig.put("/Patient/", productData);
  return response.data;
}

export async function deletePatient(id) {
  const response = await AxiosConfig.delete(`/Patient/${id}`);
  return response.data;
}

export async function searchPatients(searchParams) {
  const response = await AxiosConfig.post('/Patient/search', searchParams);
  return response.data;
}