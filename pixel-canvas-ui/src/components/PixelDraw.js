import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import './PixelDraw.css'
import Users from './Users'
import Canvas from './Canvas'
import io from 'socket.io-client'
import { randomName } from '../utils'
import FloatingBox from './FloatingBox'

const PixelDraw = () => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io('http://localhost:4000')
    setSocket(newSocket)
    return () => {
      newSocket.removeAllListeners()
      newSocket.emit('logout', randomName)
      newSocket.close()
    }
  }, [])

  const  renderCanvas = () => {
    return socket ? <Canvas socket={socket} /> : <FloatingBox top={10} left={10}>Connecting...</FloatingBox>
  }

  const renderUsers = () => {
    return socket ? <Users socket={socket} /> : null
  }

  return (
    <div className="application">
      <Helmet title="DrawPixel" />
      <div id="view-port">
        {renderCanvas()}
        {renderUsers()}
      </div>
    </div>
  )
}

export default PixelDraw
