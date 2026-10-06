import { useEffect, useState } from "react";
import { ApiError } from "../services/api";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  options?: { skip?: boolean },
): UseFetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options?.skip);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options?.skip) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
