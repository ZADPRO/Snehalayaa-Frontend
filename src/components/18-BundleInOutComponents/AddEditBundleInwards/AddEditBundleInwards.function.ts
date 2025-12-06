import axios from "axios";
import { baseURL } from "../../../utils/helper";

export const createBundle = async (payload: any): Promise<any> => {
  const token = localStorage.getItem("token") || "";

  const response = await axios.post(
    `${baseURL}/admin/products/createBundle`,
    payload,
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const updateBundle = async (payload: any): Promise<any> => {
  const token = localStorage.getItem("token") || "";

  const response = await axios.put(
    `${baseURL}/admin/products/updateBundle`,
    payload,
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
