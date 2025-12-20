export interface Product {
  id: string;
  productName: string;
  productImage?: string;
  sku: string;
  category: string;
  currentStock: string;
  price: string;
  status: "In stock" | "low stock" | "Out of stock";
}

export const productsData: Product[] = [
  {
    id: "1",
    productName: "Classmate Single Line Long Notebook",
    productImage: "https://via.placeholder.com/40x40/2C65F9/FFFFFF?text=N",
    sku: "#CM2341",
    category: "Notebooks",
    currentStock: "150 Pieces",
    price: "₹ 149/-",
    status: "In stock",
  },
  {
    id: "2",
    productName: "Classmate Single Line Long Notebook",
    productImage: "https://via.placeholder.com/40x40/2C65F9/FFFFFF?text=N",
    sku: "#CM2341",
    category: "Notebooks",
    currentStock: "150 Pieces",
    price: "₹ 149/-",
    status: "low stock",
  },
  {
    id: "3",
    productName: "Classmate Single Line Long Notebook",
    productImage: "https://via.placeholder.com/40x40/2C65F9/FFFFFF?text=N",
    sku: "#CM2341",
    category: "Notebooks",
    currentStock: "150 Pieces",
    price: "₹ 149/-",
    status: "In stock",
  },
  {
    id: "4",
    productName: "Classmate Single Line Long Notebook",
    productImage: "https://via.placeholder.com/40x40/2C65F9/FFFFFF?text=N",
    sku: "#CM2341",
    category: "Notebooks",
    currentStock: "150 Pieces",
    price: "₹ 149/-",
    status: "In stock",
  },
  {
    id: "5",
    productName: "Classmate Single Line Long Notebook",
    productImage: "https://via.placeholder.com/40x40/2C65F9/FFFFFF?text=N",
    sku: "#CM2341",
    category: "Notebooks",
    currentStock: "150 Pieces",
    price: "₹ 149/-",
    status: "In stock",
  },
  {
    id: "6",
    productName: "Classmate Single Line Long Notebook",
    productImage: "https://via.placeholder.com/40x40/2C65F9/FFFFFF?text=N",
    sku: "#CM2341",
    category: "Notebooks",
    currentStock: "150 Pieces",
    price: "₹ 149/-",
    status: "In stock",
  },
  {
    id: "7",
    productName: "Classmate Single Line Long Notebook",
    productImage: "https://via.placeholder.com/40x40/2C65F9/FFFFFF?text=N",
    sku: "#CM2341",
    category: "Notebooks",
    currentStock: "150 Pieces",
    price: "₹ 149/-",
    status: "In stock",
  },
  {
    id: "8",
    productName: "Classmate Single Line Long Notebook",
    productImage: "https://via.placeholder.com/40x40/2C65F9/FFFFFF?text=N",
    sku: "#CM2341",
    category: "Notebooks",
    currentStock: "150 Pieces",
    price: "₹ 149/-",
    status: "In stock",
  },
];

