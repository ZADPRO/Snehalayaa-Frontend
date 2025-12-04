import api from "../../utils/api";
import { baseURL } from "../../utils/helper";

export const scanSKUService = async (sku: string) => {
  const payload = { sku };

  const response = await api.post(
    `${baseURL}/admin/purchaseOrder/scanSKU`,
    payload
  );

  console.log("SCAN SKU RESPONSE:", response.data);

  return response.data;
};
