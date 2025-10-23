"use client";

import { Suspense, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Chip,
    Card,
} from "@mui/material";
import {
    Psychology as PsychologyIcon,
    Category as CategoryIcon,
    AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import PriceAnalyzerCard from '@/components/card/price-analyzer-card';
import { RequestGroup } from 'lib/dal';
import { mockRequestGroups } from "lib/mock";
import { PRICE_ANALYZER_PROMPT } from "ai/prompts";
import GroupSectionSkeleton from "@/components/skeleton/group-section-skeleton"
import { SearchBar } from "@/components/search-bar";

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
        title: "זיהוי קטגוריה",
        description: "AI מזהה קטגוריית מוצר עבור ניתוח מלא ומדויק."
    },
    {
        icon: <PsychologyIcon />,
        title: "ניתוח חכם",
        description: "מנתח תבניות בשוק, עונתיות ותחרויות בתחומים שונים."
    },
    {
        icon: <AttachMoneyIcon />,
        title: "תמחור",
        description: "מחשב הנחות אופטימליות על בסיס כמויות, טרנדים ומצב השוק."
    }
];

export interface AIProductData {
    name: string,
    model: string,
    minPrice: number,
    maxPrice: number
    averagePrice: number,
    notesInHebrew: string
}

const isAIProductData = (obj: unknown): obj is AIProductData => {
    if (typeof obj !== "object" || obj === null) return false;
    const o = obj as Record<string, unknown>;

    return (
        typeof o.name === "string" &&
        typeof o.model === "string" &&
        typeof o.minPrice === "number" &&
        typeof o.maxPrice === "number" &&
        typeof o.averagePrice === "number" &&
        Number.isFinite(o.averagePrice) &&
        typeof o.notesInHebrew === "string"
    );
}

const handleAISearch = async (requestGroup: RequestGroup): Promise<AIProductData | null> => {
    const propertyList: string[] = ["name", "model", "minPrice", "maxPrice", "averagePrice", "notesInHebrew"];
    const responseSchema = {
        type: "object",
        properties: {
            name: { type: "string" },
            model: { type: "string" },
            minPrice: { type: "number" },
            maxPrice: { type: "number" },
            averagePrice: { type: "number" },
            notesInHebrew: { type: "string" },
        },
        required: propertyList,
    }

    try {
        const price_analyzer_prompt: string =
            PRICE_ANALYZER_PROMPT.replace('{productName}', requestGroup.title).replace('{propertyList}', propertyList.toString());
        const response: Response = await fetch("/api/ai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: price_analyzer_prompt, schema: responseSchema }),
        });
        console.log(response);
        const data = await response.json();
        if (!response.ok || !isAIProductData(data)) {
            console.log("Failed to fetch AI data: ", response.statusText);
            return null;
        }
        return data;
    }
    catch (err) {
        console.log("Failed Sending the request to AI!", err);
        return null;
    }
}

export default function PriceAnalyzerPage() {
    const headerText: string = "מנתח מחירים חכם"
    const descriptionText: string = "גלה תובנות על השוק באמצעות מנתח מחירים מבוסס AI כדי לבצע רכישות חכמות יותר."
    const [selectedCategory, setSelectedCategory] = useState("Electronics");
    const [searchText, setSearchText] = useState("");
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
                <Box
                    sx={{
                        maxWidth: 800,
                        mx: "auto",
                        position: "relative",
                        mt: { xs: -8, md: -7 }, // מרים את הסרגל חיפוש שיהיה קצת מעל הגרדיאנט
                        mb: {xs: 2, md: 2},
                        bgcolor: "white",
                        boxShadow: 3,
                        borderRadius: "12px",
                        py: { xs: 2, md: 1 },
                        px: { xs: 2, md: 2 },
                        display: "flex",
                        alignItems: "center",
                        border: "2px solid transparent",
                        "&:hover": {
                            borderColor: "#1a2a5a"
                        }
                    }}
                >
                    <SearchBar searchText={searchText} placeholderText="חיפוש מוצרים..." handleSearchTextChange={setSearchText} />
                </Box>
                {/* Category Filters */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, flexWrap: "wrap", mb: 2 }}>
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
                <Suspense fallback={<GroupSectionSkeleton />}>
                    {requestGroups.map((requestGroup, index) => (
                        <PriceAnalyzerCard key={index} requestGroup={requestGroup} handleExpansion={handleAISearch} />
                    ))}
                </Suspense>

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
                    <Card sx={{ p: 2, height: "100%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <PsychologyIcon sx={{ color: "secondary.main" }} />
                            <Typography variant="h6" fontWeight={600}>
                                תובנות ניתוח AI
                            </Typography>
                        </Box>

                        <Box sx={{ pl: 4 }}>
                            {aiInsights.map((insight, index) => (
                                <Typography key={index} variant="body2" sx={{ mb: 2, position: "relative" }}>
                                    <Box
                                        component="span"
                                        sx={{
                                            position: "absolute",
                                            left: -20,
                                            top: 6,
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
                            איך עובד תמחור באמצעות AI?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            התהליך שלנו בן 3 שלבים קריטיים לצורך חיזוי הנחה ושמירה על מחיר אופטימלי.
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
