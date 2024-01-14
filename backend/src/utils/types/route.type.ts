import type { Response, Request, RequestHandler } from 'express'

export enum Groups {
  GUEST,
  ADMIN,
  USER,
}

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
