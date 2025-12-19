export interface School {
  id: string;
  logo?: string;
  schoolName: string;
  branch: string;
  location?: string;
  board?: string;
  adminName: string;
  totalBundles: number;
  createdOn: string;
  status: "Active" | "Inactive";
}

export const schoolsData: School[] = [
  {
    id: "1",
    logo: "",
    schoolName: "Delhi Public School",
    branch: "Kondapur",
    location: "Kondapur, Hyderabad",
    board: "CBSE Board",
    adminName: "Janardhan",
    totalBundles: 12,
    createdOn: "12 Dec 2025",
    status: "Active",
  },
  {
    id: "2",
    logo: "",
    schoolName: "Delhi Public School",
    branch: "Madhapur",
    adminName: "Janardhan",
    totalBundles: 12,
    createdOn: "12 Dec 2025",
    status: "Inactive",
  },
  {
    id: "3",
    logo: "",
    schoolName: "Delhi Public School",
    branch: "Madhapur",
    adminName: "Janardhan",
    totalBundles: 12,
    createdOn: "12 Dec 2025",
    status: "Active",
  },
  {
    id: "4",
    logo: "",
    schoolName: "Delhi Public School",
    branch: "Madhapur",
    adminName: "Janardhan",
    totalBundles: 12,
    createdOn: "12 Dec 2025",
    status: "Active",
  },
  {
    id: "5",
    logo: "",
    schoolName: "Delhi Public School",
    branch: "Madhapur",
    adminName: "Janardhan",
    totalBundles: 12,
    createdOn: "12 Dec 2025",
    status: "Active",
  },
  {
    id: "6",
    logo: "",
    schoolName: "Delhi Public School",
    branch: "Madhapur",
    adminName: "Janardhan",
    totalBundles: 12,
    createdOn: "12 Dec 2025",
    status: "Active",
  },
];


