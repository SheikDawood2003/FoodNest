import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const registerUser = async (data) =>{
    try {
        const response = await axios.post(BASE_URL+"/register",data);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const login = async (data) =>{
    try{
        const response = await axios.post(BASE_URL+"/login", data);
        return response;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}