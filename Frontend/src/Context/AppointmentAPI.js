import axios from "axios";

const URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/API" : "/API";
export const API = axios.create({
  baseURL: URL,
});
