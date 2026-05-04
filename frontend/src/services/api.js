import axios from 'axios';

// Semua request akan di-proxy oleh Vite ke http://localhost:3000
const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' }
});

export default api;
