import axios from "axios";
import { baseURL, baseURLV2 } from "../../../utils/helper";
import type {
  Branch,
  Category,
  SubCategory,
  Supplier,
} from "./PurchaseOrderCreate.interface";
import api from "../../../utils/api";

export const fetchSupplier = async (): Promise<Supplier[]> => {
  const response = await axios.get(`${baseURL}/admin/suppliers/read`, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });

  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch Supplier");
  }
};

export const fetchBranch = async (): Promise<Branch[]> => {
  const response = await api.get(`${baseURLV2}/admin/settings/branches`);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch Branch");
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get(`${baseURL}/admin/settings/categories`);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch categories");
  }
};

export const fetchSubCategories = async (): Promise<SubCategory[]> => {
  const token = localStorage.getItem("token") || "";
  const response = await axios.get(`${baseURL}/admin/settings/subcategories`, {
    headers: {
      Authorization: token,
    },
  });

  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch subcategories");
  }
};
