import { useEffect, useState } from "react";
import { getUserLocation, PointGeo } from "@/app/lib/locations";

export function useUserLocation(): {
  location: PointGeo | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
} {
  const [location, setLocation] = useState<PointGeo | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;
    getUserLocation()
      .then((loc) => {
        if (!ignore) setLocation(loc);
      })
      .catch((err) => {
        if (!ignore)
          setError(err instanceof Error ? err : new Error(String(err)));
      });
    return () => {
      ignore = true;
    };
  }, [trigger]);

  const loading = !location && !error;
  const refresh = () => {
    setLocation(null);
    setError(null);
    setTrigger((t) => t + 1);
  };

  return { location, loading, error, refresh };
}

export function useLocations<T>(
  location: PointGeo | null,
  fetchFn: (location: PointGeo) => Promise<T[]>,
) {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!location) return;
    let ignore = false;
    fetchFn(location)
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err : new Error(err));
      });
    return () => {
      ignore = true;
    };
  }, [location, fetchFn]);

  const loading = !!location && !data && !error;

  return { data, loading, error };
}
