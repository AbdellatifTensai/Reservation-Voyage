import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

export const addTrain = async (train) => {
  return await axios.post(`${API_BASE_URL}/trains`, train);
};

export const getTrains = async () => {
  const response = await axios.get(`${API_BASE_URL}/trains`);
  return response.data;
};

export const makeReservation = async (reservation) => {
  return await axios.post(`${API_BASE_URL}/reservations`, reservation);
};