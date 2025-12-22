import axiosClient from "./axiosClient";

export interface BundleProduct {
    product_id: number;
    quantity: number;
    is_mandatory: number; // 0 or 1
}

export interface CreateBundlePayload {
    class_id: number;
    cl_id: number;
    school_id: number;
    name: string;
    products: BundleProduct[];
}

export interface Bundle {
    class_bundle_id: number;
    class_id: number;
    name: string;
    school_id: number;
    cl_id: number;
    product_id: number;
    quantity: number;
    price: number;
    total_price: number;
    is_mandatory: boolean;
    is_active: boolean;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BundleListResponse {
    count: number;
    rows: Bundle[];
}

export interface UpdateBundlePayload {
    class_bundle_id: number;
    class_id: number;
    cl_id: number;
    products: BundleProduct[];
}

export const createBundle = async (data: CreateBundlePayload) => {
    const response = await axiosClient.post("/ClassBundle/create", data);
    return response.data;
};

export const updateBundle = async (data: UpdateBundlePayload) => {
    const response = await axiosClient.put("/ClassBundle/update", data);
    return response.data;
};

export const getBundleList = async () => {
    const response = await axiosClient.get<BundleListResponse>("/ClassBundle/list");
    return response.data;
};
