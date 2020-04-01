import { useEffect, useState } from "react";

export const useLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      setLocation(userLocation);
    });
  }, [setLocation]);

  return location;
};
