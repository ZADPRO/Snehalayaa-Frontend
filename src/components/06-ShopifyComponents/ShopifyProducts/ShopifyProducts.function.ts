import axios from "axios";
import { baseURLV2 } from "../../../utils/helper";

export const createShopifyProduct = async (payload: any) => {
  const response = await axios.post(`${baseURLV2}/shopify/products`, payload, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
