export interface Bundle {
  id: string;
  bundleName: string;
  bundleId: string;
  secondLanguage: string;
  totalItems: number;
  createdOn: string;
  price: string;
  status: "Active" | "Inactive";
  schoolId: string;
  schoolName?: string;
  classGrade?: string;
}

export const bundlesData: Bundle[] = [
  // {
  //   id: "1",
  //   bundleName: "Grade 10",
  //   bundleId: "DLP-1042",
  //   secondLanguage: "Hindi",
  //   totalItems: 15,
  //   createdOn: "12 Dec 2025",
  //   price: "₹ 2,280/-",
  //   status: "Active",
  //   schoolId: "1",
  //   schoolName: "Delhi Public School",
  //   classGrade: "Grade 10",
  // },
  // {
  //   id: "2",
  //   bundleName: "Grade 9",
  //   bundleId: "DLP-1043",
  //   secondLanguage: "Telugu",
  //   totalItems: 12,
  //   createdOn: "10 Dec 2025",
  //   price: "₹ 2,100/-",
  //   status: "Inactive",
  //   schoolId: "1",
  //   schoolName: "Delhi Public School",
  //   classGrade: "Grade 9",
  // },
  // {
  //   id: "3",
  //   bundleName: "Grade 8",
  //   bundleId: "DLP-1044",
  //   secondLanguage: "Hindi",
  //   totalItems: 18,
  //   createdOn: "15 Dec 2025",
  //   price: "₹ 2,450/-",
  //   status: "Active",
  //   schoolId: "2",
  //   schoolName: "Delhi Public School",
  //   classGrade: "Grade 8",
  // },
  // {
  //   id: "4",
  //   bundleName: "Grade 11",
  //   bundleId: "DLP-1045",
  //   secondLanguage: "Tamil",
  //   totalItems: 20,
  //   createdOn: "11 Dec 2025",
  //   price: "₹ 2,600/-",
  //   status: "Active",
  //   schoolId: "1",
  //   schoolName: "Delhi Public School",
  //   classGrade: "Grade 11",
  // },
  // {
  //   id: "5",
  //   bundleName: "Grade 7",
  //   bundleId: "DLP-1046",
  //   secondLanguage: "Hindi",
  //   totalItems: 14,
  //   createdOn: "14 Dec 2025",
  //   price: "₹ 1,950/-",
  //   status: "Active",
  //   schoolId: "3",
  //   schoolName: "Delhi Public School",
  //   classGrade: "Grade 7",
  // },
  // {
  //   id: "6",
  //   bundleName: "Grade 12",
  //   bundleId: "DLP-1047",
  //   secondLanguage: "Kannada",
  //   totalItems: 22,
  //   createdOn: "13 Dec 2025",
  //   price: "₹ 2,800/-",
  //   status: "Active",
  //   schoolId: "2",
  //   schoolName: "Delhi Public School",
  //   classGrade: "Grade 12",
  // },
];

