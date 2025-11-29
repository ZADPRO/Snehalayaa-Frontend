import api from "../../../../utils/api";
import type { Category } from "../ProductSettingsCategories.interface";

export const createCategory = async (payload: Partial<Category>) => {
  const response = await api.post("/admin/settings/categories", payload);
  console.log("response", response);
  return response.data;
};

export const updateCategory = async (payload: Partial<Category>) => {
  const response = await api.put("/admin/settings/categories", payload);
  return response.data;
};
