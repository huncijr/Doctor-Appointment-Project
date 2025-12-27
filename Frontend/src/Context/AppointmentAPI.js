import axios from "axios";

const URL = import.meta.VITE_API_URL || "http://localhost:5001/API";
export const API = axios.create({
  baseURL: URL,
  withCredentials: true,
});
