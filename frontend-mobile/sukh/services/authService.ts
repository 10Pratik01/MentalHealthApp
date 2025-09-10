import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  mobileNumber?: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });

  if (res.data.token) {
    await AsyncStorage.setItem("token", res.data.token);
  }

  return res.data;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem("token");
  return true;
};

export const getUserProfile = async () => {
  const res = await api.get("/auth/profile"); // token auto-attached
  return res.data;
};

export const updateUserProfile = async (data: {
  name?: string;
  dateOfBirth?: string;
  mobileNumber?: string;
}) => {
  const res = await api.put("/auth/profile", data);
  return res.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const res = await api.put("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};
