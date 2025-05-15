import PropertyForm from "@/components/property/property-form";
import PropertyTable from "@/components/property/property-table";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main>
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center justify-start gap-x-2">
            <h1 className="text-xl font-bold">Property</h1>
            <PropertyForm />
          </div>
        </div>
        <PropertyTable />
      </main>
    </HydrateClient>
  );
}
