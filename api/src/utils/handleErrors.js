import { error } from './debug'
import { Error as MongooseError } from 'mongoose'
import UnauthorizedError from './UnauthorizedError'
import NotFoundError from './NotFoundError'
import BadRequestError from './BadRequestError'
import ForbiddenError from './ForbiddenError'

const handleErrors = (err, res) => {
  error(err)
  if (err instanceof MongooseError.ValidationError) {
    res.status(400)
  } else if (
    err instanceof MongooseError.DocumentNotFoundError ||
    err instanceof MongooseError.CastError
  ) {
    res.status(404)
  } else if (err instanceof ForbiddenError) {
    res.status(403)
  } else if (err instanceof UnauthorizedError) {
    res.status(401)
  } else if (err instanceof BadRequestError) {
    res.status(400)
  } else if (err instanceof NotFoundError) {
    res.status(404)
  } else {
    res.status(500)
  }
  res.send(formatError(err))
}

export const formatError = (err) => {
  let response = {}
  if (err.name) response.name = err.name
  if (err.message) response.message = err.message
  return response
}

export default handleErrors
