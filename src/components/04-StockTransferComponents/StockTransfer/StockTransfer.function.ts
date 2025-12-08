import api from "../../../utils/api";
import { baseURL } from "../../../utils/helper";

export const checkSKUInGRN = async (
  fromBranchId: number,
  sku: string
): Promise<any> => {
  const response = await api.post(`${baseURL}/admin/products/check-sku-grn`, {
    fromBranchId,
    sku,
  });

  return response.data;
};

export const transferStock = async (payload: any) => {
  const response = await api.post(
    `${baseURL}/admin/products/new-stock-transfer`,
    payload
  );
  return response.data;
};

export const checkSKUOnlyGRN = async (sku: string) => {
  const res = await api.post(`${baseURL}/admin/products/check-sku-only-grn`, {
    sku,
  });

  return res.data;
};

export const createDebitNote = async (payload: any) => {
  const res = await api.post(
    `${baseURL}/admin/products/createDebitNote`,
    payload
  );

  return res.data;
};
