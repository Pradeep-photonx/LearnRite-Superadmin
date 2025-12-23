import axiosClient from "./axiosClient";

export interface AdmissionPayload {
    admission_id: string;
    student_name: string;
    class_id: number;
    parent_name: string;
    parent_mobile_number: string;
    new_admission: boolean;
    is_active: boolean;
}

export interface UpdateAdmissionPayload {
    student_name: string;
    class_id: number;
    parent_name: string;
    parent_mobile_number: string;
    new_admission: boolean;
    is_active: boolean;
}

export interface Admission {
    id: number;
    admission_id: string;
    student_name: string;
    class_id: number;
    parent_name: string;
    parent_mobile_number: string;
    new_admission: boolean;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    class?: string | { name?: string; class?: string };
    Class?: {
        name?: string;
        class?: string;
    };
}

export interface AdmissionListResponse {
    count: number;
    rows: Admission[];
}

export const createAdmission = async (data: AdmissionPayload) => {
    const response = await axiosClient.post("/Admission/create", data);
    return response.data;
};

export const getAdmissionList = async () => {
    const response = await axiosClient.post<AdmissionListResponse>("/Admission/list", {});
    return response.data;
};

export const updateAdmission = async (admission_id: string, data: UpdateAdmissionPayload) => {
    const response = await axiosClient.put(`/Admission/update/${admission_id}`, data);
    return response.data;
};

export const deleteAdmission = async (admission_id: string) => {
    const response = await axiosClient.delete(`/Admission/delete/${admission_id}`);
    return response.data;
};

export const getAdmissionDetails = async (admission_id: string) => {
    const response = await axiosClient.get<Admission>(`/Admission/view/${admission_id}`);
    return response.data;
};
