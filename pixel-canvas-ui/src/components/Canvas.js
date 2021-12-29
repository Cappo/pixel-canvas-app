import { useEffect, useRef, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { MIN_ZOOM } from '../config'
import ToolBox from './ToolBox'

const Canvas2 = ({ socket, canvas }) => {
  const ref = useRef(null)
  const changeQueue = useRef([])
  const [state, setState] = useState('painting')
  const [queueStart, setQueueStart] = useState(false)

  const color = useSelector(store => store.color)

  // converts index to x/y and color array to hex value then paints
  const paint = useCallback(({ index, color}) => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const x = index % canvas.width
    const y = Math.floor(index / canvas.width)
    ctx.fillStyle = color
    ctx.fillRect(x, y, 1, 1)
  }, [])

  useEffect(() => {
    if (ref && ref.current && canvas) {
      socket.emit('init', ({ buffer }) => {
        const canvas = ref.current
        const ctx = canvas.getContext('2d')
        const data = new Uint8ClampedArray(buffer)
        const imageData = new ImageData(data, canvas.width, canvas.height)
        ctx.putImageData(imageData, 0, 0)
        setQueueStart(true)
      })
    }
  }, [socket, canvas])

  // listen for change messages
  useEffect(() => {
    if (socket) {
      const onChange = message => {
        // if still fetching initial state, queue up updates for later
        if (!queueStart) changeQueue.current.push(message)
        // if we've already done our first paint, just pain the updates
        else paint(message)
      }
      socket.on('change', onChange)

      return () => {
        socket.off('change', onChange)
      }
    }
  }, [socket, paint, queueStart])

  // after initial draw we can start updating the canvas
  // by pulling from the change queue
  useEffect(() => {
    if (queueStart) {
      for (const change of changeQueue.current) {
        paint(change)
      }
    }
  }, [paint, queueStart])

  // calculate mouse position relative to the canvas
  // translate relative mouse position to X, Y co-ordinates
  // emit selected color to pixel X, Y
  // if successful, paint the pixel
  const paintPixel =
    ({ pageX, pageY }) => {
      const canvasRef = ref.current
      const ctx = canvasRef.getContext('2d')
      const scale = canvasRef.zoomval !== undefined ? canvasRef.zoomval : MIN_ZOOM
      const rect = ref.current.getBoundingClientRect()
      const imageX = Math.floor((pageX - rect.left.toFixed(1)) / scale.toFixed(1))
      const imageY = Math.floor((pageY - rect.top.toFixed(1)) / scale.toFixed(1))
      const index = imageX + (canvas.width * imageY)
      socket.emit('change', { canvasId: canvas._id, index, color }, ({ status, error }) => {
        if (status === 'ok') {
          ctx.fillStyle = color
          ctx.fillRect(imageX,imageY, 1, 1)
        } else {
          console.error('There was a problem:', status, error)
        }
      })
    }

  // click to drag style setter
  const middleMousePressCheck = (e) => {
    const { button } = e
    if (button === 1) {
      setState('grabbing')
    }
  }

  // no longer click to drag, reset style to painter
  const middleMouseReleaseCheck = ({ button }) => {
    if (button === 1) {
      setState('painting')
    }
  }

  const stateClass = (state) => ({
    grabbing: 'cursor-grabbing',
    painting: 'cursor-crosshair'
  }[state])

  return (
    <>
    <ToolBox canvasRef={ref} name={canvas.name} socket={socket} />
    <div className="h-full pt-8 flex items-center justify-center bg-violet-50 bg-graph-light">
      <canvas
        id="canvas"
        width={canvas.width}
        height={canvas.height}
        ref={ref}
        onClick={paintPixel}
        onMouseDownCapture={middleMousePressCheck}
        onMouseUpCapture={middleMouseReleaseCheck}
        className={stateClass(state) + ' hover:shadow hover:shadow-violet-200/50 [image-rendering:pixelated]'}>
      </canvas>
    </div>
    </>
  )
}

export default Canvas2
