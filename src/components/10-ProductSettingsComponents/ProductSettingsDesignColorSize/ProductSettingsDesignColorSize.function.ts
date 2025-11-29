import axios from "axios";
import type { IMasterData } from "./ProductSettingsDesignColorSize.interface";

const API = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  Authorization: localStorage.getItem("token"),
  "Content-Type": "application/json",
});

export const getMasterList = async (type: string): Promise<IMasterData[]> => {
  const res = await axios.get(`${API}/admin/settings/${type}`, {
    headers: authHeaders(),
  });
  return res.data?.data || [];
};

export const createMaster = async (type: string, name: string) => {
  const payload = { name };
  const res = await axios.post(`${API}/admin/settings/${type}`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const updateMaster = async (type: string, id: number, name: string) => {
  const payload = { id, name };
  const res = await axios.put(`${API}/admin/settings/${type}`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deleteMaster = async (type: string, ids: number[]) => {
  const payload = { ids };
  const res = await axios.delete(`${API}/admin/settings/${type}`, {
    headers: authHeaders(),
    data: payload,
  });
  return res.data;
};
