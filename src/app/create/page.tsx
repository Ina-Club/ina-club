"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import RequestGroupCard from "@/components/card/request-group-card";
import { GroupStatus } from "lib/types/status";
import RequestGroupPreview from "@/components/request-group/request-group-preview";
import { LoadingCircle } from "@/components/loading-circle";

interface ValidationErrors {
  title?: string;
  description?: string;
  category?: string;
  duplicate?: string;
}

export default function CreateRequestGroupPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET;
    if (!cloudName || !preset) {
      setError("חסר קונפיגורציה להעלאת תמונות");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", preset);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (data.secure_url) uploaded.push(data.secure_url as string);
      }
      setImageUrls((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
    }
  };

  const verifyUniqueTitle = async () => {
    if (!title.trim()) return true; // Empty title is handled by required validation
    const res = await fetch(`/api/request-groups?title=${encodeURIComponent(title)}`);
    const data = await res.json();
    return !data.exists;
  }

  const canProceedStep1 = async () => {
    const errors: typeof validationErrors = {};
    if (!title.trim()) {
      errors.title = "כותרת היא שדה חובה";
    }
    if (!description.trim()) {
      errors.description = "תיאור הוא שדה חובה";
    }
    if (!categoryId) {
      errors.category = "קטגוריה היא שדה חובה";
    }

    // Check for duplicate title if title is provided
    if (title.trim() && !errors.title) {
      const isUnique = await verifyUniqueTitle();
      if (!isUnique) {
        errors.duplicate = "כותרת זו כבר קיימת במערכת";
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const canProceedStep2 = () => imageUrls.length > 0;

  const handleSubmitFinal = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/request-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          categoryId: categoryId || null,
          imageUrls,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "שגיאה ביצירת בקשה");
      }
      setActiveStep(3);
    } catch (e: any) {
      setError(e.message || "שגיאה");
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Clear validation errors when user starts typing
    if (validationErrors.title) {
      setValidationErrors(prev => ({ ...prev, title: undefined }));
    }
    if (validationErrors.duplicate) {
      setValidationErrors(prev => ({ ...prev, duplicate: undefined }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (validationErrors.description) {
      setValidationErrors(prev => ({ ...prev, description: undefined }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    if (validationErrors.category) {
      setValidationErrors(prev => ({ ...prev, category: undefined }));
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 0 }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, pb: 2, pt: 5 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {["פרטים", "מדיה", "תצוגה מקדימה", "שליחה"].map((label, i) => (
              <Step key={i}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Steps content with live preview side-by-side */}
        <Box
          sx={{
            display: activeStep !== 3 ? "grid" : "flex",
            justifyContent: "center",
            gridTemplateColumns: { xs: "1fr", md: "1fr 380px" },
            gap: 2,
          }}
        >
          <Box>
            {loading ? <LoadingCircle /> :
              activeStep === 0 && (
                <Stack spacing={2}>
                  <TextField
                    label="כותרת"
                    placeholder="לדוגמה: אוזניות גיימינג איכותיות"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    error={!!validationErrors.title || !!validationErrors.duplicate}
                    helperText={validationErrors.title || validationErrors.duplicate}
                    required
                    fullWidth
                  />
                  <Tooltip
                    title="תיאור מפורט משפר את סיכויי האישור"
                    placement="top"
                  >
                    <TextField
                      label="תיאור"
                      placeholder="פרטו את המוצר/שירות, למה הוא חשוב, וכל מידע שיעזור לאשר"
                      value={description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      error={!!validationErrors.description}
                      helperText={validationErrors.description}
                      multiline
                      minRows={5}
                      required
                      fullWidth
                    />
                  </Tooltip>
                  <TextField
                    select
                    label="קטגוריה"
                    value={categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    error={!!validationErrors.category}
                    helperText={validationErrors.category}
                    required
                    fullWidth
                  >
                    {categories.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={async () => {
                        const isValid: boolean = await canProceedStep1();
                        if (isValid) {
                          setActiveStep(1);
                        }
                      }}
                    >
                      הבא
                    </Button>
                  </Box>
                </Stack>
              )}

            {activeStep === 1 && (
              <Stack spacing={2}>
                <Button
                  component="label"
                  variant="outlined"
                  disabled={uploading}
                >
                  {uploading ? "מעלה..." : "העלה תמונות (לפחות אחת)"}
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => await handleUpload(e.target.files)}
                  />
                </Button>
                {/* Reorder by simple move up/down */}
                {imageUrls.map((url, i) => (
                  <Box
                    key={i}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="uploaded"
                      style={{
                        width: 96,
                        height: 64,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <Button
                      size="small"
                      disabled={i === 0}
                      onClick={() =>
                        setImageUrls((prev) => {
                          const arr = [...prev];
                          const t = arr[i - 1];
                          arr[i - 1] = arr[i];
                          arr[i] = t;
                          return arr;
                        })
                      }
                    >
                      למעלה
                    </Button>
                    <Button
                      size="small"
                      disabled={i === imageUrls.length - 1}
                      onClick={() =>
                        setImageUrls((prev) => {
                          const arr = [...prev];
                          const t = arr[i + 1];
                          arr[i + 1] = arr[i];
                          arr[i] = t;
                          return arr;
                        })
                      }
                    >
                      למטה
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() =>
                        setImageUrls((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                    >
                      מחיקה
                    </Button>
                  </Box>
                ))}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="outlined" onClick={() => setActiveStep(0)}>
                    חזור
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!canProceedStep2()}
                    onClick={() => setActiveStep(2)}
                  >
                    הבא
                  </Button>
                </Box>
              </Stack>
            )}

            {activeStep === 2 && (
              <Stack spacing={2}>
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: 2,
                    py: "2px",
                    bgcolor: "#e3e7f5",
                    color: "#1a2a5a",
                    "& .MuiAlert-icon": {
                      color: "#1a2a5a",
                    },
                  }}
                >
                  בדקו שהכל נראה טוב לפני השליחה
                </Alert>
                <RequestGroupPreview
                  title={title}
                  description={description}
                  category={categories.find((c) => c.id === categoryId)?.name}
                  images={imageUrls}
                  participantsCount={1}
                  participantAvatars={[]}
                  status={GroupStatus.OPEN}
                />
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Button variant="outlined" onClick={() => setActiveStep(1)}>
                    חזור
                  </Button>
                  <Button
                    variant="contained"
                    disabled={saving}
                    onClick={handleSubmitFinal}
                  >
                    {saving ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "שלח בקשה"
                    )}
                  </Button>
                </Box>
              </Stack>
            )}

            {activeStep === 3 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  width: "100%",
                  maxWidth: 700,
                  mx: "auto",
                  py: 10,
                  px: 2,
                  textAlign: "center",
                }}
              >
                {/* אייקון הצלחה */}
                <CheckCircleIcon
                  sx={{ fontSize: 100, color: "success.light", mb: 3 }}
                />

                {/* כותרת */}
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  הבקשה נשלחה בהצלחה!
                </Typography>

                {/* מלל מפורט */}
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 600, lineHeight: 1.8 }}
                >
                  תודה על שליחת הבקשה! היא נשלחה למערכת האדמין שלנו לצורך בדיקה
                  ואישור. אנא ודא שהמייל שלך מעודכן, מכיוון שהעדכון על סטטוס
                  הבקשה יישלח אליו. הבקשה נמצאת כבר בפרופיל האישי שלך אך עדיין
                  לא פורסמה לציבור. בתוך 4 ימי עסקים תקבל עדכון למייל עם סטטוס
                  הבקשה.
                </Typography>

                {/* כפתור חזרה לפרופיל */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    sx={{ mt: 4, px: 6, py: 1.5, fontSize: 16 }}
                    onClick={() => router.push("/")}
                  >
                    חזור לדף הבית
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ mt: 4, px: 6, py: 1.5, fontSize: 16 }}
                    onClick={() => router.push("/profile")}
                  >
                    לפרופיל שלי
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* Live preview */}
          {activeStep !== 3 && (
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                p: 2,
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 2,
                alignSelf: "start",
                position: "sticky",
                top: 96,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                תצוגה מקדימה
              </Typography>
              <RequestGroupCard
                requestGroup={{
                  id: "preview",
                  title: title || "כותרת הבקשה",
                  description,
                  category:
                    categories.find((c) => c.id === categoryId)?.name ||
                    "קטגוריה",
                  images: imageUrls.length ? imageUrls : ["/InaClubLogo.png"],
                  participants: [],
                  openedGroups: [],
                  status: GroupStatus.PREVIEW,
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
