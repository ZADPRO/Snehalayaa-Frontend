import api from "../../utils/api";
import type { Attribute, AttributePayload, dataType } from "./Attributes.interface";

export const saveAttributeAPI = async (payload: AttributePayload) => {
  const response = await api.post(`/admin/settings/attributes`, payload);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to save attribute");
  }
};

export const fetchDataType = async (): Promise<dataType[]> => {
  const response = await api.get(`/admin/settings/attributesDataType`);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch dataType");
  }
};

export const fetchAttribute = async (): Promise<Attribute[]> => {
  const response = await api.get(`/admin/settings/product-fields`);
  console.log("response", response);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch attributes");
  }
};

export const updateAttributeAPI = async (payload: AttributePayload) => {
  try {
    const response = await api.put(`/admin/settings/attributes`, payload);
    if (response.data?.status) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to update attribute");
    }
  } catch (error: any) {
    throw new Error(error.message || "API request failed");
  }
};

export const deleteAttributeAPI = async (attributeId: number) => {
  try {
    const response = await api.post(`/admin/settings/attributesHide`, {
      attributeId,
    });
    if (response.data?.status) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to delete attribute");
    }
  } catch (error: any) {
    throw new Error(error.message || "API request failed");
  }
};
