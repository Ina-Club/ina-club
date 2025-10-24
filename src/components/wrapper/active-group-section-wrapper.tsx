'use client'

import SectionWrapper from "./section-wrapper";
import ResponsiveHorizontalListWrapper from "./responsive-horizontal-wrapper";
import { Box } from "@mui/material";
import ActiveGroupCard from "../card/active-group-card";
import { useState, useEffect } from "react";
import { ActiveGroup } from "lib/dal";
import ActiveGroupCardSkeleton from "../skeleton/active-group-card-skeleton";

interface GroupSectionWrapperProps { }

const ActiveGroupSectionWrapper: React.FC<GroupSectionWrapperProps> = ({ }) => {
  const [allOpenActiveGroupsWithParent, setAllOpenActiveGroupsWithParent] = useState<ActiveGroup[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch('/api/active-groups/?status=open&lastWeek=true')
      .then(r => r.json())
      .then(data => { if (active) setAllOpenActiveGroupsWithParent(data.activeGroups ?? []); })
      .catch(() => setAllOpenActiveGroupsWithParent([]))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <>
      <SectionWrapper
        title={`הקבוצות הפופולריות`}
        subTitle={`קבוצות הרכישה החמות של השבוע האחרון`}
        linkLabel={`צפה בכל הקבוצות`}
        linkUrl={`/activeGroups`}
      >
        <ResponsiveHorizontalListWrapper gap="16px">
          {loading ?
            Array.from({ length: 6 }).map((_, i) => <ActiveGroupCardSkeleton key={i} />) :
            (allOpenActiveGroupsWithParent.length > 0 ?
              allOpenActiveGroupsWithParent.map((activeGroup, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <ActiveGroupCard activeGroup={activeGroup} />
                </Box>
              )) :
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  width: "100%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  justifyContent: "center",
                  color: "text.secondary",
                  textAlign: "center"
                }}
              >
                לא נמצאו קבוצות מהשבוע האחרון
              </Box>
            )}
        </ResponsiveHorizontalListWrapper>
      </SectionWrapper>
    </>
  );
};

export default ActiveGroupSectionWrapper;
