import type { PropertyInput } from "./types";

export const assetTypes = [
  "Multifamily",
  "Office",
  "Retail",
  "Industrial",
] as const;
export const modelTypes = ["Standard", "Premium", "Luxury", "Custom"] as const;

export const defaultProperty: Partial<PropertyInput> = {
  name: "",
  assetType: undefined,
  model: undefined,
  address: "",
  city: "",
  state: "",
  zip: "",
  note: "",
};
