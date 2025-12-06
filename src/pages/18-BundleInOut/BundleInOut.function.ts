import api from "../../utils/api";
import { baseURL } from "../../utils/helper";
import type { BundleInwardItem } from "./BundleInOut.interface";

export const fetchBundleData = async (): Promise<BundleInwardItem[]> => {
  const response = await api.get(`${baseURL}/admin/products/getBundle`);
  if (response.data?.status) {
    console.log("response", response);
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch categories");
  }
};
