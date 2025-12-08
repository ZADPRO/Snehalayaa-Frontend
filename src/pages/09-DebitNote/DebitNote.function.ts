import api from "../../utils/api";
import { baseURL } from "../../utils/helper";

export const fetchDebitNoteData = async (): Promise<any[]> => {
  const response = await api.get(`${baseURL}/admin/products/getDebitNoteList`);
  if (response.data?.status) {
    console.log("response", response);
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch categories");
  }
};
