"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CommitmentDialog from "./commitment-dialog";
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Typography } from "@mui/material";


interface GroupMembershipButtonProps {
  type: "active-group";
  id: string;
  onJoin?: () => void;
  onLeave?: () => void;
  fullWidth?: boolean;
  children?: React.ReactNode;
  isJoined?: boolean;
}

export default function GroupMembershipButton({
  type,
  id,
  onJoin,
  onLeave,
  fullWidth = false,
  children,
  isJoined = false,
}: GroupMembershipButtonProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const status = isLoaded ? (isSignedIn ? "authenticated" : "unauthenticated") : "loading";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(isJoined);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [commitmentDialogOpen, setCommitmentDialogOpen] = useState(false);
  const [pendingJoinCallback, setPendingJoinCallback] = useState(false);

  useEffect(() => {
    setHasJoined(isJoined);
  }, [isJoined]);

  const handleJoinClick = () => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }
    changeMembershipState();
  };

  // TODO: Fix avatar list not updating right after join button finishes loading
  const changeMembershipState = async (cardNumber?: string, expiry?: string, cvv?: string) => {
    // Check if user is authenticated only when joining
    if (!hasJoined && status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }

    if (!hasJoined && type === "active-group" && (!cardNumber || !expiry || !cvv)) {
      setCommitmentDialogOpen(true);
      return;
    }

    setLeaveDialogOpen(false);
    if (hasJoined) setLoading(true);
    try {
      const endpoint =
        `/api/active-groups/${id}/membership`;

      const payload = hasJoined ? undefined : { cardNumber, expiry, cvv };

      const response = await fetch(endpoint, {
        method: hasJoined ? "DELETE" : "POST",
        headers: hasJoined ? undefined : { "Content-Type": "application/json" },
        body: payload ? JSON.stringify(payload) : undefined,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || (hasJoined ? "שגיאה בביטול ההרשמה" : "שגיאה בהצטרפות"));
      }

      const joining = !hasJoined;
      setHasJoined(joining);

      if (joining) {
        // Defer participant list update until user closes the coupon dialog
        setPendingJoinCallback(true);
      } else {
        onLeave?.();
      }

      return data.coupon ?? null;
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
          <Typography variant="body2" gutterBottom>פעולה זו תסיר אותך מרשימת המעוניינים ותמנע ממך לקבל עדכונים על הבקשה או הקבוצה.</Typography>
          <Typography variant="body2" color="error" fontWeight="bold" sx={{ mt: 1 }}>
            שים לב: ביטול ההרשמה לאחר אישור הקבוצה יגרור חיוב של דמי הביטול כפי שהוסכם (מימוש התחייבות).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveDialogOpen(false)} disabled={loading}>ביטול</Button>
          <Button
            onClick={() => changeMembershipState()}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {loading ? "מבטל..." : "אישור"}
          </Button>
        </DialogActions>
      </Dialog>
      <CommitmentDialog
        open={commitmentDialogOpen}
        onClose={() => {
          setCommitmentDialogOpen(false);
          if (pendingJoinCallback) {
            setPendingJoinCallback(false);
            onJoin?.();
          }
        }}
        onSubmitPaymentDetails={async (cardNumber, expiry, cvv) => {
          return await changeMembershipState(cardNumber, expiry, cvv);
        }}
      />

      <Button
        variant="contained"
        color={hasJoined ? "error" : "primary"}
        fullWidth={fullWidth}
        onClick={hasJoined ? () => setLeaveDialogOpen(true) : handleJoinClick}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          hasJoined ? "בטל הרשמה" : children || "הצטרף לקבוצה"
        )}
      </Button>
    </>
  );
}
