import * as z from "zod";

export const profileUpdateSchema = z.object({
  user: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      bio: z.string(),
      location: z.string(),
    })
    .optional(),
  avatar: z
    .object({
      body: z.string(),
      hair: z.string(),
    })
    .optional(),
});

export type profileUpdateSchemaType = z.infer<typeof profileUpdateSchema>;

export const profileFetchSchema = z.object({
  userId: z.number(),
});

export type profileFetchSchemaType = z.infer<typeof profileFetchSchema>;
