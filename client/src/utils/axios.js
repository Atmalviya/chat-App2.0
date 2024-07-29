import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export const Login = async ({ email, password }) => {
  try {
    const response = await axios.post("/auth/login", { email, password });
    toast.success(response.data.message);
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
    return Promise.reject(error.response.data);
  }
};

export const Signup = async ({ email, password }) => {
  try {
    const response = await axios.post("/auth/signup", { email, password });
    // console.log(response)
    toast.success(response.data.message);
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
    return Promise.reject(error.response.data);
  }
};

export const getUserDetails = async () => {
  try {
    const res = await axios.get("/auth/user-info", {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
}

export const updateProfile = async (data) => {
  try {
    const res = await axios.post("/auth/update-profile", data);
    return res
  } catch (error) {
    return Promise.reject(error.response.data);
  }
}
