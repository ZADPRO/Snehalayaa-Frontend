import axios from "axios";
import { baseURL } from "../../../utils/helper";

export const getProducts = async () => {
  const token = localStorage.getItem("token") || "";

  const response = await axios.get(
    `${baseURL}/admin/settings/settingsProducts`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  if (response.data?.status) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to fetch products");
};
