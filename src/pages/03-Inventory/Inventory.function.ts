import api from "../../utils/api";
import { baseURL } from "../../utils/helper";
import type { InventoryProduct } from "./Inventory.interface";

// Fetch all categories
export const fetchAllInventoryProducts = async (): Promise<InventoryProduct[]> => {
  const response = await api.get(`${baseURL}/admin/purchaseOrder/getInventoryList`);
  console.log("response", response);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch categories");
  }
};
