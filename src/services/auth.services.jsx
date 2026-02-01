import AxiosConfig from "./AxiosConfig.js";

export const login = async (userName, password) => {
  
  const response = await AxiosConfig.post("/auth/login",userName, password);

  if (response.data.token) {
    sessionStorage.setItem("token", response.data.token);
  }

  return response.data;
};


export const logout = () => {
  sessionStorage.clear();
};



export async function createUser(userData) {
  const response = await AxiosConfig.post("/Auth/register", userData);
  return response;
}