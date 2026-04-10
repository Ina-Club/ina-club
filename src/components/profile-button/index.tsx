import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import UserAvatar from "@/components/user-avatar";

export default function ProfileButton() {
  const { user } = useUser();
  const router = useRouter();

  if (!user) return null;

  return (
    <Box
      onClick={() => router.push("/profile")}
      sx={{
        cursor: "pointer",
        display: "inline-flex",
      }}
    >
      <UserAvatar
        name={user.fullName || user.username || ""}
        identifier={user.primaryEmailAddress?.emailAddress || ""}
        imageUrl={user.imageUrl}
        sx={{
          width: { xs: 40, md: 40 },
          height: { xs: 40, md: 40 },
        }}
      />
    </Box>
  );
}