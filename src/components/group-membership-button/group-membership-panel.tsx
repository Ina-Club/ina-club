"use client";

import { useState } from "react";
import { Avatar, Box, Divider, Typography } from "@mui/material";
import UserAvatar from "@/components/user-avatar";
import GroupMembershipButton from "@/components/group-membership-button";

import type { User } from "@/lib/dal";

interface GroupMembershipPanelProps {
  groupId: string;
  initialParticipants: User[];
  currentUser: User | null; // null when not signed in
  isJoined: boolean;
}

export default function GroupMembershipPanel({
  groupId,
  initialParticipants,
  currentUser,
  isJoined,
}: GroupMembershipPanelProps) {
  const [participants, setParticipants] = useState<User[]>(initialParticipants);

  // TODO: filter based on user id
  const handleJoin = () => {
    if (!currentUser) return;
    // Optimistically add the current user if not already in the list
    setParticipants((prev) =>
      prev.some((p) => p.firstName === currentUser.firstName && p.image === currentUser.image)
        ? prev
        : [...prev, currentUser]
    );
  };

  const handleLeave = () => {
    if (!currentUser) return;
    setParticipants((prev) =>
      prev.filter(
        (p) => !(p.firstName === currentUser.firstName && p.image === currentUser.image)
      )
    );
  };

  const displayAvatars = participants.slice(0, 10);
  const overflow = participants.length - displayAvatars.length;

  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" fontWeight={700} mb={1}>
        משתתפים ({participants.length})
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        {displayAvatars.map((p, index) => (
          <UserAvatar
            key={index}
            name={p.firstName}
            identifier={index.toString()}
            imageUrl={p.image || undefined}
            sx={{ width: 36, height: 36 }}
          />
        ))}
        {overflow > 0 && (
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "grey.300",
              color: "text.primary",
            }}
          >
            +{overflow}
          </Avatar>
        )}
      </Box>
      <Box mt={2}>
        <GroupMembershipButton
          type="active-group"
          id={groupId}
          fullWidth
          isJoined={isJoined}
          onJoin={handleJoin}
          onLeave={handleLeave}
        />
      </Box>
    </>
  );
}
