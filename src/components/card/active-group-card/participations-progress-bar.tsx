import { Box, LinearProgress, Typography } from "@mui/material";

interface ParticipantsProgressProps {
  current: number;
  min?: number;
  max?: number;
}

const ParticipantsProgress: React.FC<ParticipantsProgressProps> = ({ current, min, max }) => {
  const progress: number = max ? Math.min((current / max) * 100, 100) : 100;
  const barTitle: string = max ? `${current} משתתפים מתוך ${max}` : `${current} משתתפים`;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {barTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {max && `${Math.round(progress)}%`}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 10,
          borderRadius: 5,
          bgcolor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            borderRadius: 5,
            bgcolor: "#1a2a5a",
          },
        }}
      />
    </Box>
  );
};

export default ParticipantsProgress;
