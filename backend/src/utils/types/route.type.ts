import type { Response, Request, RequestHandler } from 'express'

export type Route = {
  settings?: {
    groupOnly?: 'user' | 'guest' | 'admin'
    route?: string | string[]
  }

  get?: RequestHandler

  post?: RequestHandler
}
