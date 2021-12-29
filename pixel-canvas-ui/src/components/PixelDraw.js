import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Canvas from './Canvas'
import io from 'socket.io-client'
import Navbar from './Navbar'
import ToolBox from './ToolBox'

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

  return socket &&
    <div className="overflow-hidden h-full">
      <div className="flex flex-col space-0  fixed top-0 left-0 right-0 z-10">
        <Navbar socket={socket} name={canvas.name} />
        <ToolBox />
      </div>
      <Canvas socket={socket} canvas={canvas} />
    </div>
}

export default PixelDraw
