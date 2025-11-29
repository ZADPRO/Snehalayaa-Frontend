import axios from "axios";
import { baseURL } from "../../../../utils/helper";
import type { Supplier } from "./AddEditSuppliers.interface";

export const createSupplier = async (payload: Partial<Supplier>) => {
  const response = await axios.post(
    `${baseURL}/admin/suppliers/create`,
    payload,
    {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    }
  );
  console.log("response.data", response.data);
  return response.data;
};

export const updateSupplier = async (payload: Partial<Supplier>) => {
  const response = await axios.put(
    `${baseURL}/admin/suppliers/update`,
    payload,
    {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    }
  );
  console.log("response.data", response.data);
  return response.data;
};
