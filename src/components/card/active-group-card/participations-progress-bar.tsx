import { Box, LinearProgress, Typography } from "@mui/material";

interface ParticipantsProgressProps {
  current: number;
  min?: number;
  max?: number;
}

const ParticipantsProgress: React.FC<ParticipantsProgressProps> = ({ current, min, max }) => {
  const createProgress = () => {
    if (current === 0) return 0;
    return max ? Math.min((current / max) * 100, 100) : 100
  };
  const createBarTitle = () => {
    let title = `${current} משתתפים`;
    if (max) title += (` מתוך ${max}`);
    if (min) title += (`, מינימום  ${min}`);
    return title += '.';
  }
  const createBarColor = () => {
    if (!min) return "#1a2a5a";
    return current < min ? "#f0a868" : "#1a2a5a";
  }
  const progress: number = createProgress();
  const barTitle: string = createBarTitle();
  const barColor: string = createBarColor();

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
      <Box sx={{ position: "relative" }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              borderRadius: 5,
              bgcolor: barColor,
            },
          }}
        />
        {/* Divider overlay */}
        {min && max &&
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: `${(min / max) * 100}%`,
              height: "100%",
              width: "2px",
              backgroundColor: "red",
              transform: "translateX(-1px)", // center align
            }}
          />}
      </Box>
    </Box>
  );
};

export default ParticipantsProgress;
