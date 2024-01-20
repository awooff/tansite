import express, { type Application, type IRoute, Request, Response } from 'express'
import path from 'path'
import { glob } from 'glob'
import { Route } from './lib/types/route.type'
import { Groups, PrismaClient } from '@prisma/client'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import expressSession from 'express-session'
import cors from 'cors'
import dotenv from 'dotenv'
import errorMiddleware from './middleware/error.middleware'
import bodyparse from 'body-parser'
import authMiddleware from './middleware/auth.middleware'

//to extend the express-session type
import './lib/types/session.type'

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
    this.server.use(cors({
      origin: ["http://localhost:5173", "http://localhost:5174"],
      optionsSuccessStatus: 200, // For legacy browser support
      credentials: true
    }))
    this.server.use(expressSession({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        sameSite: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7 * 1000
      },
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
      (newRoute as any).source = route

      if (route.get != null) {
        newRoute.get((req: Request, res: Response, next: any) => {
          next(route)
        },
          authMiddleware, route.get, errorMiddleware)
      }

      if (route.post != null) {
        newRoute.post((req: Request, res: Response, next: any) => {
          // send the route class to the next middleware
          next(route)
        }, authMiddleware, route.post, errorMiddleware)
      }

      this.routes.push(newRoute)
    }))

    console.table(this.routes.map((route) => {
      const settings = { ...(route as any).settings }
      return { ...settings, get: !!(route as any).source?.get, post: !!(route as any).source?.post }
    }))
  }
}

export default Server
