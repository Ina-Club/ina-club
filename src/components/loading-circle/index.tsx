import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

interface LoadingCircleProps {
    loadingText?: string;
}

export const LoadingCircle: React.FC<LoadingCircleProps> = ({ loadingText }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            {loadingText &&
                <Typography>{loadingText}</Typography>
            }
            <CircularProgress />
        </Box>
    );
}