"use client";

import PropertyForm from "@/components/property/form/property-form";
import { api } from "@/trpc/react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { createPropertyColumns, defaultColDef } from "./column-config";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function PropertyTable() {
  const [properties] = api.property.getAll.useSuspenseQuery();
  const utils = api.useUtils();

  const { mutate: deleteProperty } = api.property.delete.useMutation({
    onSuccess: () => {
      utils.property.getAll
        .invalidate()
        .then(() => toast.success("Property deleted successfully"))
        .catch((error) => {
          toast.error("Failed to delete property");
          console.error("Failed to delete property", error);
        });
    },
  });

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm("Are you sure you want to delete this property?")) {
        deleteProperty({ id });
      }
    },
    [deleteProperty],
  );

  const onGridReady = useCallback(
    (params: { api: { sizeColumnsToFit: () => void } }) => {
      params.api.sizeColumnsToFit();
    },
    [],
  );

  return (
    <div>
      <div className="flex justify-end py-4">
        <PropertyForm />
      </div>
      <div className="ag-theme-alpine h-[60vh] w-full p-4">
        <AgGridReact
          rowData={properties ?? []}
          columnDefs={createPropertyColumns(handleDelete)}
          defaultColDef={defaultColDef}
          animateRows
          pagination
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}
