import { useState, useEffect } from "react";

export const useBreakpoint = (breakpoint: string): boolean => {
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {

    const queries: Record<string, string> = {
      sm: "(min-width: 640px)",
      md: "(min-width: 768px)",
      lg: "(min-width: 1024px)",
      xl: "(min-width: 1280px)",
      "2xl": "(min-width: 1536px)",
    };

    const query = queries[breakpoint] || `(min-width: ${breakpoint})`;
    const media = window.matchMedia(query);

    const listener = () => setIsMatch(media.matches);
    listener();

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [breakpoint]);

  return isMatch;
};
