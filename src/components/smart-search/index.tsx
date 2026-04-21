import { Alert, Box, Container, Typography } from "@mui/material"
import { Suspense } from "react"
import GroupSectionSkeleton from "../skeleton/group-section-skeleton"
import ActiveGroupCard from "../card/active-group-card"
import { ActiveGroup } from "@/lib/dal"
import WishItemCard, { WishItemData } from "../demand-pulse/WishItemCard"

interface SmartSearchComponentProps {
    filterAi: boolean;
    errorAi: string | null;
    displayedActiveGroups: ActiveGroup[];
    displayedWishItems: WishItemData[];
}

export const SmartSearchComponent: React.FC<SmartSearchComponentProps> = ({
    filterAi, errorAi, displayedActiveGroups, displayedWishItems
}) => {
    const filterAiText: string = "AI השמיט תוצאות פחות רלוונטיות, נסו למקד את החיפוש.";
    return (
        // Two-column results: left Active, right Requests
        <Container maxWidth="lg" sx={{ mb: 6 }}>
            {filterAi && <Alert severity="info" sx={{ mb: 2 }}>{filterAiText}</Alert>}
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
                        מוצרים מבוקשים (Wish Items)
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
                            {displayedWishItems?.length > 0 ? (
                                displayedWishItems.map((wi, i) => (
                                    <WishItemCard key={i} item={wi} />
                                ))
                            ) : (
                                <Typography color="text.secondary">
                                    לא נמצאו מוצרים מבוקשים מתאימים
                                </Typography>
                            )}
                        </Suspense>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}
