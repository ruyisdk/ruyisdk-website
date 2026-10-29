import { useEffect, useState } from 'react';

/**
 * Custom hook to detect whether the component is running on the client side (after hydration).
 */
export default function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
