"use client";

import {
    Box,
    Card,
    CardMedia,
    Chip,
    Typography,
    Divider,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import {
    ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { RequestGroup } from "lib/dal";
import { useState } from "react";
import { LoadingCircle } from "@/components/loading-circle";
import { AIProductData } from "app/price-analyzer/page";

interface PriceAnalyzerCardProps {
    requestGroup: RequestGroup;
    handleExpansion: (requestGroup: RequestGroup) => Promise<AIProductData | null>;
}

// Mock data for demonstration
// const mockProduct = {
//     name: "Sony WH-1000XM4 Wireless Headphones",
//     image: "/api/placeholder/200/150",
//     price: 279.99,
//     category: "Electronics",
//     description: "Click for detailed product information",
// };

const PriceAnalyzerCard: React.FC<PriceAnalyzerCardProps> = ({ requestGroup, handleExpansion }) => {
    const loadingText: string = "טוען מידע...";
    const baseData: AIProductData = {
        // TODO: use name, model somewhere
        name: "",
        model: "",
        minPrice: 0,
        maxPrice: 0,
        averagePrice: 0,
        notesInHebrew: ""
    }
    const smartDiscountPercentage: number = 8;
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState<AIProductData>(baseData);
    const smartPrice = productData.averagePrice * (1 - smartDiscountPercentage / 100);

    const handleAccordionToggle = async (_event: React.SyntheticEvent, expanded: boolean) => {
        if (expanded) {
            setLoading(true);
            const AIFetchedData: AIProductData | null = await handleExpansion(requestGroup);
            if (AIFetchedData !== null) {
                setProductData(AIFetchedData);
            }
            else {
                // TODO: Render some error shit.
            }
            setLoading(false);
        }
    };

    return (
        <>
            <Card sx={{ mb: 3, p: 2 }}>
                <Box>
                    <Accordion sx={{ boxShadow: "none" }} onChange={handleAccordionToggle}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <CardMedia
                                component="img"
                                image={requestGroup.images[0]} //TODO: you can do better
                                alt={requestGroup.title}
                                sx={{
                                    width: 120,
                                    height: 90,
                                    backgroundColor: "#f5f7fa",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    objectFit: "cover",
                                    mr: 2
                                }}
                            />

                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                    {requestGroup.title}
                                </Typography>

                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    <Chip
                                        label="AI Analyzed"
                                        size="small"
                                        sx={{ backgroundColor: "primary.main", color: "white" }}
                                    />
                                    <Chip
                                        label={requestGroup.category.toLowerCase()}
                                        size="small"
                                        sx={{ backgroundColor: "#ff9800", color: "white" }}
                                    />
                                </Box>
                            </Box >
                        </AccordionSummary >
                        {/* TODO: cache the AI answer until a page refresh happens! */}
                        {loading ? <LoadingCircle loadingText={loadingText} /> :
                            <AccordionDetails>
                                {/* Main Analysis Grid */}
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, // mobile - 1 column, desktop - 3 columns
                                        width: "100%",
                                        px: { xs: 2, md: 2 },
                                        position: "inherit",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: { xs: 3, md: 2 },
                                    }}
                                >
                                    {/* AI Discount Engine */}
                                    <Card sx={{ p: 2, height: "100%" }}>
                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                            הנחת AI צפויה
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            הנחה חכמה המחושבת באמצעות ניתוח AI מתקדם.
                                        </Typography>

                                        <Box sx={{ textAlign: "center", mb: 2 }}>
                                            <Typography variant="h2" color="primary.main" fontWeight={700}>
                                                {smartDiscountPercentage}%
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                הנחה עבור קניה בקבוצת רכישה
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Box sx={{ justifyContent: "space-between", alignContent: "center" }}>
                                                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                    מחיר מקורי
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary">
                                                    ₪{productData.averagePrice}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ justifyContent: "space-between", alignItems: "flex-end" }}>
                                                <Typography variant="body2" color="#4caf50" fontWeight={600}>
                                                    מחיר לאחר הנחה צפויה
                                                </Typography>
                                                <Typography variant="h6" color="#4caf50">
                                                    ₪{smartPrice}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>

                                    {/* Price Comparison and Savings */}
                                    <Card sx={{ p: 2, height: "100%" }}>
                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                                            השוואת מחירים
                                        </Typography>

                                        <Paper sx={{ p: 1.5, textAlign: "center" }}>
                                            <Typography variant="body2" color="text.secondary">מחיר ממוצע</Typography>
                                            <Typography variant="h6" color="primary.main" fontWeight={600}>
                                                ₪{productData.averagePrice}
                                            </Typography>
                                        </Paper>

                                        {/* Price Bar Chart */}
                                        <Box sx={{ mb: 2, mt: 2 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                <Typography variant="caption" sx={{ minWidth: 60 }}>המחיר הנמוך ביותר:</Typography>
                                                <Box sx={{ flexGrow: 1, height: 8, backgroundColor: "#e8f5e8", borderRadius: 1, position: "relative" }}>
                                                    <Box sx={{ width: "20%", height: "100%", backgroundColor: "#4caf50", borderRadius: 1 }} />
                                                </Box>
                                                <Typography variant="caption">₪{productData.minPrice}</Typography>
                                            </Box>

                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                <Typography variant="caption" sx={{ minWidth: 60 }}>מחיר ממוצע:</Typography>
                                                <Box sx={{ flexGrow: 1, height: 8, backgroundColor: "#e8f5e8", borderRadius: 1, position: "relative" }}>
                                                    <Box sx={{ width: "50%", height: "100%", backgroundColor: "primary.main", borderRadius: 1 }} />
                                                </Box>
                                                <Typography variant="caption">₪{productData.averagePrice}</Typography>
                                            </Box>

                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Typography variant="caption" sx={{ minWidth: 60 }}>המחיר הגבוה ביותר:</Typography>
                                                <Box sx={{ flexGrow: 1, height: 8, backgroundColor: "#e8f5e8", borderRadius: 1, position: "relative" }}>
                                                    <Box sx={{ width: "100%", height: "100%", backgroundColor: "#f44336", borderRadius: 1 }} />
                                                </Box>
                                                <Typography variant="caption">₪{productData.maxPrice}</Typography>
                                            </Box>
                                        </Box>
                                    </Card>

                                    <Card sx={{ p: 2, height: "100%" }}>
                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                            נקודות שחשוב לדעת
                                        </Typography>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography variant="body1" fontWeight={500}>
                                            {productData.notesInHebrew}
                                        </Typography>
                                    </Card>
                                </Box>
                            </AccordionDetails>
                        }
                    </Accordion >
                </Box>
            </Card >
        </>
    );
};

export default PriceAnalyzerCard;
