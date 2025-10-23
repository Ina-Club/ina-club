import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";

export async function GET(req: Request) {
    try {
        const rows = await prisma.company.findMany({
            select: {
                id: true,
                logo: true,
                title: true,
                description: true,
                categories: true,
                websiteUrl: true
            },
            orderBy: { createdAt: "desc" },
        });

        const data = rows.map((company) => ({
            id: company.id,
            title: company.title,
            logo: company.logo,
            subTitle: company.description,
            categories: company.categories.map((category) => category.name),
            url: company.websiteUrl
        }));

        return NextResponse.json({ companies: data });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "שגיאה בשליפת חברות" }, { status: 500 });
    }
}
