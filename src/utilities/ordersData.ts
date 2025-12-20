export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerType: string;
  orderType: string;
  totalAmount: string;
  paymentStatus: "Active" | "Inactive";
  orderStatus: "Shipped" | "Not Shipped";
}

export const ordersData: Order[] = [
  {
    id: "1",
    orderId: "ORD-001",
    customerName: "Janardhan",
    customerType: "Public",
    orderType: "Standard",
    totalAmount: "₹ 2,280",
    paymentStatus: "Active",
    orderStatus: "Shipped",
  },
  {
    id: "2",
    orderId: "ORD-002",
    customerName: "Janardhan",
    customerType: "Public",
    orderType: "Express",
    totalAmount: "₹ 1,500",
    paymentStatus: "Inactive",
    orderStatus: "Not Shipped",
  },
  {
    id: "3",
    orderId: "ORD-003",
    customerName: "Janardhan",
    customerType: "Public",
    orderType: "Standard",
    totalAmount: "₹ 3,200",
    paymentStatus: "Active",
    orderStatus: "Shipped",
  },
  {
    id: "4",
    orderId: "ORD-004",
    customerName: "Janardhan",
    customerType: "Public",
    orderType: "Standard",
    totalAmount: "₹ 1,800",
    paymentStatus: "Active",
    orderStatus: "Shipped",
  },
  {
    id: "5",
    orderId: "ORD-005",
    customerName: "Janardhan",
    customerType: "Public",
    orderType: "Express",
    totalAmount: "₹ 2,500",
    paymentStatus: "Inactive",
    orderStatus: "Not Shipped",
  },
  {
    id: "6",
    orderId: "ORD-006",
    customerName: "Janardhan",
    customerType: "Public",
    orderType: "Standard",
    totalAmount: "₹ 1,200",
    paymentStatus: "Active",
    orderStatus: "Shipped",
  },
  {
    id: "7",
    orderId: "ORD-007",
    customerName: "Janardhan",
    customerType: "Public",
    orderType: "Standard",
    totalAmount: "₹ 2,800",
    paymentStatus: "Active",
    orderStatus: "Not Shipped",
  },
];

