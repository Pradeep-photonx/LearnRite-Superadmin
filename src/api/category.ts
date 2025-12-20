import axiosClient from "./axiosClient";

export interface CreateCategoryPayload {
    name: string;
    visibility: boolean;
    is_active: boolean;
}


export interface Category {
    category_id: number;
    name: string;
    image: string | null;
    is_active: boolean;
    visibility: boolean;
    products_count: number;
}

export interface CategoryListResponse {
    count: number;
    rows: Category[];
}

export const createCategory = async (data: CreateCategoryPayload) => {
    const response = await axiosClient.post("/Category/create", data);
    return response.data;
};


export const getCategoryList = async () => {
    const response = await axiosClient.get<CategoryListResponse>("/Category/list");
    return response.data;
};

export interface UpdateCategoryPayload {
    name?: string;
    image?: string;
    visibility?: boolean;
    is_active?: boolean;
}

export const updateCategory = async (id: number, data: UpdateCategoryPayload) => {
    const response = await axiosClient.put(`/Category/update/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number) => {
    const response = await axiosClient.delete(`/Category/delete/${id}`);
    return response.data;
};

export interface CreateSubCategoryPayload {
    category_id: number;
    name: string;
    is_active: boolean;
}

export const createSubCategory = async (data: CreateSubCategoryPayload) => {
    const response = await axiosClient.post("/SubCategory/create", data);
    return response.data;
};

export interface SubCategory {
    sub_category_id: number;
    category_id: number;
    name: string;
    is_active: boolean;
}

export interface SubCategoryListResponse {
    count: number;
    rows: SubCategory[];
}

export const getSubCategoryList = async (categoryId: number) => {
    const response = await axiosClient.get<SubCategoryListResponse>(`/SubCategory/list/${categoryId}`);
    return response.data;
};

export interface UpdateSubCategoryPayload {
    name?: string;
    is_active?: boolean;
}

export const updateSubCategory = async (id: number, data: UpdateSubCategoryPayload) => {
    const response = await axiosClient.patch(`/SubCategory/update/${id}`, data);
    return response.data;
};

export const deleteSubCategory = async (id: number) => {
    const response = await axiosClient.delete(`/SubCategory/delete/${id}`);
    return response.data;
};





