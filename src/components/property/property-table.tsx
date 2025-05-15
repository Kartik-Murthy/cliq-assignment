"use client";

import { Button } from "@/components/ui/button";
import { type Property, type PropertyInput } from "@/lib/types";
import { api } from "@/trpc/react";
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { FolderClosed, Mail, Trash2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import PropertyForm from "./property-form";

// Register modules once outside the component
ModuleRegistry.registerModules([AllCommunityModule]);

// Extracted cell renderer components
const IconRenderer = () => (
  <div className="flex h-full items-center justify-center">
    <FolderClosed className="h-5 w-5 text-gray-600" />
  </div>
);

const DateRenderer = ({ value }: { value: Date | undefined }) => (
  <p>{value?.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
);

interface ActionsRendererProps {
  data: Property;
  onDelete: (id: string) => void;
}

const ActionsRenderer = ({ data, onDelete }: ActionsRendererProps) => (
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

export default function PropertyTable() {
  const { data: properties, isLoading } = api.property.getAll.useQuery();
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

  // Column definitions with memoization
  const columnDefs = useMemo<ColDef<Property>[]>(
    () => [
      {
        headerName: "",
        width: 60,
        cellRenderer: IconRenderer,
        sortable: false,
        filter: false,
      },
      {
        headerName: "Property Name",
        field: "name",
        flex: 1,
      },
      {
        headerName: "Asset Type",
        field: "assetType",
        flex: 1,
      },
      {
        headerName: "Model Used",
        field: "model",
        flex: 1,
      },
      {
        headerName: "Created At",
        field: "createdAt",
        flex: 1,
        cellRenderer: DateRenderer,
        valueGetter: (params) => params.data?.createdAt,
        filter: "agDateColumnFilter",
      },
      {
        headerName: "Updated At",
        field: "updatedAt",
        flex: 1,
        cellRenderer: DateRenderer,
        valueGetter: (params) => params.data?.updatedAt,
      },
      {
        flex: 1,
        cellRenderer: (params: { data: Property }) => (
          <ActionsRenderer data={params.data} onDelete={handleDelete} />
        ),
        sortable: false,
        filter: false,
      },
    ],
    [handleDelete],
  );

  const defaultColDef = useMemo(
    () => ({
      suppressMovable: true,
      resizable: false,
      sortable: true,
      filter: true,
    }),
    [],
  );

  const onGridReady = useCallback(
    (params: { api: { sizeColumnsToFit: () => void } }) => {
      params.api.sizeColumnsToFit();
    },
    [],
  );

  if (isLoading) {
    return <div className="p-4 text-center">Loading properties...</div>;
  }

  return (
    <div>
      <div className="flex justify-end py-2">
        <PropertyForm />
      </div>
      <div className="ag-theme-alpine my-2 h-[60vh] w-full p-3">
        <AgGridReact
          rowData={properties ?? []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows
          pagination
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}
