import api from "../../../../utils/api";
import type { Employee } from "./AddEditEmployees.interface";

export const createEmployee = async (payload: Partial<Employee>) => {
  const response = await api.post("/admin/settings/employees", payload);
  console.log("response", response);
  return response.data;
};

export const updateEmployee = async (
  id: number,
  payload: Partial<Employee>
) => {
  console.log("id", id);
  const response = await api.put(`/admin/settings/employees/${id}`, payload);
  console.log("response", response);
  return response.data;
};

export const fetchRoleType = async (): Promise<Employee[]> => {
  const response = await api.get("/admin/settings/employeeRoleType");

  console.log("response", response);
  if (response.data?.status) {
    return response.data.roles;
  } else {
    throw new Error(response.data.message || "Failed to fetch Employee");
  }
};

export const fetchBranch = async (): Promise<Employee[]> => {
  const response = await api.get("/admin/settings/branches");

  console.log("response", response);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch Employee");
  }
};
