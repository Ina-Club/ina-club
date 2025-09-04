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
    CardContent,
    Button,
    Grid,
    Paper,
    LinearProgress,
    IconButton,
    Divider,
} from "@mui/material";
import {
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    AutoAwesome as AutoAwesomeIcon,
    Psychology as PsychologyIcon,
    Category as CategoryIcon,
    TrendingUp as TrendingUpIcon,
    AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { DefaultPageBanner } from "@/components/default-page-banner";

// Mock data for demonstration
const mockProduct = {
    name: "Sony WH-1000XM4 Wireless Headphones",
    image: "/api/placeholder/200/150",
    price: 279.99,
    category: "Electronics",
    description: "Click for detailed product information",
};

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

const quantityOptions = [
    { value: 1, label: "1 item" },
    { value: 5, label: "5 items" },
    { value: 10, label: "10 items" }
];

const marketPrices = {
    minimum: 195.99,
    maximum: 321.99,
    average: 279.99,
    median: 265.99
};

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

export default function PriceAnalyzerPage() {
    const headerText: string = "מנתח מחירים חכם"
    const descriptionText: string = "גלה תובנות על השוק באמצעות מנתח מחירים מבוסס AI כדי לבצע רכישות חכמות יותר."
    const [selectedCategory, setSelectedCategory] = useState("Electronics");
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const smartDiscount = 8.2;
    const smartPrice = mockProduct.price * (1 - smartDiscount / 100);
    const savings = mockProduct.price - smartPrice;

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

                {/* Product Card */}
                <Card sx={{ mb: 3, p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                            sx={{
                                width: 120,
                                height: 90,
                                backgroundColor: "#f5f7fa",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Product Image
                            </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                {mockProduct.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {mockProduct.description}
                            </Typography>

                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <Chip
                                    label="AI Analyzed"
                                    size="small"
                                    sx={{ backgroundColor: "primary.main", color: "white" }}
                                />
                                <Chip
                                    label={mockProduct.category.toLowerCase()}
                                    size="small"
                                    sx={{ backgroundColor: "#ff9800", color: "white" }}
                                />
                                <Chip
                                    label={`$${mockProduct.price}`}
                                    size="small"
                                    sx={{ backgroundColor: "#4caf50", color: "white" }}
                                />
                            </Box>
                        </Box>

                        <IconButton>
                            <ExpandMoreIcon />
                        </IconButton>
                    </Box>
                </Card>

                {/* Quantity Selection */}
                <Card sx={{ mb: 3, p: 2 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                        Quantity Selection
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Adjust quantity to unlock better bulk pricing discounts
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        {quantityOptions.map((option) => (
                            <Button
                                key={option.value}
                                variant={selectedQuantity === option.value ? "contained" : "outlined"}
                                onClick={() => setSelectedQuantity(option.value)}
                                sx={{
                                    minWidth: "auto",
                                    px: 2,
                                    py: 1,
                                    borderRadius: "20px",
                                    backgroundColor: selectedQuantity === option.value ? "primary.main" : "transparent",
                                    color: selectedQuantity === option.value ? "white" : "primary.main",
                                    borderColor: "primary.main",
                                }}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AutoAwesomeIcon sx={{ color: "primary.main", fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                            AI calculates optimal bulk discounts based on quantity and category
                        </Typography>
                    </Box>
                </Card>

                {/* Main Analysis Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Market Price Analysis */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, height: "100%" }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                Market Price Analysis
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Current market price ranges and competitive positioning
                            </Typography>

                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 1.5, textAlign: "center", backgroundColor: "#e8f5e8" }}>
                                        <Typography variant="body2" color="text.secondary">Minimum</Typography>
                                        <Typography variant="h6" color="#4caf50" fontWeight={600}>
                                            ${marketPrices.minimum}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 1.5, textAlign: "center", backgroundColor: "#ffebee" }}>
                                        <Typography variant="body2" color="text.secondary">Maximum</Typography>
                                        <Typography variant="h6" color="#f44336" fontWeight={600}>
                                            ${marketPrices.maximum}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 1.5, textAlign: "center", backgroundColor: "#e3f2fd" }}>
                                        <Typography variant="body2" color="text.secondary">Average</Typography>
                                        <Typography variant="h6" color="primary.main" fontWeight={600}>
                                            ${marketPrices.average}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 1.5, textAlign: "center", backgroundColor: "#f3e5f5" }}>
                                        <Typography variant="body2" color="text.secondary">Median</Typography>
                                        <Typography variant="h6" color="#9c27b0" fontWeight={600}>
                                            ${marketPrices.median}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    {/* AI Discount Engine */}
                    <Grid item xs={12} md={6}>
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
                                <Typography variant="body2" color="primary.main">
                                    {selectedCategory} • {selectedQuantity} Item{selectedQuantity > 1 ? 's' : ''}
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
                    </Grid>
                </Grid>

                {/* Price Comparison and Savings */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                                Price Comparison
                            </Typography>

                            <Grid container spacing={1} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 1.5, textAlign: "center" }}>
                                        <Typography variant="body2" color="text.secondary">Average</Typography>
                                        <Typography variant="h6" color="primary.main" fontWeight={600}>
                                            ${marketPrices.average}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 1.5, textAlign: "center" }}>
                                        <Typography variant="body2" color="text.secondary">Median</Typography>
                                        <Typography variant="h6" color="#9c27b0" fontWeight={600}>
                                            ${marketPrices.median}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

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
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                Smart Discount Applied
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {selectedCategory} • {selectedQuantity} Item{selectedQuantity > 1 ? 's' : ''}
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
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" color="#ff9800" fontWeight={600}>Total ({selectedQuantity} items):</Typography>
                                    <Typography variant="body2" color="#ff9800" fontWeight={600}>${(smartPrice * selectedQuantity).toFixed(2)}</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body2" color="#4caf50" fontWeight={600}>You Save:</Typography>
                                    <Typography variant="body2" color="#4caf50" fontWeight={600}>${(savings * selectedQuantity).toFixed(2)}</Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

                {/* AI Analysis Insights */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
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
                    </Grid>

                    <Grid item xs={12} md={6}>
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
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
