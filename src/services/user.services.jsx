import AxiosConfig from "./AxiosConfig.js";

export async function getAllVets() {
  const response = await AxiosConfig.get('/User/Vet');
  return response.data;
}