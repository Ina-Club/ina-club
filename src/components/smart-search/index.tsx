import { Box, Card, Container, Typography } from "@mui/material"
import { Suspense } from "react"
import GroupSectionSkeleton from "../skeleton/group-section-skeleton"
import RequestGroupCardSkeleton from "../skeleton/request-group-card-skeleton"
import RequestGroupCard from "../card/request-group-card"
import ActiveGroupCard from "../card/active-group-card"
import ActiveGroupCardSkeleton from "../skeleton/active-group-card-skeleton"
import { ActiveGroup, RequestGroup } from "@/lib/dal"

interface SmartSearchComponentProps {
    errorActive: string | null;
    errorRequests: string | null;
    loadingActive: boolean;
    loadingRequests: boolean;
    displayedActiveGroups: ActiveGroup[];
    displayedRequestGroups: RequestGroup[];
}

export const SmartSearchComponent: React.FC<SmartSearchComponentProps> = ({
    errorActive, loadingActive, errorRequests, loadingRequests, displayedActiveGroups, displayedRequestGroups
}) => {
    return (
        // Two-column results: left Active, right Requests
        <Container maxWidth="lg" sx={{ mb: 6 }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: { xs: 3, md: 4 },
                    alignItems: "start",
                }}
            >
                {/* Active Groups (left) */}
                <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        קבוצות פעילות רלוונטיות
                    </Typography>
                    {errorActive && (
                        <Card sx={{ p: 2, mb: 2, bgcolor: "#fff7f7", color: "#b71c1c" }}>
                            <Typography variant="body2">{errorActive}</Typography>
                        </Card>
                    )}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: { xs: 2, md: 2 },
                        }}
                    >
                        <Suspense fallback={<GroupSectionSkeleton />}>
                            {loadingActive ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <ActiveGroupCardSkeleton key={i} />
                                ))
                            ) : displayedActiveGroups.length > 0 ? (
                                displayedActiveGroups.map((ag, i) => (
                                    <ActiveGroupCard key={i} activeGroup={ag} />
                                ))
                            ) : (
                                <Typography color="text.secondary" sx={{ mt: 1 }}>
                                    לא נמצאו קבוצות פעילות מתאימות
                                </Typography>
                            )}
                        </Suspense>
                    </Box>
                </Box>

                {/* Request Groups (right) */}
                <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        בקשות רלוונטיות
                    </Typography>
                    {errorRequests && (
                        <Card sx={{ p: 2, mb: 2, bgcolor: "#fff7f7", color: "#b71c1c" }}>
                            <Typography variant="body2">{errorRequests}</Typography>
                        </Card>
                    )}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: { xs: 2, md: 2 },
                        }}
                    >
                        <Suspense fallback={<GroupSectionSkeleton />}>
                            {loadingRequests ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <RequestGroupCardSkeleton key={i} />
                                ))
                            ) : displayedRequestGroups.length > 0 ? (
                                displayedRequestGroups.map((rg, i) => (
                                    <RequestGroupCard key={i} requestGroup={rg} />
                                ))
                            ) : (
                                <Typography color="text.secondary" sx={{ mt: 1 }}>
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
