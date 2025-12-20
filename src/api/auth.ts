import axiosClient from "./axiosClient";

export interface LoginPayload {
    email: string;
    password: string;
}

export const login = async (data: LoginPayload) => {
    const response = await axiosClient.post("/SchoolAdmin/login", data);
    return response.data;
};
