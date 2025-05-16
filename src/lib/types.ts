import { z } from "zod";
import { assetTypes, modelTypes } from "./constants";

export const propertyInputSchema = z.object({
  name: z.string().min(1),
  assetType: z.enum(assetTypes),
  model: z.enum(modelTypes),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  note: z.string().optional().nullable(),
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;

export const propertyOutputSchema = propertyInputSchema.extend({
  id: z.string().uuid(),
  assetType: z.string(),
  model: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Property = z.infer<typeof propertyOutputSchema>;
