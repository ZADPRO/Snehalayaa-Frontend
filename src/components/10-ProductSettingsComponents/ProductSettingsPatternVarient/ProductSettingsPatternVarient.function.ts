import axios from "axios";
import type { IMasterData } from "./ProductSettingsPatternVarient.interface";

const API = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  Authorization: localStorage.getItem("token"),
  "Content-Type": "application/json",
});

/* GET ALL */
export const getMasterList = async (type: string): Promise<IMasterData[]> => {
  const res = await axios.get(`${API}/admin/settings/${type}`, {
    headers: authHeaders(),
  });
  return res.data?.data || [];
};

/* CREATE */
export const createMaster = async (type: string, name: string) => {
  const payload = { name };
  return axios.post(`${API}/admin/settings/${type}`, payload, {
    headers: authHeaders(),
  });
};

/* UPDATE */
export const updateMaster = async (type: string, id: number, name: string) => {
  const payload = { id, name };
  return axios.put(`${API}/admin/settings/${type}`, payload, {
    headers: authHeaders(),
  });
};

/* DELETE */
export const deleteMaster = async (type: string, ids: number[]) => {
  const payload = { ids };
  return axios.delete(`${API}/admin/settings/${type}`, {
    headers: authHeaders(),
    data: payload,
  });
};
