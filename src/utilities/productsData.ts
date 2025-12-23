export interface Product {
    id: number;
    name: string;
    category: string;
    subCategory: string;
    stock: number;
    mrp: number;
    sellingPrice: number;
    discount: number;
    status: "Active" | "Inactive";
    image: string;
}

export const productsData: Product[] = [];
