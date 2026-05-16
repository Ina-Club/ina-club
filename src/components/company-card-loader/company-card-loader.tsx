import { prisma } from "@/lib/prisma";
import CompanyCard from "@/components/card/company-card";
import { Company } from "@/lib/dal";

interface CompanyCardLoaderProps {
  companyId: string;
}

export default async function CompanyCardLoader({ companyId }: CompanyCardLoaderProps) {
  const companyRecord = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      logo: true,
      title: true,
      description: true,
      categories: { select: { name: true } },
      websiteUrl: true,
    },
  });

  if (!companyRecord) return null;

  const company: Company = {
    id: companyRecord.id,
    title: companyRecord.title,
    logo: companyRecord.logo as { id: string; url: string } | null | any, // Cast to match expected
    subTitle: companyRecord.description ?? "",
    categories: companyRecord.categories.map((c) => c.name),
    url: companyRecord.websiteUrl ?? "",
  };

  return <CompanyCard company={company} />;
}
