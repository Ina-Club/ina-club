"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ActiveGroup, RequestGroup } from "@/lib/dal";
import { useSession } from "next-auth/react";
import { useSnackbar } from "@/contexts/snackbar-context";

type FavoritesState = {
  requestGroups: RequestGroup[];
  activeGroups: ActiveGroup[];
};

type FavoritesContextValue = {
  likedRequestGroups: RequestGroup[];
  likedActiveGroups: ActiveGroup[];
  isRequestGroupLiked: (id: string) => boolean;
  isActiveGroupLiked: (id: string) => boolean;
  toggleRequestGroupLike: (group: RequestGroup) => void;
  toggleActiveGroupLike: (group: ActiveGroup) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

const initialState: FavoritesState = {
  requestGroups: [],
  activeGroups: [],
};

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<FavoritesState>(initialState);
  const { showSnackbar } = useSnackbar();

  // Fetch likes from backend when user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/likes")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user's liked groups");
          return res.json();
        })
        .then((data) => {
          if (data && Array.isArray(data.requestGroups) && Array.isArray(data.activeGroups)) {
            setFavorites({
              requestGroups: data.requestGroups,
              activeGroups: data.activeGroups,
            });
          }
        })
        .catch((err) => console.error("Failed to load user's liked groups", err));
    } else if (status === "unauthenticated") {
      setFavorites(initialState);
    }
  }, [status]);

  const isRequestGroupLiked = useCallback(
    (id: string) => favorites.requestGroups.some((g) => g.id === id),
    [favorites.requestGroups]
  );

  const isActiveGroupLiked = useCallback(
    (id: string) => favorites.activeGroups.some((g) => g.id === id),
    [favorites.activeGroups]
  );

  const toggleRequestGroupLike = useCallback(async (group: RequestGroup) => {
    if (status !== "authenticated") {
      console.error("User is not authenticated");
      showSnackbar("עליך להתחבר כדי לשמור מועדפים", "warning");
      return;
    }

    // 1. Determine action
    const isLiked = favorites.requestGroups.some((g) => g.id === group.id);
    const method = isLiked ? "DELETE" : "PUT";

    // 2. Optimistic local update
    setFavorites((prev) => {
      const requestGroups = isLiked ? prev.requestGroups.filter((g) => g.id !== group.id) : [...prev.requestGroups, group];
      return { ...prev, requestGroups };
    });

    // 3. API call
    try {
      const res = await fetch(`/api/likes/request-groups/${group.id}`, { method });
      if (!res.ok) {
        throw new Error(`Failed to ${method} like request group`);
      }
    } catch (err) {
      console.error("Like toggle failed, rolling back", err);
      showSnackbar("שגיאה בעדכון המועדפים", "error");

      // 4. Rollback on failure
      setFavorites((prev) => {
        // Revert to previous state
        const requestGroups = isLiked
          ? [...prev.requestGroups, group] // We removed it, add it back
          : prev.requestGroups.filter((g) => g.id !== group.id); // We added it, remove it
        return { ...prev, requestGroups };
      });
    }
  }, [favorites.requestGroups, status, showSnackbar]);

  const toggleActiveGroupLike = useCallback(async (group: ActiveGroup) => {
    if (status !== "authenticated") {
      console.error("User is not authenticated");
      showSnackbar("עליך להתחבר כדי לשמור מועדפים", "warning");
      return;
    }

    const isLiked = favorites.activeGroups.some((g) => g.id === group.id);
    const method = isLiked ? "DELETE" : "PUT";

    setFavorites((prev) => {
      const activeGroups = isLiked
        ? prev.activeGroups.filter((g) => g.id !== group.id)
        : [...prev.activeGroups, group];
      return { ...prev, activeGroups };
    });

    try {
      const res = await fetch(`/api/likes/active-groups/${group.id}`, { method });
      if (!res.ok) {
        throw new Error(`Failed to ${method} like`);
      }
    } catch (err) {
      console.error("Like toggle failed, rolling back", err);
      showSnackbar("שגיאה בעדכון המועדפים", "error");

      setFavorites((prev) => {
        const activeGroups = isLiked
          ? [...prev.activeGroups, group]
          : prev.activeGroups.filter((g) => g.id !== group.id);
        return { ...prev, activeGroups };
      });
    }
  }, [favorites.activeGroups, status, showSnackbar]);

  const value = useMemo(
    () => ({
      likedRequestGroups: favorites.requestGroups,
      likedActiveGroups: favorites.activeGroups,
      isRequestGroupLiked,
      isActiveGroupLiked,
      toggleRequestGroupLike,
      toggleActiveGroupLike,
    }),
    [
      favorites.activeGroups,
      favorites.requestGroups,
      isActiveGroupLiked,
      isRequestGroupLiked,
      toggleActiveGroupLike,
      toggleRequestGroupLike,
    ]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
