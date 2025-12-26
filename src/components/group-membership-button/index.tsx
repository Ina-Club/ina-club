"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";


interface GroupMembershipButtonProps {
  type: "request-group" | "active-group";
  id: string;
  onJoinSuccess?: () => void;
  fullWidth?: boolean;
  children?: React.ReactNode;
  isJoined?: boolean;
}

export default function GroupMembershipButton({
  type,
  id,
  onJoinSuccess,
  fullWidth = false,
  children,
  isJoined = false,
}: GroupMembershipButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(isJoined);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  useEffect(() => {
    setHasJoined(isJoined);
  }, [isJoined]);

  const changeMembershipState = async () => {
    // Check if user is authenticated only when joining
    if (!hasJoined && (status === "unauthenticated" || !session)) {
      const currentUrl = encodeURIComponent(window.location.href);
      router.push(`/auth/signin?message=login_required&callbackUrl=${currentUrl}`);
      return;
    }

    setLoading(true);
    setLeaveDialogOpen(false);
    try {
      const endpoint =
        type === "request-group"
          ? `/api/request-groups/${id}/membership`
          : `/api/active-groups/${id}/membership`;

      const response = await fetch(endpoint, {
        method: hasJoined ? "DELETE" : "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || (hasJoined ? "שגיאה בביטול ההרשמה" : "שגיאה בהצטרפות"));
      }

      setHasJoined(!hasJoined);
      // Refresh the page to show updated participants
      if (onJoinSuccess) {
        onJoinSuccess();
      } else {
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Change Membership error:", error);
      alert(hasJoined ? "שגיאה בביטול ההרשמה" : "שגיאה בהצטרפות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={leaveDialogOpen} onClose={() => setLeaveDialogOpen(false)}>
        <DialogTitle>האם אתה בטוח שברצונך לבטל את ההרשמה?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">פעולה זו תסיר אותך מרשימת המעוניינים ותמנע ממך לקבל עדכונים על הבקשה או הקבוצה.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveDialogOpen(false)}>ביטול</Button>
          <Button onClick={changeMembershipState}>אישור</Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        color={hasJoined ? "error" : "primary"}
        fullWidth={fullWidth}
        onClick={hasJoined ? () => setLeaveDialogOpen(true) : changeMembershipState}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          hasJoined ? "בטל הרשמה" : children || (type === "request-group" ? "הצטרף לבקשה" : "הצטרף לקבוצה")
        )}
      </Button>
    </>
  );
}

