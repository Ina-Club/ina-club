"use client";

import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    InputAdornment,
    Chip,
    Card,
} from "@mui/material";
import {
    Search as SearchIcon,
    Psychology as PsychologyIcon,
    Category as CategoryIcon,
    AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import PriceAnalyzerCard from '@/components/card/price-analyzer-card';
import { RequestGroup } from 'lib/dal';
import { mockRequestGroups } from "lib/mock";
import { PRICE_ANALYZER_PROMPT } from "ai/prompts";

const categories = [
    "Electronics",
    "Fashion",
    "Home-Goods",
    "Jewelry",
    "Gaming",
    "Outdoor",
    "Fitness",
    "Automotive",
    "Technology"
];

const aiInsights = [
    "Electronics have moderate margins with bulk pricing advantages",
    "Luxury items maintain higher margins",
    "Current market conditions favor higher discounts"
];

const aiSteps = [
    {
        icon: <CategoryIcon />,
        title: "Category Detection",
        description: "AI identifies product category and brand positioning for targeted analysis"
    },
    {
        icon: <PsychologyIcon />,
        title: "Smart Analysis",
        description: "Analyzes market patterns, seasonality, and competitive landscape dynamics"
    },
    {
        icon: <AttachMoneyIcon />,
        title: "Dynamic Pricing",
        description: "Calculates optimal discounts based on quantity, trends, and market conditions"
    }
];

const handleAISearch = async (requestGroup: RequestGroup) => {
    try {
        const price_analyzer_prompt: string = PRICE_ANALYZER_PROMPT.replace('{product_name}', requestGroup.title);
        const response: Response = await fetch("/api/ai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: price_analyzer_prompt }),
        });
        console.log(response);
    }
    catch {
        console.log("Failed Sending the request to AI!")
    }
}

export default function PriceAnalyzerPage() {
    const headerText: string = "מנתח מחירים חכם"
    const descriptionText: string = "גלה תובנות על השוק באמצעות מנתח מחירים מבוסס AI כדי לבצע רכישות חכמות יותר."
    const [selectedCategory, setSelectedCategory] = useState("Electronics");
    const [searchQuery, setSearchQuery] = useState("");
    const requestGroups: RequestGroup[] = mockRequestGroups.concat(mockRequestGroups);

    return (
        <>
            <DefaultPageBanner header={headerText} description={descriptionText} />
            <Container
                sx={{
                    px: { xs: "17px", md: "0px" },
                    py: 4,
                    maxWidth: "1200px",
                }}
            >
                {/* Search Section */}
                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        placeholder="Search for any product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "primary.main" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                backgroundColor: "#f8fafc",
                            },
                        }}
                    />

                    {/* Category Filters */}
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {categories.map((category) => (
                            <Chip
                                key={category}
                                label={category}
                                onClick={() => setSelectedCategory(category)}
                                variant={selectedCategory === category ? "filled" : "outlined"}
                                sx={{
                                    backgroundColor: selectedCategory === category ? "primary.main" : "transparent",
                                    color: selectedCategory === category ? "white" : "primary.main",
                                    borderColor: "primary.main",
                                    "&:hover": {
                                        backgroundColor: selectedCategory === category ? "primary.dark" : "primary.light",
                                        color: "white",
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                <PriceAnalyzerCard requestGroup={requestGroups[0]} handleExpansion={handleAISearch} />

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, // mobile - 1 column, desktop - 3 columns
                        width: "100%",
                        px: { xs: 2, md: 2 },
                        position: "inherit",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: { xs: 3, md: 2 },
                    }}
                >
                    {/* AI Analysis Insights */}
                    <Card sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <PsychologyIcon sx={{ color: "secondary.main" }} />
                            <Typography variant="h6" fontWeight={600}>
                                AI Analysis Insights
                            </Typography>
                        </Box>

                        <Box sx={{ pl: 4 }}>
                            {aiInsights.map((insight, index) => (
                                <Typography key={index} variant="body2" sx={{ mb: 1, position: "relative" }}>
                                    <Box
                                        component="span"
                                        sx={{
                                            position: "absolute",
                                            left: -20,
                                            top: 0,
                                            width: 6,
                                            height: 6,
                                            backgroundColor: "secondary.main",
                                            borderRadius: "50%",
                                        }}
                                    />
                                    {insight}
                                </Typography>
                            ))}
                        </Box>
                    </Card>

                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                            How AI Pricing Works
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Our 3-step process for intelligent discount prediction and price optimization.
                        </Typography>

                        {aiSteps.map((step, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        backgroundColor: index === 0 ? "primary.main" : index === 1 ? "#ff9800" : "#4caf50",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        flexShrink: 0,
                                    }}
                                >
                                    {step.icon}
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                                        {step.title}:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {step.description}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Card>
                </Box>
            </Container>
        </>
    );
}
