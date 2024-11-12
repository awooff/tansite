import * as z from "zod";
import { username, password, email } from "./user.schema";
export const registerSchema = z.object({
	email,
	username,
	password,
	terms: z.boolean(),
	privacy: z.boolean(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
