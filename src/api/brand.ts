import axiosClient from "./axiosClient";

export interface Brand {
    brand_id: number;
    name: string;
    is_active: boolean;
    createdAt: string;
}

export interface CreateBrandPayload {
    name: string;
    is_active: boolean;
}

export interface BrandListResponse {
    count: number;
    rows: Brand[];
}

export const createBrand = async (data: CreateBrandPayload) => {
    const response = await axiosClient.post("/Brand/create", data);
    return response.data;
};

export const getBrandList = async () => {
    const response = await axiosClient.get<BrandListResponse>("/Brand/list");
    return response.data;
};

export interface UpdateBrandPayload {
    name?: string;
    is_active?: boolean;
}

export const updateBrand = async (id: number, data: UpdateBrandPayload) => {
    const response = await axiosClient.put(`/Brand/update/${id}`, data);
    return response.data;
};

export const deleteBrand = async (id: number) => {
    const response = await axiosClient.delete(`/Brand/delete/${id}`);
    return response.data;
};


