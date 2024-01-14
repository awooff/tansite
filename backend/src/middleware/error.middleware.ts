import ExpressError from '../utils/types/error.type'
import type HttpException from '../utils/exceptions/http.exception'
import { Request, Response } from 'express'

export default function errorMiddleware(err: HttpException, req: Request, res: Response, next: any): void {

  if (typeof err === 'string') { err = new ExpressError(err) }

  if (err instanceof ExpressError) {
    res.status(err.status).send({
      body: req.body || {},
      path: req.path,
      headers: req.headers,
      message: err.toString()
    })
  } else {
    res.status(err.status).send({
      error: 'internal server error'
    })
  }
}
