import api from "../../../utils/api";
import { baseURL } from "../../../utils/helper";
import type { RoundOffItem } from "./ProductSettingsRoundOff.interface";

// Fetch all categories
export const fetchRoundOffValues = async (): Promise<RoundOffItem[]> => {
  const response = await api.get(`${baseURL}/admin/settings/round-off`);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch categories");
  }
};
