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

export interface UserProfileSummary {
  id: string;
  name: string;
  email: string;
  profilePicture?: string | null;
  createdAt: string;
  emailVerified?: string | null;
}

export interface UserProfile extends UserProfileSummary {
  enrolledRequestGroups: Array<RequestGroup>;
  enrolledActiveGroups: Array<ActiveGroup>;
  waitingRequestGroups: Array<RequestGroup>;
}

type RefreshOptions = {
  force?: boolean;
};

interface UserProfileContextValue {
  profile: UserProfileSummary | null;
  fullProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fullLoading: boolean;
  fullError: string | null;
  refreshProfile: (options?: RefreshOptions) => Promise<UserProfileSummary | null>;
  loadFullProfile: (options?: RefreshOptions) => Promise<UserProfile | null>;
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
  const [profile, setProfile] = useState<UserProfileSummary | null>(null);
  const [fullProfile, setFullProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullLoading, setFullLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullError, setFullError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);
  const hasFullFetchedRef = useRef(false);
  const profileRef = useRef<UserProfileSummary | null>(null);
  const fullProfileRef = useRef<UserProfile | null>(null);

  const extractSummary = useCallback(
    (user: UserProfile | null): UserProfileSummary | null => {
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
      };
    },
    []
  );

  const resetProfile = useCallback(() => {
    setProfile(null);
    setFullProfile(null);
    profileRef.current = null;
    fullProfileRef.current = null;
    setError(null);
    setFullError(null);
    setLoading(false);
    setFullLoading(false);
    hasFetchedRef.current = false;
    hasFullFetchedRef.current = false;
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
        const response = await fetch("/api/user/profile?view=summary", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 401) {
            resetProfile();
            throw new Error("UNAUTHORIZED");
          }
          throw new Error("FAILED");
        }

        const data: UserProfileSummary = await response.json();
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

  const loadFullProfile = useCallback(
    async ({ force = false }: RefreshOptions = {}) => {
      if (status !== "authenticated" || !session?.user?.email) {
        resetProfile();
        throw new Error("UNAUTHORIZED");
      }

      if (hasFullFetchedRef.current && !force) {
        return fullProfileRef.current;
      }

      setFullLoading(true);
      setFullError(null);

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
        setFullProfile(data);
        fullProfileRef.current = data;
        hasFullFetchedRef.current = true;

        const summary = extractSummary(data);
        if (summary) {
          setProfile(summary);
          profileRef.current = summary;
          hasFetchedRef.current = true;
        }

        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "שגיאה בטעינת המשתמש";
        if (message === "UNAUTHORIZED") {
          setFullError("עליך להתחבר כדי לצפות בפרופיל");
        } else {
          setFullError("שגיאה בטעינת פרטי המשתמש");
        }
        throw err;
      } finally {
        setFullLoading(false);
      }
    },
    [extractSummary, resetProfile, session?.user?.email, status]
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
      fullProfile,
      loading,
      error,
      fullLoading,
      fullError,
      refreshProfile,
      loadFullProfile,
    }),
    [profile, fullProfile, loading, error, fullLoading, fullError, refreshProfile, loadFullProfile]
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

