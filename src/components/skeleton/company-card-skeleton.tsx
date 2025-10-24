"use client";

import { Card, CardContent, Box, Skeleton } from "@mui/material";

export default function CompanyCardSkeleton() {
    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: 2,
                width: 320,
                height: 120,
                overflow: "hidden",
                display: "flex",
                flexDirection: "row",
                bgcolor: "background.paper",
                p: 1,
                gap: 1,
            }}
        >
            <Box sx={{ position: "relative" }}>
                <Skeleton variant="rounded" width={50} height={100} />
            </Box>
            <CardContent sx={{ p: 2, width: 120 }}>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
            </CardContent>
        </Card>
    );
}


