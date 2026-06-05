import API from "./api";

export const getAllFIR = () => API.get("/fir/all");
export const addFIR = (data) => API.post("/fir/add", data);
export const deleteFIR = (id) => API.delete(`/fir/${id}`);
export const updateStatus = (id, status) =>
  API.put(`/fir/${id}/status`, { status });
import { getAllFIR } from "../services/firService";

const fetchFIR = async () => {
  const res = await getAllFIR();
  setFirList(res.data);
};