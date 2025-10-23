"use client";

import ResponsiveHorizontalListWrapper from "./responsive-horizontal-wrapper";
import { Box } from "@mui/material";
import RequestGroupCard from "../card/request-group-card";
import SectionWrapper from "./section-wrapper";
import { LoadingCircle } from "../loading-circle";
import { RequestGroup } from "lib/dal";
import { useState, useEffect } from "react";

interface RequestGroupSectionWrapperProps { }

const RequestGroupSectionWrapper: React.FC<RequestGroupSectionWrapperProps> = () => {
  const [allOpenRequestGroupsWithParent, setAllOpenRequestGroupsWithParent] = useState<RequestGroup[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch('/api/request-groups/?status=open&lastWeek=true')
      .then(r => r.json())
      .then(data => { if (active) setAllOpenRequestGroupsWithParent(data.requestGroups ?? []); })
      .catch(() => setAllOpenRequestGroupsWithParent([]))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <SectionWrapper
      title="הבקשות הפופולריות"
      subTitle="הבקשות החמות של השבוע האחרון"
      linkLabel="צפה בכל הבקשות"
      linkUrl="/request-groups"
    >
      <ResponsiveHorizontalListWrapper gap="16px">
        {loading ?
          <LoadingCircle sx={{
            position: "absolute",
            left: "50%",
            width: "100%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }} /> :
          (allOpenRequestGroupsWithParent.length > 0 ?
            allOpenRequestGroupsWithParent.map((requestGroup, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                }}
              >
                <RequestGroupCard requestGroup={requestGroup} />
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
              לא נמצאו בקשות מהשבוע האחרון
            </Box>
          )}
      </ResponsiveHorizontalListWrapper>
    </SectionWrapper>
  );
};

export default RequestGroupSectionWrapper;
