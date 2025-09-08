import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

interface LoadingCircleProps {
    loadingText?: string;
}

export const LoadingCircle: React.FC<LoadingCircleProps> = ({ loadingText }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", pb: { xs: 2, md: 4 } }}>
            {loadingText &&
                <Typography sx={{ pb: { xs: 1, md: 2 } }}>{loadingText}</Typography>
            }
            <CircularProgress />
        </Box>
    );
}