export interface Category {
  categoryName: string;
  productImage?: string;
  totalProducts: number;
  visibility: "Public" | "Private";
  status: "Active" | "Inactive";
}

export const categoriesData: Category[] = [
  // {
  //   categoryName: "Notebooks",
  //   totalProducts: 10,
  //   visibility: "Public",
  //   status: "Active",
  // },
  // {
  //   categoryName: "Pens",
  //   totalProducts: 10,
  //   visibility: "Public",
  //   status: "Active",
  // },
  // {
  //   categoryName: "Pencils",
  //   totalProducts: 10,
  //   visibility: "Public",
  //   status: "Inactive",
  // },
  // {
  //   categoryName: "Erasers",
  //   totalProducts: 10,
  //   visibility: "Public",
  //   status: "Active",
  // },
  // {
  //   categoryName: "Markers",
  //   totalProducts: 10,
  //   visibility: "Public",
  //   status: "Inactive",
  // },
  // {
  //   categoryName: "Scissors",
  //   totalProducts: 10,
  //   visibility: "Public",
  //   status: "Active",
  // },
  // {
  //   categoryName: "Rulers",
  //   totalProducts: 10,
  //   visibility: "Public",
  //   status: "Inactive",
  // },
];

