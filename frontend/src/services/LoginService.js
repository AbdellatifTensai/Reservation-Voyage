import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export async function login(username, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error("Login failed. Please try again later.");
    }
  }
}