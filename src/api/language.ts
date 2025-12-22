import axiosClient from "./axiosClient";

export interface Language {
    cl_id: number;
    language: string;
    is_active: boolean;
    createdAt: string;
}

export interface LanguageListResponse {
    count: number;
    rows: Language[];
}

export const getLanguageList = async () => {
    const response = await axiosClient.get<LanguageListResponse>("/ClassLanguage/list");
    return response.data;
};
