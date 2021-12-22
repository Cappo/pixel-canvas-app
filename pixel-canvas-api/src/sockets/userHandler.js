import { log } from '../utils/debug'

const users = {}

const userHandler = (io, socket) => {
  const login = (name, cb) => {
    users[socket.id] = name
    cb(users)
    socket.broadcast.emit('join', [socket.id, name])
    log('login', name)
  }

  const logout = () => {
    const name = users[socket.id]
    delete users[socket.id]
    socket.broadcast.emit('leave', socket.id)
    log('logout', name)
  }

  socket.on('login', login)
  socket.on('logout', logout)
  socket.on('disconnect', logout)
}

export default userHandler
