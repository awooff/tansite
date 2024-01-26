import * as z from 'zod'

export const fetchSchema = z.object({
  ip: z.string().trim().max(24).refine((arg) => {
    return !arg.includes(' ')
  }),
})

export type FetchSchemaType = z.infer<typeof fetchSchema>
