import axiosClient from "./axiosClient";

export interface RegisterSchoolPayload {
    school_name: string;
    branch: string;
    board: string;
    fullname: string;
    email: string;
    mobile_number: string;
    status: string;
    image: string; // Base64 string
    address: string;
}

export const registerSchool = async (data: RegisterSchoolPayload) => {
    const response = await axiosClient.post("/SchoolAdmin/register", data);
    return response.data;
};

export interface SchoolAdmin {
    school_admin_id: number;
    name: string;
    email: string;
    is_active: boolean;
}

export interface School {
    school_id: number;
    name: string;
    image: string;
    address: string | null;
    branch: string;
    board: string;
    shipping_fee: boolean;
    shipping_fee_flat: number | null;
    admission_id: boolean;
    is_active: boolean;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
    SchoolAdmins: SchoolAdmin[];
    total_bundles: number;
    school_admin_name: string | null;
}

export interface UpdateSchoolPayload {
    name?: string;
    branch?: string;
    board?: string;
    image?: string;
    address?: string;
    is_active?: boolean;
    admission_id?: boolean;
}

export interface SchoolListResponse {
    count: number;
    rows: School[];
}

export const getSchoolList = async () => {
    const response = await axiosClient.get<SchoolListResponse>("/School/list");
    return response.data;
};

export const updateSchool = async (id: number, data: UpdateSchoolPayload) => {
    const response = await axiosClient.patch(`/School/update/${id}`, data);
    return response.data;
};

export const deleteSchool = async (id: number) => {
    const response = await axiosClient.delete(`/School/delete/${id}`);
    return response.data;
};
