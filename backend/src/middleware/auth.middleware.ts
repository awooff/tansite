import { Route } from '@/utils/types/route.type'
import { server } from 'index';
import { Request, Response } from 'express';
import { Groups } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default async function authMiddleware(route: Route, req: Request, res: Response, next: any): Promise<void> {

  if (route.settings?.groupOnly !== Groups.Guest) {

    if (!req.sessionID || !req.session.currentWebToken || !!(server.prisma.session.findFirst({
      where: {
        id: req.sessionID
      }
    })) || (route.settings?.groupOnly === 'Admin' && req.session.group !== 'Admin') || !jwt.verify(req.session.currentWebToken, process.env.JWT_SECRET)) {
      res.status(501).send({
        error: 'user is not authorisized too see this page'
      });
      return;
    }

    //update last action
    await server.prisma.session.update({
      where: {
        id: req.sessionID
      },
      data: {
        lastAction: new Date(Date.now())
      }
    })
  }

  next();
}