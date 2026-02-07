import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 120000,
  headers: {
    Accept: "application/json",
  },
});

// Intercept responses to catch HTML-instead-of-JSON errors (common when API proxy is misconfigured)
client.interceptors.response.use((response) => {
  if (
    typeof response.data === "string" &&
    response.data.startsWith("<!")
  ) {
    return Promise.reject(
      new Error("API returned HTML instead of JSON. Check VITE_API_URL configuration.")
    );
  }
  return response;
});

export default client;
