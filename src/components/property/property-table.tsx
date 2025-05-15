"use client";

import { Button } from "@/components/ui/button";
import { type Property } from "@/lib/types";
import { api } from "@/trpc/react";
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { FolderClosed, Mail, Trash2 } from "lucide-react";
import { useCallback } from "react";
import PropertyForm from "./property-form"; // Import the renamed component

ModuleRegistry.registerModules([AllCommunityModule]);

const IconRenderer = () => (
  <div className="flex h-full items-center justify-center">
    <FolderClosed className="h-5 w-5 text-gray-600" />
  </div>
);

const DateRenderer = ({ date }: { date: Date | undefined }) => (
  <p>
    {date?.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}
  </p>
);

interface ActionsRendererProps {
  data: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

const ActionsRenderer = ({ data, onEdit, onDelete }: ActionsRendererProps) => (
  <div className="flex h-full items-center justify-end space-x-3">
    <PropertyForm editMode={true} propertyToEdit={data} />
    <Button
      variant="outline"
      size="sm"
      className="cursor-pointer"
      onClick={() => onDelete(data.id)}
    >
      <Trash2 className="h-4 w-4 text-red-600" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      disabled
      onClick={() => console.log("Email:", data.id)}
    >
      <Mail className="h-4 w-4 text-green-600" />
    </Button>
  </div>
);

export default function PropertyTable() {
  const { data: properties, isLoading } = api.property.getAll.useQuery();
  const utils = api.useUtils();

  const { mutate: deleteProperty } = api.property.delete.useMutation({
    onSuccess: async () => {
      await utils.property.getAll.invalidate();
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      deleteProperty({ id });
    }
  };

  // Column definitions with proper typing
  const columnDefs = useCallback(
    () =>
      [
        {
          headerName: "",
          field: undefined,
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
          cellRenderer: (params: { data: Property }) => (
            <DateRenderer date={params.data.createdAt} />
          ),
        },
        {
          headerName: "Updated At",
          field: "updatedAt",
          flex: 1,
          cellRenderer: (params: { data: Property }) => (
            <DateRenderer date={params.data.updatedAt} />
          ),
        },
        {
          field: undefined,
          flex: 1,
          cellRenderer: (params: { data: Property }) => (
            <ActionsRenderer
              data={params.data}
              onDelete={handleDelete}
              onEdit={() => {
                console.log("delete");
              }} // Not needed but provided for completeness
            />
          ),
          sortable: false,
          filter: false,
        },
      ] as ColDef<Property>[],
    [handleDelete],
  );

  const defaultColDef = {
    suppressMovable: true,
    resizable: false,
    sortable: true,
    filter: true,
  };

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
        <PropertyForm trigger={<div></div>} />
      </div>
      <div className="ag-theme-alpine my-2 h-[60vh] w-full p-3">
        <AgGridReact
          rowData={properties ?? []}
          columnDefs={columnDefs()}
          defaultColDef={defaultColDef}
          animateRows
          pagination
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}
