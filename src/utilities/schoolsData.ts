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
];


