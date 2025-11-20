"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, CircularProgress } from "@mui/material";

interface JoinButtonProps {
  type: "request-group" | "active-group";
  id: string;
  onJoinSuccess?: () => void;
  fullWidth?: boolean;
  children?: React.ReactNode;
  isJoined?: boolean;
}

export default function JoinButton({
  type,
  id,
  onJoinSuccess,
  fullWidth = false,
  children,
  isJoined = false,
}: JoinButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(isJoined);

  useEffect(() => {
    setHasJoined(isJoined);
  }, [isJoined]);

  const handleJoin = async () => {
    if (hasJoined) {
      return;
    }

    // Check if user is authenticated
    if (status === "unauthenticated" || !session) {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        type === "request-group"
          ? `/api/request-groups/${id}/join`
          : `/api/active-groups/${id}/join`;

      const response = await fetch(endpoint, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "שגיאה בהצטרפות");
      }

      setHasJoined(true);
      // Refresh the page to show updated participants
      if (onJoinSuccess) {
        onJoinSuccess();
      } else {
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Join error:", error);
      alert(error.message || "שגיאה בהצטרפות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth={fullWidth}
      onClick={handleJoin}
      disabled={loading || hasJoined}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        hasJoined
          ? "כבר הצטרפת"
          : children ||
            (type === "request-group" ? "הצטרף לבקשה" : "הצטרף לקבוצה")
      )}
    </Button>
  );
}

