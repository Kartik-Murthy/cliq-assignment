import { type Property } from "@/lib/types";
import { type ColDef } from "ag-grid-community";
import {
  ActionsRenderer,
  DateRenderer,
  IconRenderer,
} from "./column-renderers";

export const createPropertyColumns = (
  handleDelete: (id: string) => void,
): ColDef<Property>[] => [
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
    filter: false,
  },
  {
    headerName: "Updated At",
    field: "updatedAt",
    flex: 1,
    cellRenderer: DateRenderer,
    filter: false,
  },
  {
    flex: 1,
    cellRenderer: (params: { data: Property }) => (
      <ActionsRenderer data={params.data} onDelete={handleDelete} />
    ),
    sortable: false,
    filter: false,
  },
];

export const defaultColDef = {
  suppressMovable: true,
  resizable: false,
  sortable: true,
  filter: true,
};
