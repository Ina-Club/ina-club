import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { DEFAULT_PAGINATION, MAX_PAGINATION_LIMIT } from "@/app/config/pagination";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor") || undefined;
        const rawLimit: number = Number(searchParams.get("limit")) || DEFAULT_PAGINATION;
        const limit: number = Math.min(rawLimit, MAX_PAGINATION_LIMIT);

        const rows = await prisma.company.findMany({
            take: limit + 1,
            select: {
                id: true,
                logo: true,
                title: true,
                description: true,
                categories: true,
                websiteUrl: true
            },
            orderBy: { createdAt: "desc" },
            ...(cursor && { cursor: { id: cursor } }),
        });

        let nextCursor: string | null = null;
        if (rows.length > limit) {
            const nextItem = rows.pop()!;
            nextCursor = nextItem.id;
        }

        const data = rows.map((company) => ({
            id: company.id,
            title: company.title,
            logo: company.logo,
            subTitle: company.description,
            categories: company.categories.map((category) => category.name),
            url: company.websiteUrl
        }));

        return NextResponse.json({ companies: data, nextCursor });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "שגיאה בטעינת חברות" }, { status: 500 });
    }
}
