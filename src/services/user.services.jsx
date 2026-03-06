import AxiosConfig from "./AxiosConfig.js";

export async function getAllVets() {
  const response = await AxiosConfig.get('/User/Vet');
  return response.data;
}

export async function createOwner(ownerData) {
  const response = await AxiosConfig.post('/User/Owner' , ownerData);
  return response.data;
}


export async function searchOwners(fullName) {
  const response = await AxiosConfig.get('/User/owner', {
    params: { fullName }
  });
  return response.data;
}