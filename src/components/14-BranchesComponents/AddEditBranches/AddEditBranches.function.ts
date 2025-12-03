import axios from "axios";
import { baseURLV2 } from "../../../utils/helper";
import type { Branch } from "./AddEditBranches.interface";

export const createBranch = async (payload: Partial<Branch>) => {
  const response = await axios.post(
    `${baseURLV2}/admin/settings/branches`,
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

export const updateBranch = async (payload: Partial<Branch>) => {
  if (!payload.refBranchId) {
    throw new Error("Branch ID is required for update");
  }

  const response = await axios.put(
    `${baseURLV2}/admin/settings/branches/${payload.refBranchId}`, // 👈 pass ID in URL
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
