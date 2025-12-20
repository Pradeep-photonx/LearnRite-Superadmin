export interface Customer {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  customerType: string;
  orders: number;
  status: "Active" | "Inactive";
}

export const customersData: Customer[] = [
  {
    id: "1",
    customerName: "Janardhan",
    email: "janardhan@gmail.com",
    phone: "+91 9876543210",
    customerType: "Public",
    orders: 3,
    status: "Active",
  },
  {
    id: "2",
    customerName: "Janardhan",
    email: "janardhan@gmail.com",
    phone: "+91 9876543210",
    customerType: "Public",
    orders: 3,
    status: "Inactive",
  },
  {
    id: "3",
    customerName: "Janardhan",
    email: "janardhan@gmail.com",
    phone: "+91 9876543210",
    customerType: "Public",
    orders: 3,
    status: "Active",
  },
  {
    id: "4",
    customerName: "Janardhan",
    email: "janardhan@gmail.com",
    phone: "+91 9876543210",
    customerType: "Public",
    orders: 3,
    status: "Active",
  },
  {
    id: "5",
    customerName: "Janardhan",
    email: "janardhan@gmail.com",
    phone: "+91 9876543210",
    customerType: "Public",
    orders: 3,
    status: "Active",
  },
  {
    id: "6",
    customerName: "Janardhan",
    email: "janardhan@gmail.com",
    phone: "+91 9876543210",
    customerType: "Public",
    orders: 3,
    status: "Active",
  },
  {
    id: "7",
    customerName: "Janardhan",
    email: "janardhan@gmail.com",
    phone: "+91 9876543210",
    customerType: "Public",
    orders: 3,
    status: "Active",
  },
];


