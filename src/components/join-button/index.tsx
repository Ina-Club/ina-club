"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, CircularProgress } from "@mui/material";

interface JoinButtonProps {
  type: "request-group" | "active-group";
  id: string;
  onJoinSuccess?: () => void;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export default function JoinButton({
  type,
  id,
  onJoinSuccess,
  fullWidth = false,
  children,
}: JoinButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
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
      disabled={loading}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        children || (type === "request-group" ? "הצטרף לבקשה" : "הצטרף לקבוצה")
      )}
    </Button>
  );
}

