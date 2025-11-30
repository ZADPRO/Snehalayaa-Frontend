import axios from "axios";
import { baseURL } from "../../../utils/helper";
import type { PurchaseOrderListItem } from "./PurchaseOrderList.interface";

export const fetchPurchaseOrderList = async (): Promise<
  PurchaseOrderListItem[]
> => {
  const response = await axios.get(
    `${baseURL}/admin/purchaseOrder/getOurchaseOrder`,
    {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    }
  );

  if (response.data?.status) {
    console.log("response", response);
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch Supplier");
  }
};

export const showToastMsg = (
  toastRef: any,
  severity: any,
  summary: string,
  detail: string
) => {
  toastRef.current?.show({ severity, summary, detail, life: 2500 });
};
