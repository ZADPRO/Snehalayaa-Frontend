import axios from "axios";
import { baseURL } from "../../../utils/helper";
import type { Employee } from "./ViewDeleteEmployees.interface";

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/employees`, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });

  console.log("response", response);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch Employee");
  }
};

export const deleteEmployee = async (
  RefUserId: number,
  forceDelete: boolean = false
): Promise<any> => {
  const token = localStorage.getItem("token") || "";
  const url = `${baseURL}/admin/settings/employees/${RefUserId}${
    forceDelete ? "?forceDelete=true" : ""
  }`;

  const response = await axios.delete(url, {
    headers: { Authorization: token },
  });

  console.log("response", response);
  return response.data;
};
