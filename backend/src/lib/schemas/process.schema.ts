import * as z from 'zod'

export const processSchema = z.object({
  type: z.string().trim().max(24).refine((arg) => {
    return !arg.includes(' ')
  }),
})

export type ProcessSchemaType = z.infer<typeof processSchema>
