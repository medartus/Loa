import { useEffect, useState } from "react";

export const useLoading = data => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data.length > 0) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }
  }, [data]);

  return loading;
};
