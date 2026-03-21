"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography, FormControlLabel, Checkbox } from "@mui/material";


interface GroupMembershipButtonProps {
  type: "request-group" | "active-group";
  id: string;
  onJoinSuccess?: () => void;
  fullWidth?: boolean;
  children?: React.ReactNode;
  isJoined?: boolean;
  registrationTerms?: string;
}

export default function GroupMembershipButton({
  type,
  id,
  onJoinSuccess,
  fullWidth = false,
  children,
  isJoined = false,
  registrationTerms,
}: GroupMembershipButtonProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const status = isLoaded ? (isSignedIn ? "authenticated" : "unauthenticated") : "loading";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(isJoined);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    setHasJoined(isJoined);
  }, [isJoined]);

  const handleJoinClick = () => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }
    if (registrationTerms) {
      setAgreedToTerms(false);
      setTermsDialogOpen(true);
    } else {
      changeMembershipState();
    }
  };

  const changeMembershipState = async () => {
    // Check if user is authenticated only when joining
    if (!hasJoined && status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    setLeaveDialogOpen(false);
    setTermsDialogOpen(false);
    try {
      const endpoint =
        `/api/active-groups/${id}/membership`;

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
      
      {/* Terms Dialog */}
      <Dialog open={termsDialogOpen} onClose={() => setTermsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>תנאי הרשמה לקבוצה</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, whiteSpace: "pre-line", maxHeight: 300, overflowY: "auto", p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
            {registrationTerms}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                color="primary"
              />
            }
            label="קראתי ואני מסכים/ה לתנאי ההרשמה"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTermsDialogOpen(false)}>ביטול</Button>
          <Button onClick={changeMembershipState} disabled={!agreedToTerms} variant="contained">
            אישור והצטרפות
          </Button>
        </DialogActions>
      </Dialog>

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

