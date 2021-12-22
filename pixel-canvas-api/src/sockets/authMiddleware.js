import googleAuth from '../auth/googleAuth'
import { sockets as log } from '../utils/debug'

const authMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    log('No auth present')
    next(new Error('No auth present'))
  } else {
    const payload = await googleAuth(token)
    log(payload.sub + ' verified')
    socket.user = payload.sub
    next()
  }
}

export default authMiddleware
