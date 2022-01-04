import { OAuth2Client } from 'google-auth-library'
import { auth as log } from '../utils/debug'

const client = new OAuth2Client(process.env.OAUTH_CLIENT)

const googleAuth = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.OAUTH_CLIENT,
  })
  const payload = ticket.getPayload()
  log(payload.name + ' verified')
  return payload
}

export const middleware = async (req, res, next) => {
  try {
    const ticket = await client.getTokenInfo(
      req.headers.authorization.split(' ')[1]
    )
    log(ticket)
    next()
  } catch (e) {
    log('error', e.message)
    res.status(401).send()
  }
}

export default googleAuth
