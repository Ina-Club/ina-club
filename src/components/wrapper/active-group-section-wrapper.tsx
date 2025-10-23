'use client'

import SectionWrapper from "./section-wrapper";
import ResponsiveHorizontalListWrapper from "./responsive-horizontal-wrapper";
import { Box } from "@mui/material";
import ActiveGroupCard from "../card/active-group-card";
import { useState, useEffect } from "react";
import { ActiveGroup } from "lib/dal";
import { LoadingCircle } from "../loading-circle";

interface GroupSectionWrapperProps { }

const ActiveGroupSectionWrapper: React.FC<GroupSectionWrapperProps> = ({ }) => {
  const [allOpenedGroupsWithParent, setAllOpenedGroupsWithParent] = useState<ActiveGroup[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch('/api/active-groups/?status=open')
      .then(r => r.json())
      .then(data => { if (active) setAllOpenedGroupsWithParent(data.activeGroups ?? []); })
      .catch(() => setAllOpenedGroupsWithParent([]))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <>
      <SectionWrapper
        title={`הבקשות הפופולריות`}
        subTitle={`הבקשות החמות של השבוע האחרון`}
        linkLabel={`צפה בכל הבקשות`}
        linkUrl={`/requestGroups`}
      >
        <ResponsiveHorizontalListWrapper gap="16px">
          {loading ? <LoadingCircle /> : allOpenedGroupsWithParent.map((activeGroup, index) => (
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
          ))}
        </ResponsiveHorizontalListWrapper>
      </SectionWrapper>
    </>
  );
};

export default ActiveGroupSectionWrapper;
