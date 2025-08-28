import { mockActiveGroups, mockRequestGroups } from "lib/mock";
import SectionWrapper from "./section-wrapper";
import ResponsiveHorizontalListWrapper from "./responsive-horizontal-wrapper";
import { Box } from "@mui/material";
import ActiveGroupCard from "../card/active-group-card";

interface GroupSectionWrapperProps {}

const ActiveGroupSectionWrapper: React.FC<GroupSectionWrapperProps> = ({}) => {
  //TODO: REMOVE mock
  const allOpenedGroupsWithParent = mockActiveGroups.concat(mockActiveGroups);

  return (
    <>
      <SectionWrapper
        title={`הבקשות הפופולריות`}
        subTitle={`הבקשות החמות של השבוע האחרון`}
        linkLabel={`צפה בכל הבקשות`}
        linkUrl={`/requestGroups`}
      >
        <ResponsiveHorizontalListWrapper gap="16px">
          {allOpenedGroupsWithParent.map((activeGroup, index) => (
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
