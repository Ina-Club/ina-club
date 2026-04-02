"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton,
  Chip,
} from "@mui/material";
import { Suspense } from "react";
import {
  Edit as EditIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  Foundation as FoundationIcon,
  ShoppingBag as ShoppingBagIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Favorite as FavoriteIcon,
  LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";
import { useState, useEffect, type ReactNode } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { UploadDropzone } from '@/components/upload-dropzone';
import { LoadingCircle } from "@/components/loading-circle";
import ActiveGroupCard from "@/components/card/active-group-card";
import WishItemCard from "@/components/demand-pulse/WishItemCard";
import UserAvatar from "@/components/user-avatar";
import { useUserProfile } from "@/contexts/user-profile-context";
import { useFavorites } from "@/contexts/favorites-context";
import CouponCard from "@/components/card/coupon-card";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function ProfileContent() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const status = isLoaded ? (isSignedIn ? "authenticated" : "unauthenticated") : "loading";
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  // TODO: Handle Clerk's delete account flow.
  const {
    profile: profileSummary,
    fullProfile,
    loading: profileLoading,
    fullLoading,
    error: userError,
    fullError,
    loadFullProfile,
  } = useUserProfile();
  const [pageError, setPageError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editProfilePicture, setEditProfilePicture] = useState<File[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const {
    likedActiveGroups,
    likedWishes,
  } = useFavorites();

  useEffect(() => {
    let isMounted = true;

    const ensureFreshProfile = async () => {
      if (status === 'loading') {
        return;
      }

      setPageLoading(true);
      try {
        await loadFullProfile({ force: true });
        if (isMounted) {
          setPageError(null);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }
        if (err instanceof Error && err.message === 'UNAUTHORIZED') {
          setPageError('עליך להתחבר כדי לצפות בפרופיל');
        } else {
          setPageError('שגיאה בטעינת הפרופיל');
        }
      } finally {
        if (isMounted) {
          setPageLoading(false);
        }
      }
    };

    ensureFreshProfile();

    return () => {
      isMounted = false;
    };
  }, [loadFullProfile, status]);

  useEffect(() => {
    if (profileSummary?.name) {
      setEditName(profileSummary.name);
    }
  }, [profileSummary?.name]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const mapping: Record<string, number> = {
      status: 0,
      requests: 1,
      pending: 2,
      liked: 3,
      coupons: 4,
    };
    if (tabParam && mapping[tabParam] !== undefined) {
      setTabValue(mapping[tabParam]);
    }
  }, [searchParams]);

  const handleEdit = () => {
    setEditing(true);
    setEditName(profileSummary?.name || '');
  };

  const handleCancel = () => {
    setEditing(false);
    setEditName(profileSummary?.name || '');
    setEditProfilePicture([]);
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    try {
      let profilePictureUrl = profileSummary?.profilePicture;
      // If new profile picture uploaded, handle it here
      if (editProfilePicture.length > 0) {
        // Upload to Cloudinary
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET;
        if (cloudName && preset) {
          const formData = new FormData();
          formData.append("file", editProfilePicture[0]);
          formData.append("upload_preset", preset);
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.secure_url) {
            profilePictureUrl = data.secure_url;
          }
        }
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editName,
          profilePictureUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await response.json();
      await loadFullProfile({ force: true });

      setEditing(false);
      setEditProfilePicture([]);
    } catch (err) {
      setPageError('שגיאה בעדכון הפרופיל');
      console.error('Profile update error:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'מחק את חשבוני') {
      setPageError('אנא הקלד "מחק את חשבוני" כדי לאשר');
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Sign out and redirect to home using Clerk
      await signOut();
      router.push('/');
    } catch (err) {
      setPageError('שגיאה במחיקת החשבון. אנא נסה שוב.');
      console.error('Delete account error:', err);
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setDeleteConfirmation('');
    }
  };

  const summaryLoading = status === 'loading' || (profileLoading && !profileSummary);
  const combinedError = pageError || userError || fullError;
  if (combinedError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{combinedError}</Alert>
      </Box>
    );
  }

  if (summaryLoading || !profileSummary) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs: 2, md: 3 } }}>
              <Skeleton variant="circular" width={80} height={80} />
              <Box sx={{ flexGrow: 1, width: '100%' }}>
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="50%" />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' } }}>
                <Skeleton variant="rectangular" height={40} sx={{ flex: 1, borderRadius: 2 }} />
                <Skeleton variant="rectangular" height={40} sx={{ flex: 1, borderRadius: 2 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <Box sx={{ p: 3 }}>
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 2 }} />
            ))}
          </Box>
        </Card>
      </Box>
    );
  }

  if (!profileSummary) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">לא נמצא פרופיל משתמש</Alert>
      </Box>
    );
  }

  // Check if user has incomplete profile (no name or password)
  const detailProfile = fullProfile;
  const detailLoading = pageLoading || fullLoading || !detailProfile;

  const hasIncompleteProfile =
    !profileSummary.name || profileSummary.name.trim() === '';

  const renderTabSkeleton = () => (
    <Box>
      <Skeleton variant="text" width="60%" height={28} sx={{ mb: 2 }} />
      {[...Array(3)].map((_, idx) => (
        <Skeleton
          key={idx}
          variant="rectangular"
          height={isMdUp ? 140 : 120}
          sx={{ borderRadius: 2, mb: 2 }}
        />
      ))}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Incomplete Profile Alert */}
      {hasIncompleteProfile && (
        <Alert
          severity="info"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => router.push('/sign-in')}
            >
              השלם פרופיל
            </Button>
          }
        >
          נראה שעדיין לא השלמת את הפרופיל שלך. השלם את הפרופיל כדי לקבל חוויה מלאה מהפלטפורמה.
        </Alert>
      )}

      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs: 1, md: 3 } }}>
            <UserAvatar
              name={profileSummary.name}
              identifier={profileSummary.email}
              imageUrl={profileSummary.profilePicture}
              sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 } }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant='h6'
                gutterBottom
                sx={{
                  textAlign: { xs: 'center', md: 'inherit' }
                }}
              >
                {profileSummary.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <EmailIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                {profileSummary.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <CalendarIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                הצטרף ב-{formatDate(profileSummary.createdAt)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                disabled={editing}
              >
                ערוך פרופיל
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                מחק חשבון
              </Button>
            </Box>
          </Box>

          <Dialog open={editing} onClose={handleCancel} fullWidth>
            <DialogTitle>עריכת פרטים אישיים</DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="שם מלא"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    תמונת פרופיל
                  </Typography>
                  <UploadDropzone
                    multiple={false}
                    title="העלה תמונת פרופיל"
                    handleFileUpload={setEditProfilePicture}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={updateLoading}
              >
                ביטול
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={updateLoading}
              >
                {updateLoading ? <LoadingCircle loadingText={""} /> : 'שמור'}
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            borderColor: 'divider',
          }}
        >
          {/* Tabs rail */}
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            aria-label="profile tabs"
            orientation={isMdUp ? 'vertical' : 'horizontal'}
            variant={isMdUp ? 'standard' : 'fullWidth'}
            sx={{
              borderRight: isMdUp ? 1 : 0,
              borderBottom: !isMdUp ? 1 : 0,
              borderColor: 'divider',
              width: isMdUp ? 'auto' : '100%',
              minWidth: isMdUp ? 220 : '100%',
              '& .MuiTab-root': {
                fontSize: isMdUp ? '0.95rem' : '0.8rem',
                justifyContent: isMdUp ? "flex-start" : "center",
                minWidth: isMdUp ? undefined : 0,
                height: isMdUp ? "auto" : 80,
                "&:hover": { color: "primary.main" }
              },
            }}
          >
            <Tab
              icon={<FoundationIcon />}
              label={isMdUp ? "הבקשות שלי" : (tabValue === 0 ? "הבקשות שלי" : undefined)}
              iconPosition={isMdUp ? "start" : undefined}
            />
            <Tab
              icon={<ShoppingBagIcon />}
              label={isMdUp ? "חיסכון קבוצתי" : (tabValue === 1 ? "חיסכון קבוצתי" : undefined)}
              iconPosition={isMdUp ? "start" : undefined}
            />
            <Tab
              icon={<GroupIcon />}
              label={isMdUp ? "קבוצות רכישה" : (tabValue === 2 ? "קבוצות רכישה" : undefined)}
              iconPosition={isMdUp ? "start" : undefined}
            />
            <Tab
              icon={<FavoriteIcon />}
              label={isMdUp ? "מועדפים" : (tabValue === 3 ? "מועדפים" : undefined)}
              iconPosition={isMdUp ? "start" : undefined}
            />
            <Tab
              icon={<LocalOfferIcon />}
              label={isMdUp ? "הקופונים שלי" : (tabValue === 4 ? "הקופונים שלי" : undefined)}
              iconPosition={isMdUp ? "start" : undefined}
            />
          </Tabs>
          {/* Panels */}
          <Box sx={{ flex: 1 }}>
            {/* Owned Request Groups Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant={isMdUp ? "h6" : "subtitle2"} gutterBottom>
                הבקשות שפרסמתי ({detailProfile?.wishItems.length ?? 0})
              </Typography>
              {detailLoading
                ? renderTabSkeleton()
                : detailProfile!.wishItems.length === 0
                  ? (
                    <Alert severity="info">עדיין לא פרסמת בקשות</Alert>
                  ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                      {detailProfile!.wishItems.map((wish, index) => (
                        <WishItemCard key={index} item={wish} />
                      ))}
                    </Box>
                  )}
            </TabPanel>

            {/* Request Groups Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant={isMdUp ? "h6" : "subtitle2"} gutterBottom>
                קבוצות רכישה שאתה משתתף בהן ({detailProfile?.enrolledActiveGroups.length ?? 0})
              </Typography>
              {detailLoading
                ? renderTabSkeleton()
                : detailProfile!.enrolledActiveGroups.length === 0
                  ? (
                    <Alert severity="info">לא הצטרפת לקבוצות רכישה</Alert>
                  ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                      {detailProfile!.enrolledActiveGroups.map((activeGroup, index) => (
                        <ActiveGroupCard key={index} activeGroup={activeGroup} />
                      ))}
                    </Box>
                  )}
            </TabPanel>

            {/* Active Groups Tab */}
            {/* Pending Request Groups Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant={isMdUp ? "h6" : "subtitle2"} gutterBottom>
                מידע נוסף יופיע כאן בקרוב
              </Typography>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Typography variant={isMdUp ? "h6" : "subtitle2"} gutterBottom>
                בקשות שסימנת ({likedWishes.length})
              </Typography>
              {likedWishes.length === 0 ? (
                <Alert severity="info">עוד לא סימנת בקשות שאהבת</Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {likedWishes.map((wish) => (
                    <WishItemCard key={wish.id} item={wish} />
                  ))}
                </Box>
              )}

              <Typography variant={isMdUp ? "h6" : "subtitle2"} gutterBottom sx={{ mt: 3 }}>
                קבוצות רכישה שסימנת ({likedActiveGroups.length})
              </Typography>
              {likedActiveGroups.length === 0 ? (
                <Alert severity="info">עוד לא סימנת קבוצות רכישה שאהבת</Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {likedActiveGroups.map((activeGroup) => (
                    <ActiveGroupCard key={activeGroup.id} activeGroup={activeGroup} />
                  ))}
                </Box>
              )}
            </TabPanel>

            {/* Coupons Tab */}
            <TabPanel value={tabValue} index={4}>
              <Typography variant={isMdUp ? "h6" : "subtitle2"} gutterBottom>
                הקופונים שלי ({detailProfile?.coupons?.length ?? 0})
              </Typography>
              {detailLoading
                ? renderTabSkeleton()
                : !detailProfile?.coupons?.length
                  ? (
                    <Alert severity="info">עדיין אין לך קופונים. הצטרף לקבוצה כדי לקבל קופון!</Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {detailProfile.coupons.map((coupon) => (
                        <CouponCard key={coupon.id} coupon={coupon} />
                      ))}
                    </Box>
                  )}
            </TabPanel>
          </Box>
        </Box>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#dc2626' }}>
          <WarningIcon sx={{ fontSize: 48, mb: 1 }} />
          מחיקת חשבון
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
            האם אתה בטוח שברצונך למחוק את החשבון שלך?
          </Typography>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>שים לב:</strong> פעולה זו בלתי הפיכה. כל הנתונים שלך, כולל:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0 }}>
              <li>פרטי הפרופיל האישי</li>
              <li>השתתפות בקבוצות רכישה</li>
              <li>בקשות שיצרת</li>
              <li>היסטוריית הפעילות</li>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              יימחקו לצמיתות ולא ניתן יהיה לשחזר אותם.
            </Typography>
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            אנא הקלד "<strong>מחק את חשבוני</strong>" כדי לאשר:
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            placeholder="מחק את חשבוני"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            disabled={deleteLoading || deleteConfirmation !== 'מחק את חשבוני'}
            startIcon={deleteLoading ? <LoadingCircle loadingText="" /> : <DeleteIcon />}
          >
            {deleteLoading ? 'מוחק...' : 'מחק חשבון'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={<Box sx={{ p: 3 }}><Skeleton variant="rectangular" height={180} /></Box>}>
      <ProfileContent />
    </Suspense>
  );
}
