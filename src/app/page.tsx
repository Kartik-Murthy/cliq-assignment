import PropertyTable from "@/components/property/property-table";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main>
        <PropertyTable />
      </main>
    </HydrateClient>
  );
}
