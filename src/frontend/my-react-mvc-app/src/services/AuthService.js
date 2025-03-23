import axios from "axios";

const API_BASE_URL = "http://localhost:8080/auth";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : "Login failed");
  }
};