import * as z from 'zod'
import { username, password } from './user.schema'
export const loginSchema = z.object({
	username,
	password
})

export type LoginSchema = z.infer<typeof loginSchema>
