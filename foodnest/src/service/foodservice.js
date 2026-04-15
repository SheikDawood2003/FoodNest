import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/foods";

export const fetchFoodList = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching food list:", error);
        throw error;
    }
};

export const fetchFoodDetails = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
        
    } catch (error) {
        console.error(`Error fetching food details for id ${id}:`, error);
        throw error;
    }
}