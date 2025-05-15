import Pagination from "@/components/property/pagination";
import { Button } from "@/components/ui/button";
import { api, HydrateClient } from "@/trpc/server";
import { Plus } from "lucide-react";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="min-h-screen">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center justify-start gap-x-2">
            <h1 className="text-xl font-bold">Property</h1>
            <Button className="rounded-full" size={"icon"}>
              <Plus strokeWidth={3} />
            </Button>
          </div>
          <Pagination totalItems={500} />
        </div>
      </main>
    </HydrateClient>
  );
}
