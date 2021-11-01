import { error } from './debug'
import { Error as MongooseError } from 'mongoose'
import HttpStatus from 'http-status-codes'
import UnauthorizedError from './UnauthorizedError'
import NotFoundError from './NotFoundError'
import BadRequestError from './BadRequestError'
import ForbiddenError from './ForbiddenError'

const handleErrors = (err, res) => {
  error(err)
  if (err instanceof MongooseError.ValidationError) {
    res.status(HttpStatus.BAD_REQUEST)
  } else if (
    err instanceof MongooseError.DocumentNotFoundError ||
    err instanceof MongooseError.CastError
  ) {
    res.status(HttpStatus.NOT_FOUND)
  } else if (err instanceof ForbiddenError) {
    res.status(HttpStatus.FORBIDDEN)
  } else if (err instanceof UnauthorizedError) {
    res.status(HttpStatus.UNAUTHORIZED)
  } else if (err instanceof BadRequestError) {
    res.status(HttpStatus.BAD_REQUEST)
  } else if (err instanceof NotFoundError) {
    res.status(HttpStatus.NOT_FOUND)
  } else {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
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
