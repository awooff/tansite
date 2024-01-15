import * as z from 'zod'

export const switchSchema = z.object({
  computerId: z.string().trim().min(12),
})

export type SwitchSchemaType = z.infer<typeof switchSchema>
