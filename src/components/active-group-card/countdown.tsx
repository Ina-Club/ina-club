import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface CountdownProps {
  deadline: Date;
}

const Countdown: React.FC<CountdownProps> = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().getTime();
      const end = new Date(deadline).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("הסתיים");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      if (days > 0) {
        setTimeLeft(`${days} ימים`);
      } else if (hours > 0) {
        setTimeLeft(`${hours} שעות`);
      } else {
        setTimeLeft(`${minutes} דקות`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60 * 1000); // עדכון כל דקה
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {timeLeft}
    </Typography>
  );
};

export default Countdown;
