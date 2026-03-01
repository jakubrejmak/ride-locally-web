import { useEffect, useState } from "react";

export function useAsyncData<TParam, TResult>(
  param: TParam | null,
  fetchFn: (param: TParam) => Promise<TResult[]>,
) {
  const [data, setData] = useState<TResult[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!param) return;
    let ignore = false;
    fetchFn(param)
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err : new Error(err));
      });
    return () => {
      ignore = true;
    };
  }, [param, fetchFn]);

  const loading = !!param && !data && !error;

  return { data, loading, error };
}
