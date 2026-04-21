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
import type { ActiveGroup, } from "@/lib/dal";
import { useAuth } from "@clerk/nextjs";
import { useSnackbar } from "@/contexts/snackbar-context";
import type { WishItemData } from "@/components/demand-pulse/WishItemCard";

type FavoritesState = {
  wishes: WishItemData[];
  activeGroups: ActiveGroup[];
};

type FavoritesContextValue = {
  likedWishes: WishItemData[];
  likedActiveGroups: ActiveGroup[];
  isActiveGroupLiked: (id: string) => boolean;
  isWishLiked: (id: string) => boolean;
  toggleActiveGroupLike: (group: ActiveGroup) => void;
  toggleWishLike: (wish: WishItemData) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

const initialState: FavoritesState = {
  wishes: [],
  activeGroups: [],
};

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const status = isLoaded ? (isSignedIn ? "authenticated" : "unauthenticated") : "loading";
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
          if (data && Array.isArray(data.wishItems) && Array.isArray(data.activeGroups)) {
            setFavorites({
              wishes: data.wishItems,
              activeGroups: data.activeGroups,
            });
          }
        })
        .catch((err) => console.error("Failed to load user's liked groups", err));
    } else if (status === "unauthenticated") {
      setFavorites(initialState);
    }
  }, [status]);

  const isWishLiked = useCallback(
    (id: string) => favorites.wishes.some((w) => w.id === id),
    [favorites.wishes]
  );

  const isActiveGroupLiked = useCallback(
    (id: string) => favorites.activeGroups.some((g) => g.id === id),
    [favorites.activeGroups]
  );

  const toggleWishLike = useCallback(async (wish: WishItemData) => {
    if (status !== "authenticated") {
      showSnackbar("עליך להתחבר כדי לשמור מועדפים", "warning");
      return;
    }

    const isLiked = favorites.wishes.some((w) => w.id === wish.id);
    const method = isLiked ? "DELETE" : "PUT";

    setFavorites((prev) => {
      const wishes = isLiked ? prev.wishes.filter((w) => w.id !== wish.id) : [...prev.wishes, wish];
      return { ...prev, wishes };
    });

    try {
      const res = await fetch(`/api/likes/wish-items/${wish.id}`, { method });
      if (!res.ok) {
        throw new Error(`Failed to ${method} like wish`);
      }
    } catch (err) {
      console.error("Like toggle failed, rolling back", err);
      showSnackbar("שגיאה בעדכון המועדפים", "error");

      setFavorites((prev) => {
        const wishes = isLiked
          ? [...prev.wishes, wish]
          : prev.wishes.filter((w) => w.id !== wish.id);
        return { ...prev, wishes };
      });
    }
  }, [favorites.wishes, status, showSnackbar]);

  const toggleActiveGroupLike = useCallback(async (group: ActiveGroup) => {
    if (status !== "authenticated") {
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
      likedWishes: favorites.wishes,
      likedActiveGroups: favorites.activeGroups,
      isWishLiked,
      isActiveGroupLiked,
      toggleWishLike,
      toggleActiveGroupLike,
    }),
    [
      favorites.activeGroups,
      favorites.wishes,
      isActiveGroupLiked,
      isWishLiked,
      toggleActiveGroupLike,
      toggleWishLike,
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
