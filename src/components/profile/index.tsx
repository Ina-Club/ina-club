"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Chip,
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
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  Foundation as FoundationIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useSession } from "next-auth/react";
import { UploadDropzone } from '@/components/upload-dropzone';
import { LoadingCircle } from "../loading-circle";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  emailVerified?: string;
  enrolledRequestGroups: Array<{
    id: string;
    title: string;
    description?: string;
    category?: string;
    status: string;
    createdAt: string;
    joinedAt: string;
    images: string[];
  }>;
  enrolledActiveGroups: Array<{
    id: string;
    title: string;
    description?: string;
    category?: string;
    company?: string;
    basePrice: number;
    groupPrice: number;
    minParticipants?: number;
    maxParticipants?: number;
    deadline: string;
    status: string;
    createdAt: string;
    joinedAt: string;
    images: string[];
  }>;
  ownedRequestGroups: Array<{
    id: string;
    title: string;
    description?: string;
    category?: string;
    status: string;
    createdAt: string;
    images: string[];
  }>;
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
  // const { data: session } = useSession();
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
  const mockedUser: UserProfile = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "https://via.placeholder.com/150",
    createdAt: "2021-01-01",
    emailVerified: "2021-01-01",
    enrolledRequestGroups: [],
    enrolledActiveGroups: [],
    ownedRequestGroups: [],
  };

  // TODO: Replace this with API integration that fetches the profile
  useEffect(() => {
    setProfile(mockedUser);
    setEditName(mockedUser.name);
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const signal = AbortSignal.timeout(10000);
  //       const response = await fetch('/api/user/profile', { signal });
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch profile');
  //       }
  //       const data = await response.json();
  //       setProfile(data);
  //       setEditName(data.name || '');
  //     } catch (err) {
  //       console.log(err);
  //       if (err instanceof Error && err.name === 'TimeoutError') {
  //         setError('שגיאה בטעינת הפרופיל');
  //       }
  //       else {
  //         setError('שגיאה בטעינת הפרופיל');
  //       }
  //       console.error('Profile fetch error:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (session) {
  //     fetchProfile();
  //   }
  //   else {
  //     setError('עליך להתחבר כדי לצפות בפרופיל');
  //     setLoading(false);
  //   }
  // }, [session]);

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
        // For now, we'll use the first image URL from the uploaded file
        // In a real app, you'd upload to a storage service
        profilePictureUrl = URL.createObjectURL(editProfilePicture[0]);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'success';
      case 'CLOSED': return 'default';
      case 'CANCELED': return 'error';
      case 'EXPIRED': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN': return 'פתוח';
      case 'CLOSED': return 'סגור';
      case 'CANCELED': return 'מבוטל';
      case 'EXPIRED': return 'פג תוקף';
      default: return status;
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

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs: 1, md: 3 } }}>
            <Avatar
              sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 } }}
              src={profile.profilePicture}
            >
              <PersonIcon sx={{ fontSize: 40 }} />
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
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              disabled={editing}
              sx={{ marginTop: { xs: 2 } }}
            >
              ערוך פרופיל
            </Button>
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
            <Tab icon={<GroupIcon />} label="קבוצות רכישה" iconPosition="start" />
            <Tab icon={<ShoppingBagIcon />} label="בקשות" iconPosition="start" />
            <Tab icon={<FoundationIcon />} label="סטטוס בקשות" iconPosition="start" />
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
                  {profile.enrolledActiveGroups.map((group) => (
                    <Card key={group.id} sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" noWrap sx={{ flexGrow: 1, mr: 1 }}>
                            {group.title}
                          </Typography>
                          <Chip
                            label={getStatusText(group.status)}
                            color={getStatusColor(group.status) as any}
                            size="small"
                          />
                        </Box>
                        {group.category && (
                          <Chip
                            label={group.category}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        )}
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {group.company}
                        </Typography>
                        <Typography variant="h6" color="primary.main" gutterBottom>
                          ₪{group.groupPrice.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          הצטרף ב-{formatDate(group.joinedAt)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          תאריך יעד: {formatDate(group.deadline)}
                        </Typography>
                      </CardContent>
                    </Card>
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
                  {profile.enrolledRequestGroups.map((group) => (
                    <Card key={group.id} sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" noWrap sx={{ flexGrow: 1, mr: 1 }}>
                            {group.title}
                          </Typography>
                          <Chip
                            label={getStatusText(group.status)}
                            color={getStatusColor(group.status) as any}
                            size="small"
                          />
                        </Box>
                        {group.category && (
                          <Chip
                            label={group.category}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        )}
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {group.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          הצטרף ב-{formatDate(group.joinedAt)}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </TabPanel>

            {/* Owned Request Groups Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant={isMdUp ? "h6" : "subtitle2"} gutterBottom>
                בקשות שאתה פתחת ({profile.enrolledRequestGroups.length})
              </Typography>
              {profile.enrolledRequestGroups.length === 0 ? (
                <Alert severity="info">עדיין לא יצרת בקשות</Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {profile.enrolledRequestGroups.map((group) => (
                    <Card key={group.id} sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" noWrap sx={{ flexGrow: 1, mr: 1 }}>
                            {group.title}
                          </Typography>
                          <Chip
                            label={getStatusText(group.status)}
                            color={getStatusColor(group.status) as any}
                            size="small"
                          />
                        </Box>
                        {group.category && (
                          <Chip
                            label={group.category}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        )}
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {group.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          הצטרף ב-{formatDate(group.joinedAt)}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </TabPanel>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
