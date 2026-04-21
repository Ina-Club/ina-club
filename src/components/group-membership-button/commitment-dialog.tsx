"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  TextField,
  CircularProgress,
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { LoadingCircle } from "../loading-circle";

const REGISTRATION_TERMS = `בשמירת פרטי אשראי אלה, אנו מבטיחים כי המשתתפים מחויבים לתהליך במעמד השלמת הרכישה על ידי העסק.
כרטיסך יחויב בדמי ביטול על סך {penaltyAmount} ש"ח בלבד באחד משני המקרים הבאים:
• במידה ותבטל את הרשמתך לאחר אישור הקבוצה.
• במידה ולא תממש את הקנייה במועד שנקבע.`;

interface CommitmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitPaymentDetails: (
    cardNumber: string,
    expiry: string,
    cvv: string
  ) => Promise<void>;
}

export default function CommitmentDialog({
  open,
  onClose,
  onSubmitPaymentDetails,
}: CommitmentDialogProps) {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [penaltyAmount, setPenaltyAmount] = useState<number | null>(null);

  useEffect(() => {
    if (open && penaltyAmount === null) {
      fetch("/api/penalty-fee")
        .then((res) => res.json())
        .then((data) => {
          if (data.fee !== undefined) {
            setPenaltyAmount(data.fee);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch penalty fee", err);
          setPenaltyAmount(50);
        });
    }
    if (!open) {
      setPenaltyAmount(null);
    }
  }, [open, penaltyAmount]);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleNext = () => {
    if (agreed) setStep(2);
  };

  const handleSubmit = async () => {
    if (!cardNumber || !expiry || !cvv) return;

    setLoading(true);
    try {
      await onSubmitPaymentDetails(cardNumber, expiry, cvv);
      setStep(3);
    } catch (error) {
      console.error("Token submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setStep(1);
    setAgreed(false);
    setCardNumber("");
    setExpiry("");
    setCvv("");
    onClose();
  };

  const stepTitles: Record<number, string> = {
    1: "הסכם התחייבות הקבוצה",
    2: "פרטי אשראי להתחייבות",
    3: "הצטרפת בהצלחה!",
  };

  return (
    <Dialog
      open={open}
      onClose={step === 3 ? handleClose : loading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>{stepTitles[step]}</DialogTitle>

      <DialogContent dividers sx={{ minHeight: 200 }}>
        {penaltyAmount === null && step !== 3 ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <LoadingCircle loadingText="טוען..."/>
          </Box>
        ) : step === 1 ? (
          <Box>
            <Typography variant="body1">
              על מנת להשתתף בקבוצה זו, עליך להסכים לתנאים הבאים:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", maxHeight: 300, overflowY: "auto", p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
              {REGISTRATION_TERMS.split('{penaltyAmount} ש"ח')[0]}
              <strong style={{ textDecoration: "underline" }}>
                {penaltyAmount} ש"ח
              </strong>
              {REGISTRATION_TERMS.split('{penaltyAmount} ש"ח')[1]}
            </Typography>

            <Box mt={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                }
                label="קראתי ואני מסכים/ה לתנאי ההרשמה, לתנאי ההתחייבות ולמדיניות החיוב."
              />
            </Box>
          </Box>
        ) : step === 2 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              לצורך אימות בלבד. (זהו רכיב הדגמה MVP בלבד)
            </Typography>
            <TextField
              label="מספר כרטיס"
              variant="outlined"
              fullWidth
              disabled={loading}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="0000 0000 0000 0000"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="תוקף"
                variant="outlined"
                fullWidth
                disabled={loading}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
              />
              <TextField
                label="CVV"
                variant="outlined"
                fullWidth
                disabled={loading}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
              />
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, py: 2 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "success.main" }} />
            <Typography variant="h6" textAlign="center">
              הצטרפת לקבוצה בהצלחה!
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              קוד ההנחה שלך יווצר ויוצג בפרופיל האישי שלך ברגע שהקבוצה תופעל על ידי העסק.
            </Typography>

            <Chip
              label="הקופון יישמר בפרופיל שלך ← הקופונים שלי"
              color="success"
              variant="outlined"
              size="small"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {step === 3 ? (
          <Button onClick={handleClose} variant="contained">
            סגור
          </Button>
        ) : (
          <>
            <Button onClick={handleClose} disabled={loading} color="inherit">
              ביטול
            </Button>
            {step === 1 ? (
              <Button onClick={handleNext} disabled={!agreed || penaltyAmount === null} variant="contained">
                המשך
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!cardNumber || !expiry || !cvv || loading}
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                אישור השתתפות
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
