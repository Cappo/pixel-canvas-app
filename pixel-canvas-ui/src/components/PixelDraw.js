import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import './PixelDraw.css'
import Users from './Users'
import Canvas from './Canvas'
import io from 'socket.io-client'
import FloatingBox from './FloatingBox'

const PixelDraw = () => {
  const [socket, setSocket] = useState(null)
  const [canvas, setCanvas] = useState(null)
  const idToken = useSelector(store => store.auth.tokenObj.id_token)
  const name = useSelector(store => store.auth.profileObj.name)

  // get canvas
  useEffect(() => {
    const getCanvas = async () => {
      const response = await fetch('http://localhost:4000/canvas')
      const data = await response.json()
      console.log(data)
      if (data.length) setCanvas(data[0])
    }
    getCanvas()
  }, [])
  // setup socket
  useEffect(() => {
    if (canvas) {
      const newSocket = io('http://localhost:4000', {
        auth: {
          token: idToken
        },
        query: {
          canvasId: canvas._id,
        }
      })
      newSocket.on('connection_error', err => {
        console.error(err)
      })
      setSocket(newSocket)
      return () => {
        newSocket.removeAllListeners()
        newSocket.emit('logout', name)
        newSocket.close()
      }
    }
  }, [canvas, idToken, name])

  const  renderCanvas = () => {
    return socket ? <Canvas socket={socket} canvas={canvas} /> : <FloatingBox top={10} left={10}>Connecting...</FloatingBox>
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
