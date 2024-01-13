import { Route } from '../types/route'
import { routes } from '../index'

const index = {

  settings: {
    route: [
      '/',
      '/index',
      '/home'
    ]
  },

  async get(req, res, error) {
    const newRoutes = {} as any

    routes.forEach((route) => {
      if (typeof route.path !== 'string') {
        (route.path as string[]).forEach((path) => {
          newRoutes[path] = {
            get: route.get !== undefined,
            post: route.post !== undefined,
            paths: route.path
          }
        })
      } else {
        newRoutes[route.path] = {
          get: route.get !== undefined,
          post: route.post !== undefined,
          paths: route.path
        }
      }
    })
    res.send(
      {
        routes: newRoutes
      }
    )
  }
} satisfies Route

export default index
