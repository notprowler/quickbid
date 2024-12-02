import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const getListings = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/listings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};
