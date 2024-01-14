import express, { type Application, type IRoute } from 'express'
import path from 'path'
import { glob } from 'glob'
import { Groups, Route } from './utils/types/route.type'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import expressSession from 'express-session'
import dotenv from 'dotenv'
import ExpressError from './utils/types/error.type'
import httpMiddleware from './middleware/http.middleware'
import { PrismaClient } from '@prisma/client'

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
    this.initialiseRoutes()
    this.initialiseMiddleware()
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
      resave: false
    }))

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

      if (route.get != null) {

        newRoute.get(route.get)
      }

      if (route.post != null) {
        newRoute.post(route.post)
      }

      this.routes.push(newRoute)
    }));

    console.table(this.routes.map((route) => {
      let settings = { ...(route as any).settings }

      settings.groupOnly = Groups[settings.groupOnly]
      return { ...settings, get: !!(route as any).source?.get, post: !!(route as any).source?.post }
    }))
  }
}

export default Server
