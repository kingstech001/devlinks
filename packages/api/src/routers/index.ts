import { protectedProcedure, publicProcedure, router } from "../index";
import { db, eq } from "@devlinks/db";
import { links } from "@devlinks/db/schema/link";
import { profile } from "@devlinks/db/schema/profile";
import { z } from "zod";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),

  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),

  // -----------------------------
  // LINKS (existing)
  // -----------------------------
  getLinks: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(links)
      .where(eq(links.userId, ctx.session.user.id));
  }),

  getPublicLinks: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await db.select().from(links).where(eq(links.userId, input.userId));
    }),

  addLink: protectedProcedure
    .input(z.object({ title: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newLink = await db
        .insert(links)
        .values({
          userId: ctx.session.user.id,
          title: input.title,
          url: input.url,
        })
        .returning();

      return newLink[0];
    }),

  updateLink: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        url: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedLink = await db
        .update(links)
        .set({
          ...(input.title !== undefined && { title: input.title }),
          ...(input.url !== undefined && { url: input.url }),
        })
        .where(eq(links.id, input.id))
        .returning();

      return updatedLink[0];
    }),

  deleteLink: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(links).where(eq(links.id, input.id));
      return { success: true };
    }),

  // -----------------------------
  // PROFILE (new)
  // -----------------------------
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const result = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, ctx.session.user.id));

    return result[0] ?? null;
  }),

  getPublicProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(profile)
        .where(eq(profile.userId, input.userId));

      return result[0] ?? null;
    }),

  upsertProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await db
        .select()
        .from(profile)
        .where(eq(profile.userId, ctx.session.user.id));

      if (existing.length === 0) {
        const inserted = await db
          .insert(profile)
          .values({
            userId: ctx.session.user.id,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            image: input.image,
          })
          .returning();

        return inserted[0];
      }

      const updated = await db
        .update(profile)
        .set({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          image: input.image,
        })
        .where(eq(profile.userId, ctx.session.user.id))
        .returning();

      return updated[0];
    }),
});

export type AppRouter = typeof appRouter;
