import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, '');
const baseURL = normalizedApiUrl
  ? normalizedApiUrl.endsWith('/api')
    ? normalizedApiUrl
    : `${normalizedApiUrl}/api`
  : '/api';

const API = axios.create({
  baseURL,
  timeout: 15000,
});

API.interceptors.request.use(
  (config) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo?.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    } catch (error) {
      console.error('Axios interceptor error', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      if (!['/login', '/register'].includes(path)) {
        localStorage.removeItem('userInfo');
        window.dispatchEvent(new Event('userLogout'));
      }
    }
    return Promise.reject(error);
  }
);

export default API;
