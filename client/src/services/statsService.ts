import { JobStats } from "../types/stats";
import { api } from "./api";

export const getStats = async () => {
  const { data } = await api.get<{ stats: JobStats }>("/stats");
  return data.stats;
};
