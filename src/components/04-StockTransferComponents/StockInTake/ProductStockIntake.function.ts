import api from "../../../utils/api";
import { baseURL } from "../../../utils/helper";

export const fetchStockIntakeList = async () => {
  try {
    const response = await api.get(
      `${baseURL}/admin/products/stock-transfer/list`
    );

    if (response.data?.status) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "Failed to load stock intake list"
      );
    }
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const fetchStockTransferItems = async (id: number) => {
  try {
    const response = await api.get(
      `${baseURL}/admin/products/stock-transfer/items/${id}`
    );
    if (response.data?.status) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "Failed to load stock intake list"
      );
    }
  } catch (err: any) {
    throw new Error(err.message);
  }
};
