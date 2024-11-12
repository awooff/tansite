import * as z from "zod";
export const email = z.string().trim().email();
export type Email = z.infer<typeof email>;
export const username = z
	.string()
	.trim()
	.min(3)
	.max(24)
	.refine((arg) => !arg.includes(" ") && arg.match(/[^a-z0-9]/gm) === null);
export type Username = z.infer<typeof username>;
export const password = z.string().trim().min(4);
export type Password = z.infer<typeof password>;
