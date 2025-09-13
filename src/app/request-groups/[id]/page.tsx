import { notFound } from "next/navigation";
import { RequestGroup } from "lib/dal";
import { mockRequestGroups } from "lib/mock";
import { Box, Typography, CardMedia } from "@mui/material";

async function getRequestGroup(id: string): Promise<RequestGroup | null> {
    const url = `${"http://localhost:3000"}/api/users/${id}`;
    const res = await fetch(url, { cache: "no-store" }); // or { next: { revalidate: 60 } } for ISR
    if (res.status === 404)
        return null;
    return res.json();
}

export default async function Page({ params }: { params: { id: string } }) {
    // const requestGroup = await getRequestGroup(params.id);
    const allRequestGroups: RequestGroup[] = mockRequestGroups.concat(mockRequestGroups);
    const filteredRequestGroups: RequestGroup[] = allRequestGroups.filter((rg) => rg.id === params.id); //TODO: Change to DB fetch
    if (!filteredRequestGroups.length)
        return notFound();
    const requestGroup: RequestGroup = filteredRequestGroups[0];

    return (
        <Box sx={{
            px: { xs: 2, md: 4 },
            py: { xs: 2, md: 4 },
        }}>
            <Box sx={{
                width: "100%",
                display: "flex",
            }}>
                <Typography
                    sx={{
                        fontWeight: "bold",
                        fontSize: { md: "3.75rem", xs: "2.4rem" },
                        lineHeight: 1,
                        mb: 2,
                        color: "#1a2a5a",
                        display: "flex",
                        justifyContent: "start"
                    }}
                >
                    {`${requestGroup.title}sssss`}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column-reverse", md: "row" },
                    width: "100%",
                    gap: { xs: 3, md: 4 },
                    alignItems: "stretch",
                }}
            >
                {/* Text Section - 1/2 width on desktop */}
                <Box
                    sx={{
                        flex: { xs: "unset", md: 1 },
                        width: { xs: "100%", md: "50%" },
                        pr: { md: 2 },
                        mb: { xs: 2, md: 0 },
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Example text content */}
                    <Typography variant="h6" mb={2}>
                        קטגוריה: {requestGroup.category}
                    </Typography>
                    <Typography variant="h6" mb={2}>
                        משתתפים: {requestGroup.participants.length}
                    </Typography>
                    <Typography variant="h6" mb={2}>
                        מידע נוסף:
                    </Typography>
                </Box>
                {/* Pictures Section - 1/2 width on desktop */}
                <Box
                    sx={{
                        flex: { xs: "unset", md: 1 },
                        width: { xs: "100%", md: "50%" },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#f5f5f5",
                        borderRadius: 2,
                        minHeight: 200,
                    }}
                >
                    <CardMedia
                        component="img"
                        image={requestGroup.images[0]}
                        alt={requestGroup.title}
                        sx={{ height: { xs: 300, md: 600 } }}
                    />
                </Box>
            </Box>
        </Box>
    );
}
