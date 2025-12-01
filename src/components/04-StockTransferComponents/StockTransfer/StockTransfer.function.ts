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
