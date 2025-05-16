import PropertyForm from "@/components/property/form/property-form";
import { Button } from "@/components/ui/button";
import { type Property, type PropertyInput } from "@/lib/types";
import { Mail, Trash2 } from "lucide-react";

interface ActionsRendererProps {
  data: Property;
  onDelete: (id: string) => void;
}

export const ActionsRenderer = ({ data, onDelete }: ActionsRendererProps) => (
  <div className="flex h-full items-center justify-end space-x-3">
    <PropertyForm
      editMode={true}
      propertyToEdit={data as PropertyInput & { id: string }}
    />
    <Button
      variant="outline"
      size="sm"
      className="cursor-pointer"
      onClick={() => onDelete(data.id)}
    >
      <Trash2 className="h-4 w-4 text-red-600" />
    </Button>
    <Button variant="outline" size="sm" disabled>
      <Mail className="h-4 w-4 text-green-600" />
    </Button>
  </div>
);
