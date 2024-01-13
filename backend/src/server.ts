import express, { type Application, type IRoute } from 'express'
import path from 'path'
import { glob } from 'glob'
import { Route } from '@/utils/types/route.type'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import expressSession from 'express-session'
import dotenv from 'dotenv'
import ExpressError from './utils/types/error.type'
import httpMiddleware from './middleware/http.middleware'

dotenv.config({
  override: true
})

class Server {
  public server: Application
  public routes: IRoute[]

  constructor() {
    this.server = express()
    this.routes = []
    this.initialiseRoutes()
    this.initialiseMiddleware()
  }

  public start() {
    this.server.listen(process.env.PORT, () => {
      console.log(`online @ ${process.env.PUBLIC_URL}:${process.env.PORT}`)
    })
  }

  /**
   * Initialise all the middlewares we want our server to use.
   * Should also ideally handle authentication checks as well!
   */
  private initialiseMiddleware() {
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
      if (typeof err === 'string') { err = new ExpressError(err) }

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
  private async initialiseRoutes() {
    const files = await glob([path.join(__dirname, 'routes', '**/*.ts'), path.join(__dirname, 'routes', '**/*.js')])
    await Promise.all(files.map(async (file) => {
      let route = await require(file) as Route
      route = (route as any).default || (route as any).route

      if ((route?.settings) == null) { route.settings = {} }

      if (route.settings?.route === undefined) {
        const parsedPath = path.parse(file)
        route.settings.route = file.replace(path.join(__dirname, 'routes'), '').replace(parsedPath.ext, '')
      }

      const newRoute = this.server.route(route.settings.route)

      if (route.get != null) {
        if (route?.settings?.groupOnly) {
          newRoute.get((req, res, next) => {

            // check jwt here
          })
        }

        newRoute.get(route.get)
      }

      if (route.post != null) { newRoute.post(route.post) }

      console.log(`registered ${typeof route.settings.route === 'string'
        ? route.settings.route
        : JSON.stringify(route.settings.route, null, 2)}`)

      this.routes.push(newRoute)
    }))
  }
}

export default Server
