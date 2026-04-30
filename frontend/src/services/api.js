import axios from 'axios';

const api = axios.create({
  baseURL: 'https://upbeat-integrity-production-7090.up.railway.app/api',
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
