import type { InventoryProduct } from "../../../pages/03-Inventory/Inventory.interface";
import api from "../../../utils/api";
import { baseURL } from "../../../utils/helper";

export const fetchInventoryProductBySKU = async (
  barcode: string
): Promise<InventoryProduct> => {
  const response = await api.post(
    `${baseURL}/admin/purchaseOrder/getInventoryProductBySKU`,
    { sku: barcode }
  );

  if (response.data?.status) {
    // ✅ Store token in localStorage if present
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data.data;
  } else {
    throw new Error(response.data?.error || "Failed to fetch product details");
  }
};
