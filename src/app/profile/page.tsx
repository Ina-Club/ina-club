"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  Foundation as FoundationIcon,
  ShoppingBag as ShoppingBagIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { UploadDropzone } from '@/components/upload-dropzone';
import { LoadingCircle } from "@/components/loading-circle";
import RequestGroupCard from "@/components/card/request-group-card";
import { ActiveGroup, RequestGroup } from "lib/dal";
import ActiveGroupCard from "@/components/card/active-group-card";
import { getAvatarInitials } from "lib/utils/avatar";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  emailVerified?: string;
  enrolledRequestGroups: Array<RequestGroup>;
  enrolledActiveGroups: Array<ActiveGroup>;
  ownedRequestGroups: Array<RequestGroup>;
  pendingRequestGroups: Array<RequestGroup>;
}

interface TabPanelProps {
  children?: React.ReactNode;
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

export default function Profile() {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editProfilePicture, setEditProfilePicture] = useState<File[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const signal = AbortSignal.timeout(10000);
        const response = await fetch('/api/user/profile', { signal });
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('UNAUTHORIZED');
          }
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
        setEditName(data.name || '');
      } catch (err) {
        console.log(err);
        if (err instanceof Error && err.name === 'TimeoutError') {
          setError('שגיאה בטעינת הפרופיל');
        } else if (err instanceof Error && err.message === 'UNAUTHORIZED') {
          setError('עליך להתחבר כדי לצפות בפרופיל');
        } else {
          setError('שגיאה בטעינת הפרופיל');
        }
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'loading') {
      return; // Still loading session
    }

    if (status === 'authenticated' && session) {
      fetchProfile();
    } else {
      setError('עליך להתחבר כדי לצפות בפרופיל');
      setLoading(false);
    }
  }, [session, status]);

  const handleEdit = () => {
    setEditing(true);
    setEditName(profile?.name || '');
  };

  const handleCancel = () => {
    setEditing(false);
    setEditName(profile?.name || '');
    setEditProfilePicture([]);
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    try {
      let profilePictureUrl = profile?.profilePicture;
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

      const updatedProfile = await response.json();
      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      setEditing(false);
      setEditProfilePicture([]);
    } catch (err) {
      setError('שגיאה בעדכון הפרופיל');
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
      setError('אנא הקלד "מחק את חשבוני" כדי לאשר');
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

      // Sign out and redirect to home
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      setError('שגיאה במחיקת החשבון. אנא נסה שוב.');
      console.error('Delete account error:', err);
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setDeleteConfirmation('');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <LoadingCircle loadingText={"טוען את הפרופיל שלך"} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">לא נמצא פרופיל משתמש</Alert>
      </Box>
    );
  }

  // Check if user has incomplete profile (no name or password)
  const hasIncompleteProfile = !profile.name || profile.name.trim() === '';

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
              onClick={() => window.location.href = '/auth/complete-profile'}
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
            <Avatar
              sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 } }}
              src={profile.profilePicture}
            >
              {!profile.profilePicture ? getAvatarInitials(profile.name) : null}
              {!profile.profilePicture && !profile.name && <PersonIcon sx={{ fontSize: 40 }} />}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant='h6'
                gutterBottom
                sx={{
                  textAlign: { xs: 'center', md: 'inherit' }
                }}
              >
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <EmailIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                {profile.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <CalendarIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                הצטרף ב-{formatDate(profile.createdAt)}
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
            variant='scrollable'
            sx={{
              borderRight: isMdUp ? 1 : 0,
              borderBottom: !isMdUp ? 1 : 0,
              borderColor: 'divider',
              alignSelf: isMdUp ? 'stretch' : 'auto',
              minWidth: isMdUp ? 220 : 'auto',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: { xs: '0.8rem', md: '0.95rem' },
                justifyContent: 'flex-start',
              },
            }}
          >
            <Tab sx={{ "&:hover": { color: "primary.main" } }} icon={<GroupIcon />} label="קבוצות רכישה" iconPosition="start" />
            <Tab sx={{ "&:hover": { color: "primary.main" } }} icon={<ShoppingBagIcon />} label="בקשות" iconPosition="start" />
            <Tab sx={{ "&:hover": { color: "primary.main" } }} icon={<FoundationIcon />} label="סטטוס בקשות" iconPosition="start" />
          </Tabs>

          {/* Panels */}
          <Box sx={{ flex: 1 }}>
            {/* Active Groups Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant={isMdUp ? "h6" : "subtitle2"} gutterBottom>
                קבוצות פעילות שאתה משתתף בהן ({profile.enrolledActiveGroups.length})
              </Typography>
              {profile.enrolledActiveGroups.length === 0 ? (
                <Alert severity="info">לא הצטרפת לקבוצות רכישה</Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {profile.enrolledActiveGroups.map((activeGroup, index) => (
                    <ActiveGroupCard key={index} activeGroup={activeGroup} />
                  ))}
                </Box>
              )}
            </TabPanel>

            {/* Request Groups Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant={isMdUp ? "h6" : "subtitle2"} gutterBottom>
                בקשות שאתה משתתף בהן ({profile.enrolledRequestGroups.length})
              </Typography>
              {profile.enrolledRequestGroups.length === 0 ? (
                <Alert severity="info">לא הצטרפת לבקשות</Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {profile.enrolledRequestGroups.map((requestGroup, index) => (
                    <RequestGroupCard key={index} requestGroup={requestGroup} />
                  ))}
                </Box>
              )}
            </TabPanel>

            {/* Pending Request Groups Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant={isMdUp ? "h6" : "subtitle2"} gutterBottom>
                בקשות ממתינות לאישור ({profile.pendingRequestGroups.length})
              </Typography>
              {profile.pendingRequestGroups.length === 0 ? (
                <Alert severity="info">אין לך בקשות ממתינות לאישור</Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {profile.pendingRequestGroups.map((requestGroup, index) => (
                    <RequestGroupCard key={index} requestGroup={requestGroup} />
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
