import axios from "axios";
import { baseURL } from "../../../../utils/helper";
import type { SubCategory } from "./AddEditSubCategories.interface";
import type { Category } from "../../ProductSettingsCategories/ProductSettingsCategories.interface";

export const createSubCategory = async (payload: Partial<SubCategory>) => {
  const response = await axios.post(
    `${baseURL}/admin/settings/subcategories`,
    payload,
    {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    }
  );
  console.log("response.data", response.data);
  return response.data;
};

export const updateSubCategory = async (payload: Partial<SubCategory>) => {
  const response = await axios.put(
    `${baseURL}/admin/settings/subcategories`,
    payload,
    {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    }
  );
  console.log("response.data", response.data);
  return response.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const token = localStorage.getItem("token") || "";
  const response = await axios.get(`${baseURL}/admin/settings/categories`, {
    headers: {
      Authorization: token,
    },
  });

  console.log("response", response);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch categories");
  }
};
