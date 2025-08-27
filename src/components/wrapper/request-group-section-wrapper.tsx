import { mockRequestGroups } from "lib/mock";
import ResponsiveHorizontalListWrapper from "./responsive-horizontal-wrapper";
import { Box } from "@mui/material";
import RequestGroupCard from "../request-group-card";
import SectionWrapper from "./section-wrapper";

interface RequestGroupSectionWrapperProps {}

const RequestGroupSectionWrapper: React.FC<
  RequestGroupSectionWrapperProps
> = ({}) => {
  //TODO: REMOVE mock
  const requestGroups = mockRequestGroups.concat(mockRequestGroups);

  return (
    <>
      <SectionWrapper
        title={`הבקשות הפופולריות`}
        subTitle={`הבקשות החמות של השבוע האחרון`}
        linkLabel={`צפה בכל הבקשות`}
        linkUrl={`/requestGroups`}
      >
        {}
        <ResponsiveHorizontalListWrapper gap="16px">
          {requestGroups.map((requestGroup, index) => (
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
          ))}
        </ResponsiveHorizontalListWrapper>
      </SectionWrapper>
    </>
  );
};

export default RequestGroupSectionWrapper;
