"use client";

import {
    Box,
    Card,
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

interface PriceAnalyzerCardProps {
    requestGroup: RequestGroup;
    handleExpansion: (requestGroup: RequestGroup) => Promise<void>;
}

// Mock data for demonstration
const mockProduct = {
    name: "Sony WH-1000XM4 Wireless Headphones",
    image: "/api/placeholder/200/150",
    price: 279.99,
    category: "Electronics",
    description: "Click for detailed product information",
};

const marketPrices = {
    minimum: 195.99,
    maximum: 321.99,
    average: 279.99,
    median: 265.99
};

const PriceAnalyzerCard: React.FC<PriceAnalyzerCardProps> = ({ requestGroup, handleExpansion }) => {
    const smartDiscount = 8.2;
    const smartPrice = mockProduct.price * (1 - smartDiscount / 100);

    return (
        <>
            <Card sx={{ mb: 3, p: 2 }}>
                <Box>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon onClick={() => handleExpansion(requestGroup)} />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Box
                                sx={{
                                    width: 120,
                                    height: 90,
                                    backgroundColor: "#f5f7fa",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
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
                                        AI Discount Engine
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Smart discounts calculated using AI market analysis
                                    </Typography>

                                    <Box sx={{ textAlign: "center", mb: 2 }}>
                                        <Typography variant="h2" color="primary.main" fontWeight={700}>
                                            {smartDiscount}%
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            Smart Discount Applied
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="body2" color="text.secondary">
                                        Original Price
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary">
                                        ${mockProduct.price}
                                    </Typography>
                                </Card>

                                {/* Price Comparison and Savings */}
                                <Card sx={{ p: 2 }}>
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                                        Price Comparison
                                    </Typography>

                                    <Paper sx={{ p: 1.5, textAlign: "center" }}>
                                        <Typography variant="body2" color="text.secondary">Average</Typography>
                                        <Typography variant="h6" color="primary.main" fontWeight={600}>
                                            ${marketPrices.average}
                                        </Typography>
                                    </Paper>
                                    <Paper sx={{ p: 1.5, textAlign: "center" }}>
                                        <Typography variant="body2" color="text.secondary">Median</Typography>
                                        <Typography variant="h6" color="#9c27b0" fontWeight={600}>
                                            ${marketPrices.median}
                                        </Typography>
                                    </Paper>

                                    {/* Price Bar Chart */}
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                            <Typography variant="caption" sx={{ minWidth: 60 }}>Min:</Typography>
                                            <Box sx={{ flexGrow: 1, height: 8, backgroundColor: "#e8f5e8", borderRadius: 1, position: "relative" }}>
                                                <Box sx={{ width: "20%", height: "100%", backgroundColor: "#4caf50", borderRadius: 1 }} />
                                            </Box>
                                            <Typography variant="caption">${marketPrices.minimum}</Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                            <Typography variant="caption" sx={{ minWidth: 60 }}>Your Price:</Typography>
                                            <Box sx={{ flexGrow: 1, height: 8, backgroundColor: "#e8f5e8", borderRadius: 1, position: "relative" }}>
                                                <Box sx={{ width: "35%", height: "100%", backgroundColor: "#ff9800", borderRadius: 1 }} />
                                            </Box>
                                            <Typography variant="caption">${smartPrice.toFixed(2)}</Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                            <Typography variant="caption" sx={{ minWidth: 60 }}>Average:</Typography>
                                            <Box sx={{ flexGrow: 1, height: 8, backgroundColor: "#e8f5e8", borderRadius: 1, position: "relative" }}>
                                                <Box sx={{ width: "50%", height: "100%", backgroundColor: "primary.main", borderRadius: 1 }} />
                                            </Box>
                                            <Typography variant="caption">${marketPrices.average}</Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography variant="caption" sx={{ minWidth: 60 }}>Max:</Typography>
                                            <Box sx={{ flexGrow: 1, height: 8, backgroundColor: "#e8f5e8", borderRadius: 1, position: "relative" }}>
                                                <Box sx={{ width: "100%", height: "100%", backgroundColor: "#f44336", borderRadius: 1 }} />
                                            </Box>
                                            <Typography variant="caption">${marketPrices.maximum}</Typography>
                                        </Box>
                                    </Box>
                                </Card>

                                <Card sx={{ p: 2 }}>
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                        Smart Discount Applied
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                            <Typography variant="body2">Original Price:</Typography>
                                            <Typography variant="body2">${mockProduct.price}</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                            <Typography variant="body2" color="#4caf50" fontWeight={600}>Smart Price:</Typography>
                                            <Typography variant="body2" color="#4caf50" fontWeight={600}>${smartPrice.toFixed(2)}</Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Box>
                        </AccordionDetails>
                    </Accordion >
                </Box>
            </Card >
        </>
    );
};

export default PriceAnalyzerCard;
