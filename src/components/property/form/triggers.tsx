import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";

interface PropertyFormTriggerProps {
  editMode?: boolean;
}

// Default trigger buttons for property form in add or edit mode
export function PropertyFormTrigger({
  editMode = false,
}: PropertyFormTriggerProps) {
  if (editMode) {
    return (
      <Button variant="outline" size="sm" className="cursor-pointer">
        <Pencil className="h-4 w-4 text-blue-600" />
      </Button>
    );
  }

  return (
    <div className="flex w-full items-center justify-start gap-x-2 px-4">
      <h1 className="text-xl font-bold">Property</h1>
      <Button className="h-6 w-6 cursor-pointer rounded-full" size="icon">
        <Plus strokeWidth={2.5} />
      </Button>
    </div>
  );
}
