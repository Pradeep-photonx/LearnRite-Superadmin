import axiosClient from "./axiosClient";

export interface Class {
    class_id: number;
    name: string;
    is_active: boolean;
    createdAt: string;
}

export interface ClassListResponse {
    count: number;
    rows: Class[];
}

export const getClassList = async () => {
    const response = await axiosClient.get<ClassListResponse>("/Class/list");
    return response.data;
};
