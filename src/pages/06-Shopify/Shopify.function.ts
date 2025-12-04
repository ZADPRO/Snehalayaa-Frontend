import axios from "axios";
import { baseURL } from "../../utils/helper";

export const fetchShopifyProducts = async () => {
  const response = await axios.get(
    `${baseURL}/admin/purchaseOrder/getPOSInventoryList`,
    {
      headers: { Authorization: localStorage.getItem("token") || "" },
    }
  );

  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.error || "Failed to fetch Shopify products");
  }
};
