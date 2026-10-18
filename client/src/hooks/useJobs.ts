import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../services/api";
import { getJobs } from "../services/jobService";
import { Job, JobFilters } from "../types/job";

export const useJobs = (filters: JobFilters) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setJobs(await getJobs(filters));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.status, filters.from, filters.to]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { jobs, setJobs, loading, error, refresh };
};
