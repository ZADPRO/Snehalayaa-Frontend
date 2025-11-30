import axios from "axios";
import { baseURL } from "../../../../utils/helper";

export interface GRNItemPayload {
  sNo: number;
  lineNo: string;
  refNo: string;
  cost: number;
  profitPercent: number;
  total: number;

  design: { id: any; name: string };
  pattern: { id: any; name: string };
  variant: { id: any; name: string };
  color: { id: any; name: string };
  size: { id: any; name: string };

  productId: number;
  productName: string;
}

export interface GRNPayload {
  poId: number;
  supplierId: number;
  branchId: number;
  items: GRNItemPayload[];
}

export const createGRN = async (payload: GRNPayload): Promise<any> => {
  const response = await axios.post(
    `${baseURL}/admin/purchaseOrder/createGRN`,
    payload,
    {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    }
  );

  if (response.data?.status) {
    return response.data;
  } else {
    throw new Error(response.data.message || "Failed to create GRN");
  }
};

export const fetchGRNList = async (): Promise<any[]> => {
  const response = await axios.get(`${baseURL}/admin/purchaseOrder/grn/list`, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });

  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to load GRN list");
  }
};

export const fetchSingleGRN = async (id: number): Promise<any> => {
  const response = await axios.get(`${baseURL}/admin/purchaseOrder/grn/${id}`, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });

  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to load GRN");
  }
};
