import axiosClient from "./axiosClient";

export interface CreateProductPayload {
    category_id: number;
    sub_category_id: number;
    name: string;
    description: string;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    image5: string;
    brand_id: number;

    mrp: number;
    selling_price: number;
    discount_percentage: number;
    stock_quantity: number;
    is_active: boolean;

}

export const createProduct = async (data: CreateProductPayload) => {
    const response = await axiosClient.post("/Product/create", data);
    return response.data;
};

export interface UpdateProductPayload {
    name?: string;
    description?: string;
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
    brand_id?: number;
    mrp?: number;
    selling_price?: number;
    discount_percentage?: number;
    stock_quantity?: number;
    is_active?: boolean;
}

export const updateProduct = async (id: number, data: UpdateProductPayload) => {
    const response = await axiosClient.put(`/Product/update/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id: number) => {
    const response = await axiosClient.delete(`/Product/delete/${id}`);
    return response.data;
};

export interface Product {
    id: number;
    category_id: number;
    sub_category_id: number;
    name: string;
    description: string;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    image5: string;
    brand_id: number;

    mrp: number;
    selling_price: number;
    discount_percentage: number;
    stock_quantity: number;
    is_active: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface NestedProduct {
    product_id: number;
    category_id: number;
    sub_category_id: number;
    brand_id: number;
    name: string;
    description: string;
    images: string[];
    mrp: number;
    selling_price: number;
    discount_percentage: number;
    stock_quantity: number;
    sku: string;
    is_active: boolean;
    is_delete: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NestedSubCategory {
    sub_category_id: number;
    category_id: number;
    name: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    Product: NestedProduct;
}

export interface NestedCategory {
    category_id: number;
    name: string;
    image: string | null;
    is_active: boolean;
    visibility: boolean;
    createdAt: string;
    updatedAt: string;
    SubCategory: NestedSubCategory;
}

export interface ProductListRow {
    Category: NestedCategory;
}

export interface ProductListResponse {
    count: number;
    rows: ProductListRow[];
}


export const getProductList = async () => {
    const response = await axiosClient.get<ProductListResponse>("/Product/list");
    return response.data;
};
