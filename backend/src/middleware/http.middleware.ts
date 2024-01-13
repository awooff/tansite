import ExpressError from '../utils/types/error.type'
import type HttpException from '@/utils/exceptions/http.exception'

export default function httpMiddleware(err: HttpException, req: any, res: any, next: any): void {
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
}
