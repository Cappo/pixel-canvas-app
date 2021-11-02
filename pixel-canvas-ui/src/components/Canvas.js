import { useEffect, useRef, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { MIN_ZOOM } from '../config'
import ToolBox from './ToolBox'
import FloatingBox from './FloatingBox'
import './Canvas.css'

const changeQueue = []

const Canvas2 = ({ socket }) => {
  const ref = useRef(null)
  const [state, setState] = useState('painting')
  const [queueStart, setQueueStart] = useState(false)

  const color = useSelector(store => store.color)

  // const dimensions = Math.sqrt(pixels.length)
  const dimensions = 1000

  // converts index to x/y and color array to hex value then paints
  const paint = useCallback(({ index, color}) => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const x = index % dimensions
    const y = Math.floor(index / dimensions)
    ctx.fillStyle = color
    ctx.fillRect(x, y, 1, 1)
  }, [dimensions])

  useEffect(() => {
    if (ref && ref.current) {
      socket.emit('init', ({ buffer }) => {
        const canvas = ref.current
        const ctx = canvas.getContext('2d')
        const data = new Uint8ClampedArray(buffer)
        const imageData = new ImageData(data, dimensions)
        ctx.putImageData(imageData, 0, 0)
        setQueueStart(true)
      })
    }
  }, [dimensions, socket])

  // listen for change messages
  useEffect(() => {
    if (socket) {
      const onChange = message => {
        // if still fetching initial state, queue up updates for later
        if (!queueStart) changeQueue.push(message)
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
      for (const change of changeQueue) {
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
      const canvas = ref.current
      const ctx = canvas.getContext('2d')
      const scale = canvas.zoomval !== undefined ? canvas.zoomval : MIN_ZOOM
      const rect = ref.current.getBoundingClientRect()
      const imageX = Math.floor((pageX - rect.left.toFixed(1)) / scale.toFixed(1))
      const imageY = Math.floor((pageY - rect.top.toFixed(1)) / scale.toFixed(1))
      const index = imageX + (dimensions * imageY)
      socket.emit('change', { index, color }, ({ status }) => {
        if (status === 'ok') {
          ctx.fillStyle = color
          ctx.fillRect(imageX,imageY, 1, 1)
        }
      })
    }

  // click to drag style setter
  const middleMousePressCheck = (e) => {
    const { button } = e
    console.log(e)
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

  return (
    <>
      {queueStart === false ? <FloatingBox top={10} left={10}>Fetching pixels...</FloatingBox> : null}
      <canvas
        id="canvas"
        width={dimensions}
        height={dimensions}
        ref={ref}
        onClick={paintPixel}
        onMouseDownCapture={middleMousePressCheck}
        onMouseUpCapture={middleMouseReleaseCheck}
        className={state}>
      </canvas>
      <ToolBox canvasRef={ref} />
    </>
  )
}

export default Canvas2
