"use client";

import { RequestGroup } from "lib/dal";
import { GroupStatus } from "lib/types/status";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
    Box,
    Tooltip,
} from "@mui/material";
import { useState } from "react";

interface MinimalRequestGroupCardProps {
    requestGroup: RequestGroup;
}

const MinimalRequestGroupCard: React.FC<MinimalRequestGroupCardProps> = ({ requestGroup }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [reasonDialogOpen, setReasonDialogOpen] = useState(false);

    const isClosed = requestGroup.status === GroupStatus.CLOSED;
    const isCanceled = requestGroup.status === GroupStatus.CANCELED;
    const isExpired = requestGroup.status === GroupStatus.EXPIRED;
    const isPending = requestGroup.status === GroupStatus.PENDING;

    const getStatusDescription = (status: GroupStatus) => {
        switch (status) {
            case 'CLOSED': return "בוצעה עסקה דרך קבוצת רכישה.";
            case 'CANCELED': return "הבקשה לא עמדה בתנאי השימוש של האפליקציה ולכן לא אושרה.";
            case 'EXPIRED': return "תוקף הבקשה הסתיים.";
            case 'PENDING': return "הבקשה ממתינה לאישור."
            default: return "";
        }
    };

    const requestGroupRejectionReason = requestGroup.rejectionReason ?? getStatusDescription(GroupStatus.CANCELED);

    return (
        <Card
            sx={{
                borderRadius: 4,
                boxShadow: 1,
                flex: 1,
                overflowWrap: "anywhere",
                overflow: "hidden",
                transition: "transform 0.25s, box-shadow 0.25s",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
                border: isPending ? 1 : 0,
                borderStyle: isPending ? "dashed" : "solid",
                borderColor: isPending ? "#ff9800" : "transparent",
            }}
        >
            {/* Image Section */}
            <Box sx={{ position: "relative", pt: "50%" }}>
                <CardMedia
                    component="img"
                    image={requestGroup.images[currentImage]}
                    alt={requestGroup.title}
                    sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.6,
                    }}
                />

                {/* Status Chip */}
                <Tooltip
                    title={getStatusDescription(requestGroup.status)}
                    placement="top"
                    arrow
                    slotProps={{
                        tooltip: {
                            sx: {
                                bgcolor: "#1a2a5a",
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 600,
                                borderRadius: 4,
                                boxShadow: 3,
                            },
                        },
                        arrow: {
                            sx: { color: "#1a2a5a" },
                        },
                    }}
                >
                    <Chip
                        label={
                            isCanceled ? "מבוטל" : isExpired ? "פג תוקף" : isPending ? "בתהליך" : "סגור"
                        }
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            fontWeight: 600,
                            color: (isExpired || isPending) ? "black" : "white",
                            bgcolor: isClosed ? "primary.dark" : isExpired ? "#eeeeee" : isCanceled ? "#d32f2f" : isPending ? "#ff9800" : undefined,
                            userSelect: "none",
                        }}
                    />
                </Tooltip>

                {/* Category Chip */}
                <Chip
                    label={requestGroup.category}
                    size="small"
                    sx={{
                        bottom: 8,
                        left: 8,
                        bgcolor: "rgba(255,255,255,0.9)",
                        border: "1px solid",
                        borderColor: "grey.300",
                        color: "grey",
                        position: "absolute",
                        px: 1,
                    }}
                />

                {/* Dots */}
                {requestGroup.images.length > 1 && (
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 8,
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            gap: 0.5,
                        }}
                    >
                        {requestGroup.images.map((_, idx) => (
                            <Box
                                key={idx}
                                onClick={() => setCurrentImage(idx)}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor:
                                        idx === currentImage
                                            ? "primary.main"
                                            : "rgba(255,255,255,0.7)",
                                    cursor: "pointer",
                                    border: "1px solid white",
                                    transition: "background-color 0.3s",
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            {/* Content */}
            <CardContent
                sx={{
                    p: 2,
                    cursor: "default",
                    pointerEvents: "auto",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    noWrap
                    sx={{ opacity: 0.6 }}
                >
                    {requestGroup.title}
                </Typography>

                <Box sx={{ mt: 1, visibility: isCanceled ? "visible" : "hidden" }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                            e.stopPropagation();
                            setReasonDialogOpen(true);
                        }}
                    >
                        למה זה קרה?
                    </Button>
                </Box>
            </CardContent>

            {/* Closed reason dialog */}
            <Dialog open={reasonDialogOpen} onClose={() => setReasonDialogOpen(false)}>
                <DialogTitle>בקשה זו לא מאושרת</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" fontWeight="bold">פירוט</Typography>
                    <Typography variant="body1" color="text.primary">
                        {requestGroupRejectionReason}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReasonDialogOpen(false)} autoFocus>
                        הבנתי
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default MinimalRequestGroupCard;
