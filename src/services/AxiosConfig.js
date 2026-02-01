import axios from 'axios';

let AxiosConfig = axios.create({
  baseURL: 'http://localhost:5231/api',
});

AxiosConfig.interceptors.request.use((config) => {

  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default AxiosConfig;
