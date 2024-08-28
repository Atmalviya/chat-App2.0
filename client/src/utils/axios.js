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

export const updateProfileImage = async (formData) => {
  try {
    const res = await axios.post("/auth/update-profile-image", formData);
    return res;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
}

export const removeProfileImage = async () => {
  try {
    const res = await axios.post("/auth/remove-profile-image");
    return res;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
}

export const logout = async () => {
  try {
    const res = await axios.get("/auth/logout");
    return res;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
}

export const getAllContacts = async (searchTerm) => {
  try {
    const res = await apiClient.post("/contacts/search", {searchTerm}, {
      withCredentials: true,});
    return res;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
}
export const getDmMessage = async (receipantId) => {
try {
  const res = await axios.post("/messages/get-messages", {id:receipantId})
  return res
} catch (error) {
  return Promise.reject(error.response.data);
}
}

export const getContactsForDmList = async () => {
  try {
    const res = await axios.get("/contacts/get-contacts-for-dm");
    return res
  } catch (error) {
    return Promise.reject(error.response.data);
  }
}