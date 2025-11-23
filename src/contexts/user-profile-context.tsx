"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import type { ActiveGroup, RequestGroup } from "lib/dal";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  emailVerified?: string;
  enrolledRequestGroups: Array<RequestGroup>;
  enrolledActiveGroups: Array<ActiveGroup>;
  ownedRequestGroups: Array<RequestGroup>;
  ownedActiveGroups: Array<ActiveGroup>;
  pendingRequestGroups: Array<RequestGroup>;
}

type RefreshOptions = {
  force?: boolean;
};

interface UserProfileContextValue {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: (options?: RefreshOptions) => Promise<UserProfile | null>;
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(
  undefined
);

export function UserProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);
  const profileRef = useRef<UserProfile | null>(null);

  const resetProfile = useCallback(() => {
    setProfile(null);
    profileRef.current = null;
    setError(null);
    setLoading(false);
    hasFetchedRef.current = false;
  }, []);

  const refreshProfile = useCallback(
    async ({ force = false }: RefreshOptions = {}) => {
      if (status !== "authenticated" || !session?.user?.email) {
        resetProfile();
        throw new Error("UNAUTHORIZED");
      }

      if (hasFetchedRef.current && !force) {
        return profileRef.current;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/user/profile", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 401) {
            resetProfile();
            throw new Error("UNAUTHORIZED");
          }
          throw new Error("FAILED");
        }

        const data: UserProfile = await response.json();
        setProfile(data);
        profileRef.current = data;
        hasFetchedRef.current = true;
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "שגיאה בטעינת המשתמש";
        if (message === "UNAUTHORIZED") {
          setError("עליך להתחבר כדי לצפות בפרופיל");
        } else {
          setError("שגיאה בטעינת פרטי המשתמש");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [resetProfile, session?.user?.email, status]
  );

  useEffect(() => {
    if (status === "authenticated" && !hasFetchedRef.current) {
      refreshProfile().catch(() => undefined);
    } else if (status === "unauthenticated") {
      resetProfile();
    }
  }, [refreshProfile, resetProfile, status]);

  const value = useMemo(
    () => ({
      profile,
      loading,
      error,
      refreshProfile,
    }),
    [profile, loading, error, refreshProfile]
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error(
      "useUserProfile must be used within a UserProfileProvider"
    );
  }
  return context;
}

