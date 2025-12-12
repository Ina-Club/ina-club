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

const STORAGE_KEY = "ina-club-favorites";

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

const initialState: FavoritesState = {
  requestGroups: [],
  activeGroups: [],
};

const loadFromStorage = (): FavoritesState => {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as FavoritesState;
    if (!parsed.requestGroups || !parsed.activeGroups) return initialState;
    return parsed;
  } catch (err) {
    console.error("Failed to parse favorites from storage", err);
    return initialState;
  }
};

const saveToStorage = (state: FavoritesState) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save favorites to storage", err);
  }
};

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritesState>(initialState);

  useEffect(() => {
    setFavorites(loadFromStorage());
  }, []);

  useEffect(() => {
    saveToStorage(favorites);
  }, [favorites]);

  const isRequestGroupLiked = useCallback(
    (id: string) => favorites.requestGroups.some((g) => g.id === id),
    [favorites.requestGroups]
  );

  const isActiveGroupLiked = useCallback(
    (id: string) => favorites.activeGroups.some((g) => g.id === id),
    [favorites.activeGroups]
  );

  const toggleRequestGroupLike = useCallback((group: RequestGroup) => {
    setFavorites((prev) => {
      const exists = prev.requestGroups.some((g) => g.id === group.id);
      const requestGroups = exists
        ? prev.requestGroups.filter((g) => g.id !== group.id)
        : [...prev.requestGroups, group];
      return { ...prev, requestGroups };
    });
  }, []);

  const toggleActiveGroupLike = useCallback((group: ActiveGroup) => {
    setFavorites((prev) => {
      const exists = prev.activeGroups.some((g) => g.id === group.id);
      const activeGroups = exists
        ? prev.activeGroups.filter((g) => g.id !== group.id)
        : [...prev.activeGroups, group];
      return { ...prev, activeGroups };
    });
  }, []);

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

