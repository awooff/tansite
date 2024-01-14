import express, { type Application, type IRoute, Request, Response } from 'express'
import path from 'path'
import { glob } from 'glob'
import { Route } from './utils/types/route.type'
import { Groups } from '@prisma/client'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import expressSession from 'express-session'
import dotenv from 'dotenv'
import ExpressError from './utils/types/error.type'
import httpMiddleware from './middleware/http.middleware'
import { PrismaClient } from '@prisma/client'
import bodyparse from 'body-parser';
import authMiddleware from './middleware/auth.middleware'

//extend the session data object with our stuff
declare module "express-session" {
  interface SessionData {
    userId: number
    currentComputerId: number
    currentWebToken: string
    group: Groups
  }
}

dotenv.config({
  override: true
})

class Server {
  public server: Application
  public routes: IRoute[]
  public prisma: PrismaClient

  constructor() {
    this.server = express()
    this.prisma = new PrismaClient()
    this.routes = []

    this.initialiseMiddleware()
    this.initialiseRoutes()

    //error handler route
    this.server.use((err: any, req: any, res: any, next: any) => {
      if (typeof err === 'string') {
        err = new ExpressError(err)
      }

      if (err instanceof ExpressError) {
        res.status(err.status).send({
          body: req.body || {},
          parameters: req.params,
          headers: req.headers,
          message: err.toString()
        })
      } else {
        res.status(err.status).send({
          error: 'internal server error'
        })
      }
    })
  }

  public start() {
    this.server.listen(process.env.PORT, () => {
      console.log('--------------------------------------------------')
      console.log(`(=￣ω￣=) online @ ${process.env.PUBLIC_URL}:${process.env.PORT} ♡ ╮(╯_╰)╭`)
      console.log('--------------------------------------------------')
    })
  }

  /**
   * Initialise all the middlewares we want our server to use.
   * Should also ideally handle authentication checks as well!
   */
  private initialiseMiddleware(): void {
    this.server.use(helmet())
    this.server.use(morgan('dev'))
    this.server.use(compression())
    this.server.use(httpMiddleware)
    this.server.use(expressSession({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        secure: true
      }
    }))
    this.server.use(bodyparse.json())
  }

  /**
   * Add all our routes to the public `routes` array.
   */
  private async initialiseRoutes(): Promise<void> {
    const files = await glob([path.join(__dirname, 'routes', '**/*.ts'), path.join(__dirname, 'routes', '**/*.js')])
    await Promise.all(files.map(async (file) => {
      let route = await require(file) as Route
      route = (route as any).default || (route as any).route

      if ((route?.settings) == null) {
        route.settings = {}
      }

      if (route.settings?.route === undefined) {
        const parsedPath = path.parse(file)
        route.settings.route = file.replace(path.join(__dirname, 'routes'), '').replace(parsedPath.ext, '')
      }

      const newRoute = this.server.route(route.settings.route);
      // bad
      (newRoute as any).settings = route.settings;
      // bad
      (newRoute as any).source = route;

      if (route.get != null)
        newRoute.get((req: Request, res: Response, next: any) => {
          next(route)
        },
          authMiddleware, route.get)

      if (route.post != null)
        newRoute.post((req: Request, res: Response, next: any) => {
          //send the route class to the next middleware
          next(route)
        }, authMiddleware, route.post)

      this.routes.push(newRoute)
    }));

    console.table(this.routes.map((route) => {
      let settings = { ...(route as any).settings }
      return { ...settings, get: !!(route as any).source?.get, post: !!(route as any).source?.post }
    }))
  }
}

export default Server
