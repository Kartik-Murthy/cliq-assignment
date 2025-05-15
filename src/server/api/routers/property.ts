import { z } from "zod";

import { propertyInputSchema } from "@/lib/types";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { properties } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const propertyRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(propertyInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.auth.userId;
        if (!userId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        await ctx.db.insert(properties).values({ ...input, userId });
      } catch (err) {
        console.error("Error in create:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.auth.userId;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const property = await ctx.db.query.properties.findFirst({
        where: (properties, { eq }) => eq(properties.userId, userId),
        orderBy: (properties, { desc }) => [desc(properties.createdAt)],
      });

      return property ?? null;
    } catch (err) {
      console.error("Error in getLatest:", err);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
});
