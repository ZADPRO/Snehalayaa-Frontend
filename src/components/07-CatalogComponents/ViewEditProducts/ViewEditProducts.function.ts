import api from "../../../utils/api";

export const fetchProductDynamicFields = async () => {
  const response = await api.get(`/admin/settings/product-fields`);
  console.log("response", response);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch attributes");
  }
};
