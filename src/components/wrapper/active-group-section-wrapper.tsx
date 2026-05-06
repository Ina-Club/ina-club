"use client";

import SectionWrapper from "./section-wrapper";
import ResponsiveHorizontalCardWrapper from "./responsive-horizontal-card-wrapper";
import { Box } from "@mui/material";
import ActiveGroupCard from "../card/active-group-card";
import { useState, useEffect } from "react";
import { ActiveGroup } from "lib/dal";
import ActiveGroupCardSkeleton from "../skeleton/active-group-card-skeleton";
import { GroupStatus } from "lib/types/status";

interface GroupSectionWrapperProps { }

const ActiveGroupSectionWrapper: React.FC<GroupSectionWrapperProps> = ({ }) => {
  const [groups, setGroups] = useState<ActiveGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    setLoading(true);

    const params = new URLSearchParams({
      lastWeek: "true",
      limit: "10",
      orderBy: "participants",
    });
    params.append("status", GroupStatus.OPEN);

    try {
      const res = await fetch("/api/active-groups/?" + params.toString());
      const data = await res.json();
      setGroups(data.activeGroups ?? []);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      <SectionWrapper
        title={`הקבוצות הפופולריות`}
        subTitle={`קבוצות הרכישה החמות של השבוע האחרון`}
        linkLabel={`צפה בכל הקבוצות`}
        linkUrl={`/active-groups`}
      >
        <ResponsiveHorizontalCardWrapper gap="16px">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  minWidth: 250,
                  minHeight: 250
                }}
              >
                <ActiveGroupCardSkeleton />
              </Box>
            ))
          ) : groups.length > 0 ? (
            groups.map((activeGroup, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  minWidth: 250,
                  minHeight: 250
                }}
              >
                <ActiveGroupCard activeGroup={activeGroup} />
              </Box>
            ))
          ) : (
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                width: "100%",
                transform: "translateX(-50%)",
                display: "flex",
                justifyContent: "center",
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              לא נמצאו קבוצות מהשבוע האחרון
            </Box>
          )}
        </ResponsiveHorizontalCardWrapper>
      </SectionWrapper >
    </>
  );
};

export default ActiveGroupSectionWrapper;
