import { Groups } from '@prisma/client'
import type { RequestHandler } from 'express'


export type Route = {
  settings?: {
    groupOnly?: Groups,
    route?: string | string[],
    title?: string,
    description?: string
  }

  get?: RequestHandler

  post?: RequestHandler
}
