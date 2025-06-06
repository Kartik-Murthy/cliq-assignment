import PropertyTable from "@/components/property/table/property-table";
import { api, HydrateClient } from "@/trpc/server";
export const dynamic = "force-dynamic";

export default async function PropertyPage() {
  await api.property.getAll.prefetch();

  return (
    <HydrateClient>
      <main>
        <PropertyTable />
      </main>
    </HydrateClient>
  );
}
