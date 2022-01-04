import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Canvas from './Canvas'
import io from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { notify } from '../reducer'

const PixelDraw = () => {
  const [socket, setSocket] = useState(null)
  const [canvas, setCanvas] = useState(null)
  const idToken = useSelector(store => store.auth.tokenObj.id_token)
  const name = useSelector(store => store.auth.profileObj.name)
  const params = useParams()
  const dispatch = useDispatch()

  // get canvas
  useEffect(() => {
    const getCanvas = async () => {
      const response = await fetch('http://localhost:4000/canvas/' + params.canvasId)
      const data = await response.json()
      setCanvas(data)
    }
    getCanvas()
  }, [params])
  // setup socket
  useEffect(() => {
    if (canvas) {
      const newSocket = io('http://localhost:4000', {
        auth: {
          token: idToken
        },
        query: {
          canvasId: canvas._id,
        },
        transports: ['websocket']
      })
      newSocket.on('connection_error', err => {
        dispatch(notify(err, 'Error'))
      })
      setSocket(newSocket)
      return () => {
        newSocket.removeAllListeners()
        newSocket.emit('logout', name)
        newSocket.close()
      }
    }
  }, [canvas, dispatch, idToken, name])

  return socket &&
    <div className="overflow-hidden h-full">
      <Canvas socket={socket} canvas={canvas} />
    </div>
}

export default PixelDraw
