"use client";

import {
    Box,
    Card,
    Chip,
    Typography,

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

const PriceAnalyzerCard: React.FC<PriceAnalyzerCardProps> = ({ requestGroup, handleExpansion }) => {
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </AccordionDetails>
                    </Accordion >
                </Box>
            </Card >
        </>
    );
};

export default PriceAnalyzerCard;
