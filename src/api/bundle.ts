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
    bundle_id: string;
    name: string;
    class_id: number;
    cl_id: number;
    school_id: number;
    is_active: boolean;
    total_products: number;
    total_bundle_price: number;
    createdAt: string;
    Class: {
        name: string;
    };
    ClassLanguage: {
        language: string;
    };
    School: {
        name: string;
    };
}

export interface BundleListResponse {
    count: number;
    rows: Bundle[];
}

export interface BundleDetailResponse {
    bundle_id: string;
    name: string;
    class_id: number;
    cl_id: number;
    school_id: number;
    is_active: boolean;
    total_bundle_price: number;
    allProducts: (BundleProduct & {
        price: number;
        Product: {
            name: string;
            images: string[];
        }
    })[];
}

export interface UpdateBundlePayload {
    new_school_id: number;
    name: string;
    products: BundleProduct[];
}

export const createBundle = async (data: CreateBundlePayload) => {
    const response = await axiosClient.post("ClassBundle/create", data);
    return response.data;
};

export const updateBundle = async (bundleId: string, data: UpdateBundlePayload) => {
    const response = await axiosClient.put(`ClassBundle/update/${bundleId}`, data);
    return response.data;
};

export const getBundleList = async () => {
    const response = await axiosClient.get<BundleListResponse>("ClassBundle/list");
    return response.data;
};

export const getBundleDetail = async (bundleId: string) => {
    const response = await axiosClient.get<BundleDetailResponse>(`ClassBundle/view/${bundleId}`);
    return response.data;
};

export const deleteBundle = async (bundleId: string) => {
    const response = await axiosClient.delete(`ClassBundle/delete/${bundleId}`);
    return response.data;
};
