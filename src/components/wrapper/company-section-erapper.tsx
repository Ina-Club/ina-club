import { Box } from "@mui/material";
import SectionWrapper from "./section-wrapper";
import ResponsiveHorizontalListWrapper from "./responsive-horizontal-wrapper";
import { mockCompanies } from "lib/mock";
import CompanyCard from "../card/compant-card";

interface CompanySectionWrapperProps {}

const CompanySectionWrapper: React.FC<CompanySectionWrapperProps> = ({}) => {
  //TODO: REMOVE mock
  const allCompanies = mockCompanies.concat(mockCompanies); // just for demo, duplicate like you did in groups

  return (
    <SectionWrapper
      title={`חברות מובילות`}
      subTitle={`הסטארטאפים והמותגים ששווה להכיר`}
      linkLabel={`צפה בכל החברות`}
      linkUrl={`/companies`}
    >
      <ResponsiveHorizontalListWrapper gap="16px">
        {allCompanies.map((company, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              width: "100%",
              height: "100%",
              flex: "auto !important",
            }}
          >
            <CompanyCard company={company} />
          </Box>
        ))}
      </ResponsiveHorizontalListWrapper>
    </SectionWrapper>
  );
};

export default CompanySectionWrapper;
