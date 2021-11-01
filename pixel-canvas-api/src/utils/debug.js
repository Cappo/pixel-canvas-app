import debug from 'debug'

export const error = debug('pixels:error')
export const log = debug('pixels:log')
export const start = debug('pixels:start')
export const sockets = debug('pixels:sockets')
export const redis = debug('pixels:redis')

export default {
  error,
  log,
  start,
}
