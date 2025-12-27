import axios from "axios";

const URL =
  import.meta.VITE_API_URL ||
  "https://appointment-backend-bfe4bydmhfdygbew.canadacentral-01.azurewebsites.net/API";
export const API = axios.create({
  baseURL: URL,
  withCredentials: true,
});
