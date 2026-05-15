import { Divider, Typography } from "@mui/material";
import { checkUserIsActiveGroupParticipant } from "@/lib/utils/praticipant";
import { fetchGroupParticipants } from "@/lib/groups";
import { LikeTargetType } from "@/lib/types/like";
import { fetchGroupLikeCount } from "@/lib/groups";
import GroupMembershipPanel from "@/components/group-membership-button/group-membership-panel";

import type { User } from "@/lib/dal";

interface GroupMembershipPanelLoaderProps {
  groupId: string;
  userId: string | null;
  currentUser: User | null;
  status: string;
}

/** Async server component — streamed via Suspense */
export default async function GroupMembershipPanelLoader({
  groupId,
  userId,
  currentUser,
  status,
}: GroupMembershipPanelLoaderProps) {
  const [participants, alreadyJoined, likeCount] = await Promise.all([
    fetchGroupParticipants(groupId),
    userId ? checkUserIsActiveGroupParticipant(userId, groupId) : false,
    fetchGroupLikeCount(groupId, LikeTargetType.ACTIVE_GROUP),
  ]);

  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2">
        {likeCount} אנשים כבר סימנו בלייק את הקבוצה!
      </Typography>
      <GroupMembershipPanel
        groupId={groupId}
        initialParticipants={participants}
        currentUser={currentUser}
        isJoined={alreadyJoined}
        status={status}
      />
    </>
  );
}
