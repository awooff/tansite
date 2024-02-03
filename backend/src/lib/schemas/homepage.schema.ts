import * as z from "zod";

export const homepageSchema = z.object({
  ip: z
    .string()
    .trim()
    .min(3)
    .max(24)
    .optional()
    .refine((arg) => {
      return arg ? !arg.includes(" ") : true;
    }),
  domain: z
    .string()
    .trim()
    .min(3)
    .optional()
    .refine((arg) => {
      return arg ? !arg.includes(" ") : true;
    }),
});

export type HomepageSchemaType = z.infer<typeof homepageSchema>;
