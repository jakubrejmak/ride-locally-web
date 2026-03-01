export type PointGeo = {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
};

export function getUserLocation() {
  if (!("geolocation" in navigator)) {
    throw new Error("Geolocation is not supported by your browser.");
  }

  const location: Promise<PointGeo> = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracyMeters: pos.coords.accuracy,
        });
      },
      (err) => reject(err),
    );
  });

  return location;
}
