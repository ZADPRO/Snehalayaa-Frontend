import axios from "axios";
import { baseURL } from "../../../../utils/helper";

export const createProduct = async (payload: any): Promise<any> => {
  const token = localStorage.getItem("token") || "";

  const response = await axios.post(
    `${baseURL}/admin/settings/settingsProducts`,
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

export const updateProduct = async (payload: any): Promise<any> => {
  const token = localStorage.getItem("token") || "";

  const response = await axios.put(
    `${baseURL}/admin/settings/settingsProducts`,
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
