import { useEffect, useState } from "react";

import { getAllDares } from "@/data";
import { getCustomDares } from "@/services/storage";
import { Dare } from "@/types";

/**
 * A React hook that loads all available dares (bundled + custom).
 * Useful for mapping dare IDs to dare objects in the UI.
 */
export function useAllDares() {
  const [dares, setDares] = useState<Dare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const custom = await getCustomDares();
        if (mounted) {
          setDares(getAllDares(custom));
        }
      } catch (error) {
        console.error("[useAllDares] Failed to load dares:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return { dares, loading };
}
