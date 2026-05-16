"use client";

import { useEffect, useRef, useState } from "react";

import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Collapse,
  Typography,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import confetti from "canvas-confetti";

import ShekelIcon from "../shekel-icon";

interface UserStatus {
  isSignedIn: boolean;
  canSubmitWishItem: boolean;
  wishItemViolationBlocked: boolean;
  wishItemQuotaReached: boolean;
  remainingWishItems: number;
}

interface WishItemComposerProps {
  onPosted: () => void;
}

export default function WishItemComposer({
  onPosted,
}: WishItemComposerProps) {
  const { isSignedIn } = useAuth();

  const router = useRouter();

  const textRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");

  const [price, setPrice] = useState("");

  const [showPrice, setShowPrice] = useState(false);

  const [loading, setLoading] = useState(false);

  const [focused, setFocused] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const [categories, setCategories] = useState<
    { id: string; name: string }[]
  >([]);

  const [categoryId, setCategoryId] = useState("");

  const [userStatus, setUserStatus] =
    useState<UserStatus | null>(null);

  const [statusLoading, setStatusLoading] =
    useState(true);

  const [dialog, setDialog] = useState<{
    open: boolean;

    type:
    | "terms"
    | "success"
    | "blocked"
    | "violation"
    | null;

    title?: string;

    description?: string;
  }>({
    open: false,
    type: null,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch(() => { });
  }, []);

  const refreshUserStatus = async () => {
    try {
      const res = await fetch("/api/user-status");

      const data = await res.json();

      setUserStatus(data);
    } catch { }
  };

  useEffect(() => {
    if (!isSignedIn) {
      setStatusLoading(false);

      return;
    }

    setStatusLoading(true);

    refreshUserStatus().finally(() => {
      setStatusLoading(false);
    });
  }, [isSignedIn]);

  const isBlocked =
    statusLoading ||
    !userStatus ||
    !userStatus.canSubmitWishItem;

  const isViolationBlocked =
    userStatus?.wishItemViolationBlocked;

  const isQuotaBlocked =
    userStatus?.wishItemQuotaReached;

  const defaultPlaceholder =
    "מה אתם רוצים לקנות? (לדוג׳: מחפש AirPods Pro באזור 120 ש״ח)";

  const blockedPlaceholder = statusLoading
    ? defaultPlaceholder
    : isViolationBlocked
      ? "זיהינו תוכן שלא עומד בכללי הקהילה — ניתן לפרסם שוב בעוד שבוע"
      : isQuotaBlocked
        ? "הגעת למכסת הבקשות היומית — ניתן לפרסם שוב מחר"
        : defaultPlaceholder;

  const dialogPaperStyle = {
    borderRadius: "22px",

    width: "100%",

    maxWidth: "480px",

    boxShadow:
      "0 24px 80px rgba(15,23,42,0.18)",

    border:
      "1px solid rgba(15,23,42,0.06)",
  };

  if (!isSignedIn) {
    return (
      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          gap: 1.5,

          p: "12px 16px",

          borderRadius: "14px",

          border:
            "1.5px dashed rgba(0,0,0,0.12)",

          cursor: "pointer",

          background:
            "linear-gradient(-135deg,#ffffff,#f8fbff)",

          transition: "0.2s",

          "&:hover": {
            bgcolor:
              "rgba(66,100,212,0.05)",
          },
        }}
        onClick={() =>
          router.push("/sign-in")
        }
      >
        <Box
          sx={{
            width: 32,

            height: 32,

            borderRadius: "50%",

            bgcolor:
              "rgba(66,100,212,0.12)",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",
          }}
        >
          ✦
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          <Typography
            component="span"
            variant="body2"
            color="primary.main"
            fontWeight={700}
          >
            התחבר
          </Typography>{" "}
          כדי לפרסם מה אתה מחפש
        </Typography>
      </Box>
    );
  }

  const fireConfetti = () => {
    confetti({
      particleCount: 150,

      spread: 70,

      origin: { y: 0.7 },

      colors: [
        "#1a2a5a",
        "#3b5cc4",
        "#f0a500",
        "#ffffff",
      ],
    });
  };

  const openTermsDialog = () => {
    if (
      !text.trim() ||
      loading ||
      isBlocked
    ) {
      return;
    }

    setTermsAccepted(false);

    setDialog({
      open: true,

      type: "terms",
    });
  };

  const closeDialog = () => {
    setDialog({
      open: false,

      type: null,
    });
  };

  const handleConfirmSubmit =
    async () => {
      if (!termsAccepted) return;

      setLoading(true);

      try {
        const res = await fetch(
          "/api/wish-items",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              text: text.trim(),

              targetPrice: price
                ? parseFloat(price)
                : undefined,

              categoryId:
                categoryId || undefined,
            }),
          }
        );

        const data = await res.json();

        await refreshUserStatus();

        if (res.ok) {
          setText("");

          setPrice("");

          setCategoryId("");

          setShowPrice(false);

          onPosted();

          fireConfetti();

          setDialog({
            open: true,

            type: "success",

            title:
              "הבקשה פורסמה בהצלחה",

            description:
              "הבקשה שלך פורסמה לקהילה.",
          });
        } else if (res.status === 409) {
          setDialog({
            open: true,

            type: "blocked",

            title: "לא ניתן לפרסם",

            description:
              "בקשה דומה כבר קיימת במערכת.",
          });
        } else if (res.status === 429) {
          setDialog({
            open: true,

            type: "blocked",

            title:
              "הגעת למכסה היומית",

            description:
              "אפשר לפרסם שוב מחר.",
          });
        } else if (
          res.status === 422 ||
          res.status === 403
        ) {
          setDialog({
            open: true,

            type: "violation",

            title:
              "הבקשה לא אושרה",

            description:
              data.reason ||
              "הבקשה לא עומדת בכללי הקהילה.",
          });
        } else {
          setDialog({
            open: true,

            type: "blocked",

            title: "אירעה שגיאה",

            description:
              "נסה שוב בעוד מספר רגעים.",
          });
        }
      } catch {
        setDialog({
          open: true,

          type: "blocked",

          title: "אירעה שגיאה",

          description:
            "נסה שוב בעוד מספר רגעים.",
        });
      } finally {
        setLoading(false);
      }
    };

  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      openTermsDialog();
    }
  };

  return (
    <>
      <Box sx={{ position: "relative", width: "100%" }}>
        {!statusLoading && userStatus && (
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              top: -24,
              right: 8,
              color: "text.secondary",
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            ניתן לפרסם עד 2 בקשות ביום {userStatus.remainingWishItems !== undefined ? `(נותרו ${userStatus.remainingWishItems})` : ""}
          </Typography>
        )}
        <Box
        sx={{
          borderRadius: "16px",
          
          border: isBlocked
            ? "1.5px solid rgba(0,0,0,0.08)"
            : focused
              ? "1.5px solid rgba(66,100,212,0.45)"
              : "1.5px solid rgba(0,0,0,0.1)",

          bgcolor: "#fff",

          boxShadow:
            focused && !isBlocked
              ? "0 0 0 4px rgba(66,100,212,0.08)"
              : "none",

          transition: "0.2s",

          overflow: "hidden",

          p: "6px 8px 6px 12px",

          pointerEvents:
            statusLoading
              ? "none"
              : "auto",
        }}
      >
        <TextField
          inputRef={textRef}
          fullWidth
          multiline
          maxRows={3}
          disabled={isBlocked}
          placeholder={
            blockedPlaceholder
          }
          value={text}
          onChange={(e) => {
            if (!isBlocked) {
              setText(
                e.target.value.slice(
                  0,
                  200
                )
              );
            }
          }}
          onFocus={() => {
            if (!isBlocked) {
              setFocused(true);
            }
          }}
          onBlur={() =>
            setFocused(false)
          }
          onKeyDown={handleKeyDown}
          variant="standard"
          InputProps={{
            disableUnderline: true,

            endAdornment: (
              <InputAdornment position="end">
                <Box
                  sx={{
                    display: "flex",

                    alignItems: "center",

                    gap: 0.5,
                  }}
                >
                  {!isBlocked && (
                    <IconButton
                      size="small"
                      onClick={() =>
                        setShowPrice(
                          (p) => !p
                        )
                      }
                      sx={{
                        color:
                          showPrice
                            ? "primary.main"
                            : "text.disabled",
                      }}
                    >
                      <ShekelIcon />
                    </IconButton>
                  )}

                  <Button
                    size="small"
                    variant="contained"
                    disabled={
                      !text.trim() ||
                      loading ||
                      isBlocked
                    }
                    onClick={
                      openTermsDialog
                    }
                    sx={{
                      minWidth: 0,

                      px: 1.5,

                      py: 0.5,

                      borderRadius:
                        "10px",

                      fontSize:
                        "0.82rem",

                      fontWeight: 700,

                      boxShadow: "none",
                    }}
                    endIcon={
                      loading ? (
                        <CircularProgress
                          size={12}
                          color="inherit"
                        />
                      ) : (
                        <SendIcon
                          sx={{
                            fontSize:
                              "14px !important",
                          }}
                        />
                      )
                    }
                  >
                    שלח
                  </Button>
                </Box>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiInputBase-input": {
              fontSize: "0.92rem",

              color: isBlocked
                ? "text.disabled"
                : "text.primary",
            },
          }}
        />

        {!isBlocked && (
          <Collapse in={showPrice}>
            <Box
              sx={{
                display: "flex",

                gap: 2,

                mt: 1,

                pt: 1,

                borderTop:
                  "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <TextField
                fullWidth
                type="number"
                placeholder="מחיר יעד"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value
                  )
                }
                variant="standard"
                size="small"
                InputProps={{
                  disableUnderline: true,

                  startAdornment: (
                    <InputAdornment position="start">
                      <ShekelIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl
                variant="standard"
                sx={{
                  minWidth: 130,
                }}
              >
                <Select
                  displayEmpty
                  value={categoryId}
                  onChange={(e) =>
                    setCategoryId(
                      e.target.value
                    )
                  }
                  disableUnderline
                >
                  <MenuItem
                    value=""
                    disabled
                  >
                    <em>
                      קטגוריה
                      (אופציונלי)
                    </em>
                  </MenuItem>

                  {categories.map(
                    (cat) => (
                      <MenuItem
                        key={cat.id}
                        value={
                          cat.id
                        }
                      >
                        {cat.name}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Box>
          </Collapse>
        )}
      </Box>
      </Box>

      <Dialog
        open={
          dialog.open &&
          dialog.type === "terms"
        }
        onClose={closeDialog}
        PaperProps={{
          sx: dialogPaperStyle,
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,

            fontSize: "1.2rem",

            textAlign: "left",

            pb: 2,
          }}
        >
          אישור פרסום בקשה
        </DialogTitle>

        <Divider />

        <DialogContent
          sx={{
            pt: 3,
          }}
        >
          <Typography
            sx={{
              color: "#334155",

              lineHeight: 1.9,

              mb: 2,

              fontSize: "0.95rem",
            }}
          >
            נשארו לך{" "}
            <strong>
              {userStatus?.remainingWishItems ??
                0}
            </strong>{" "}
            בקשות להיום.
          </Typography>

          <Box
            sx={{
              bgcolor:
                "rgba(248,250,252,0.9)",

              border:
                "1px solid rgba(15,23,42,0.06)",

              borderRadius: "14px",

              p: 2,
            }}
          >
            <Typography
              sx={{
                color: "#64748b",

                lineHeight: 1.8,

                fontSize: "0.9rem",
              }}
            >
              אין לפרסם תוכן
              פוגעני, פרטים אישיים,
              מספרי טלפון, מיילים
              או תוכן שאינו עומד
              בכללי הקהילה.
            </Typography>
          </Box>

          <FormControlLabel
            sx={{
              mt: 2,

              alignItems:
                "flex-start",

              mr: 0,
            }}
            control={
              <Checkbox
                checked={
                  termsAccepted
                }
                onChange={(e) =>
                  setTermsAccepted(
                    e.target.checked
                  )
                }
              />
            }
            label={
              <Typography
                sx={{
                  fontSize:
                    "0.92rem",
                  mt: 1,
                  color: "#0f172a",
                }}
              >
                אני מאשר/ת שהתוכן
                עומד בכללים
              </Typography>
            }
          />
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            px: 3,

            py: 2,
          }}
        >
          <Button
            onClick={closeDialog}
            sx={{
              color: "#64748b",
            }}
          >
            ביטול
          </Button>

          <Button
            variant="contained"
            disabled={
              !termsAccepted ||
              loading
            }
            onClick={
              handleConfirmSubmit
            }
          >
            {loading ? (
              <CircularProgress
                size={20}
                color="inherit"
              />
            ) : (
              "המשך"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={
          dialog.open &&
          dialog.type !== "terms"
        }
        onClose={closeDialog}
        PaperProps={{
          sx: dialogPaperStyle,
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,

            fontSize: "1.15rem",

            textAlign: "left",
          }}
        >
          {dialog.title}
        </DialogTitle>

        <Divider />

        <DialogContent
          sx={{
            pt: 3,
          }}
        >
          <Typography
            sx={{
              color: "#475569",

              lineHeight: 1.9,

              fontSize: "0.95rem",
            }}
          >
            {dialog.description}
          </Typography>
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            px: 3,

            py: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={closeDialog}
          >
            הבנתי
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}