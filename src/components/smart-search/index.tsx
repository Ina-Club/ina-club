import { Alert, Box, Container, Typography } from "@mui/material"
import { Suspense } from "react"
import GroupSectionSkeleton from "../skeleton/group-section-skeleton"
import RequestGroupCard from "../card/request-group-card"
import ActiveGroupCard from "../card/active-group-card"
import { ActiveGroup, RequestGroup } from "@/lib/dal"

interface SmartSearchComponentProps {
    errorAi: string | null;
    displayedActiveGroups: ActiveGroup[];
    displayedRequestGroups: RequestGroup[];
}

export const SmartSearchComponent: React.FC<SmartSearchComponentProps> = ({
    errorAi, displayedActiveGroups, displayedRequestGroups
}) => {
    return (
        // Two-column results: left Active, right Requests
        <Container maxWidth="lg" sx={{ mb: 6 }}>
            {errorAi && <Alert severity="error" sx={{ mb: 2 }}>{errorAi}</Alert>}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
                    gap: { xs: 3, md: 6 },
                    alignItems: "start",
                }}
            >
                {/* Active Groups (left) */}
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            color: "primary.main",
                            letterSpacing: 2,
                            fontWeight: 700,
                        }}
                    >
                        קבוצות מתאימות
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: { xs: 2, md: 4 },
                            mt: 1
                        }}
                    >
                        <Suspense fallback={<GroupSectionSkeleton />}>
                            {displayedActiveGroups?.length > 0 ? (
                                displayedActiveGroups.map((ag, i) => (
                                    <ActiveGroupCard key={i} activeGroup={ag} />
                                ))
                            ) : (
                                <Typography color="text.secondary">
                                    לא נמצאו קבוצות פעילות מתאימות
                                </Typography>
                            )}
                        </Suspense>
                    </Box>
                </Box>

                {/* Divider */}
                <Box
                    aria-hidden
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        py: { xs: 1, md: 1 },
                        height: "100%"
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            width: { xs: "100%", md: "2px" },
                            height: { xs: "2px", md: "100%" },
                            minHeight: { md: 220 },
                            bgcolor: "divider",
                            borderRadius: 999,
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                display: { xs: "flex", md: "none" },
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                px: 1,
                                fontWeight: 600,
                                letterSpacing: 2,
                                textTransform: "uppercase",
                                bgcolor: "background.paper",
                                color: "text.secondary",
                                transform: {
                                    xs: "translate(-50%, -50%)",
                                    md: "translate(-50%, -50%) rotate(-90deg)",
                                },
                                borderRadius: 999,
                            }}
                        >
                            המשיכו לגלות
                        </Typography>
                    </Box>
                </Box>

                {/* Request Groups (right) */}
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            color: "secondary.main",
                            letterSpacing: 2,
                            fontWeight: 700,
                        }}
                    >
                        בקשות מתאימות
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: { xs: 2, md: 4 },
                            mt: 1
                        }}
                    >
                        <Suspense fallback={<GroupSectionSkeleton />}>
                            {displayedRequestGroups?.length > 0 ? (
                                displayedRequestGroups.map((rg, i) => (
                                    <RequestGroupCard key={i} requestGroup={rg} />
                                ))
                            ) : (
                                <Typography color="text.secondary">
                                    לא נמצאו בקשות מתאימות
                                </Typography>
                            )}
                        </Suspense>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}
