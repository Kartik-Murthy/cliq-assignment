import { propertyInputSchema } from "@/lib/types";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { properties } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const propertyRouter = createTRPCRouter({
  // Create a property
  create: protectedProcedure
    .input(propertyInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.auth.userId;
        if (!userId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        await ctx.db.insert(properties).values({ ...input, userId });
      } catch (error) {
        console.error("Error creating property:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create property",
        });
      }
    }),

  // Get all properties for the user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.auth.userId;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authorized",
        });
      }

      const propertiesList = await ctx.db.query.properties.findMany({
        where: (properties, { eq }) => eq(properties.userId, userId),
        orderBy: (properties, { desc }) => [desc(properties.createdAt)],
      });

      return propertiesList;
    } catch (error) {
      console.error("Error fetching all properties:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch properties",
      });
    }
  }),

  // Edit a property
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: propertyInputSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.auth.userId;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authorized",
          });
        }

        // Fetch the property for the user
        const existingProperty = await ctx.db.query.properties.findFirst({
          where: (properties, { eq }) =>
            eq(properties.id, input.id) && eq(properties.userId, userId),
        });

        if (!existingProperty) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Property not found",
          });
        }

        // Update the property
        await ctx.db
          .update(properties)
          .set(input.data)
          .where(eq(properties.id, input.id));

        return { message: "Property updated successfully" };
      } catch (error) {
        console.error("Error updating property:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update property",
        });
      }
    }),

  // Delete a property
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.auth.userId;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authorized",
          });
        }

        // Fetch the property for the user
        const existingProperty = await ctx.db.query.properties.findFirst({
          where: (properties, { eq }) =>
            eq(properties.id, input.id) && eq(properties.userId, userId),
        });

        if (!existingProperty) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Property not found",
          });
        }

        // Delete the property
        await ctx.db.delete(properties).where(eq(properties.id, input.id));
        return { message: "Property deleted successfully" };
      } catch (error) {
        console.error("Error deleting property:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete property",
        });
      }
    }),
});
