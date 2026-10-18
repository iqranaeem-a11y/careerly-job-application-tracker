import { useEffect, useState } from "react";
import { getErrorMessage } from "../services/api";
import { getStats } from "../services/statsService";
import { JobStats } from "../types/stats";

export const useStats = () => {
  const [stats, setStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((requestError: unknown) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
};
