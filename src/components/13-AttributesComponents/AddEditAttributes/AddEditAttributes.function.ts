import axios from "axios";
import { baseURL } from "../../../utils/helper";

// Create Product Field
export const createProductField = async (payload: any) => {
  const response = await axios.post(
    `${baseURL}/admin/settings/product-fields`,
    payload,
    {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    }
  );
  return response.data;
};

// Update Product Field
export const updateProductField = async (id: number, payload: any) => {
  // include the ID in the payload
  const payloadWithId = { ...payload, id };

  const response = await axios.put(
    `${baseURL}/admin/settings/product-fields`,
    payloadWithId,
    {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    }
  );
  return response.data;
};

// Get All Product Fields
export const getAllProductFields = async () => {
  const response = await axios.get(
    `${baseURL}/admin/settings/product-fields/list`,
    {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    }
  );
  return response.data;
};

// Get Single Product Field by ID
export const getProductFieldById = async (id: number) => {
  const response = await axios.get(
    `${baseURL}/admin/settings/product-fields/${id}`,
    {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    }
  );
  return response.data;
};

// Delete Product Field (soft delete)
export const deleteProductField = async (id: number) => {
  const response = await axios.delete(
    `${baseURL}/admin/settings/product-fields/delete/${id}`,
    {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    }
  );
  return response.data;
};
