import axios from "axios";

// Set your backend base URL from environment variable
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // change this when deployed
});

// Automatically attach JWT token if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
