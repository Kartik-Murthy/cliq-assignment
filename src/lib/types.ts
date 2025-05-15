import { z } from "zod";

const assetTypes = ["Multifamily", "Office", "Retail", "Industrial"] as const;
const modelTypes = ["Standard", "Premium", "Luxury", "Custom"] as const;

export const propertyInputSchema = z.object({
  name: z.string().min(1),
  assetType: z.enum(assetTypes),
  model: z.enum(modelTypes),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  note: z.string().optional(),
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;

export const propertyOutputSchema = propertyInputSchema.extend({
  id: z.string().uuid(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Property = z.infer<typeof propertyOutputSchema>;
