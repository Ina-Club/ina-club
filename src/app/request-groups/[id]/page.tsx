import { notFound } from "next/navigation";
import { RequestGroup } from "lib/dal";
import { mockRequestGroups } from "lib/mock";

async function getRequestGroup(id: string): Promise<RequestGroup | null> {
    const url = `${"http://localhost:3000"}/api/users/${id}`;
    const res = await fetch(url, { cache: "no-store" }); // or { next: { revalidate: 60 } } for ISR
    if (res.status === 404)
        return null;
    return res.json();
}

export default async function Page({ params }: { params: { id: string } }) {
    // const requestGroup = await getRequestGroup(params.id);
    const allRequestGroups: RequestGroup[] = mockRequestGroups.concat(mockRequestGroups);
    const requestGroup = allRequestGroups.filter((rg) => rg.id === params.id)
    if (!requestGroup)
        return notFound();

    return (
        <main style={{ padding: 24 }}>
            <p><b>Name:</b> {requestGroup[0].title}</p>
            <p><b>Email:</b> {requestGroup[0].category}</p>
        </main>
    );
}
