import api from "../../../../utils/api";
import type { RoundOff } from "./AddEditRoundOff.interface";

export const createRoundOff = async (payload: RoundOff) => {
  const response = await api.post("/admin/settings/round-off", payload);
  return response.data;
};

export const updateRoundOff = async (payload: RoundOff) => {
  const response = await api.put("/admin/settings/round-off", payload);
  return response.data;
};
