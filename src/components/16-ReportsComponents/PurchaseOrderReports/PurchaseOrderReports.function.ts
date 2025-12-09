import axios from "axios";
import { baseURLV2 } from "../../../utils/helper";

export const fetchPurchaseOrderReport = async () => {
  const response = await axios.get(`${baseURLV2}/admin/purchaseOrder/getPurchaseOrderReport`, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });

  return response.data;
};
