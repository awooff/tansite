import { Route } from '@/lib/types/route.type'
import { server } from '../index'
import { Request, Response } from 'express'
import { Groups } from '@prisma/client'
import jwt from 'jsonwebtoken'

export default async function authMiddleware (route: Route, req: Request, res: Response, next: any): Promise<void> {
  // if the current route group is set and is not only visible to guests
  if (route.settings?.groupOnly && route.settings?.groupOnly !== Groups.Guest) {
    const authToken = req.headers.authorization?.toString()

    // if no session, no current web token in session, authToken not set in header, currentWebToken is not equal to auth token in header, and there is no db session of this session id, and the JWT is invalid
    if (!req.sessionID || !req.session.currentWebToken ||
      !authToken ||
      req.session.currentWebToken !== authToken ||
      !jwt.verify(authToken, process.env.JWT_SECRET) ||
      !!(server.prisma.session.findFirst({
        where: {
          id: req.sessionID
        }
      })) ||
      (route.settings?.groupOnly === 'Admin' && req.session.group !== 'Admin')) {
      res.status(401).send({
        body: req.body || {},
        path: req.path,
        headers: req.headers,
        message: 'user is not authorized to view this content'
      })
      return
    }

    // update last action
    await server.prisma.session.update({
      where: {
        id: req.sessionID
      },
      data: {
        lastAction: new Date(Date.now())
      }
    })

    // update last action on user table
    await server.prisma.user.update({
      where: {
        id: req.session.userId
      },
      data: {
        lastAction: new Date(Date.now())
      }
    })
  }

  next()
}
