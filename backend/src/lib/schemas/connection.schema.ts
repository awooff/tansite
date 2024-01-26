import * as z from 'zod'

export const connectionSchema = z.object({
  connectionId: z.string().trim().min(3).max(24).refine((arg) => {
    return !arg.includes(' ') && (arg.match(/[^a-zA-Z0-9]/gm) == null)
  }),
  ip: z.string()
})

export type ConnectiomSchemaType = z.infer<typeof connectionSchema>
