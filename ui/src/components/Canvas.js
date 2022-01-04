import { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MIN_ZOOM } from '../config'
import ToolBox from './ToolBox'
import Navbar from './Navbar'
import { changeColor, notify } from '../reducer'

const Canvas2 = ({ socket, canvas }) => {
  const ref = useRef(null)
  const changeQueue = useRef([])
  const tool = useSelector(store => store.tool)
  const [mouseDown, setMouseDown] = useState(false)
  const [queueStart, setQueueStart] = useState(false)
  const dispatch = useDispatch()

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
  const handleClick =
    ({ pageX, pageY }) => {
      const canvasRef = ref.current
      const ctx = canvasRef.getContext('2d')
      const scale = canvasRef.zoomval !== undefined ? canvasRef.zoomval : MIN_ZOOM
      const rect = ref.current.getBoundingClientRect()
      const imageX = Math.floor((pageX - rect.left.toFixed(1)) / scale.toFixed(1))
      const imageY = Math.floor((pageY - rect.top.toFixed(1)) / scale.toFixed(1))
      if (tool === 'eraser' || tool === 'paintbrush') {
        const index = imageX + (canvas.width * imageY)
        let newColor = color
        if (tool === 'eraser') newColor = '#ffffff'
        socket.emit('change', { canvasId: canvas._id, index, color: newColor }, ({ status, error }) => {
          if (status === 'ok') {
            ctx.fillStyle = newColor
            ctx.fillRect(imageX,imageY, 1, 1)
            return
          }
          if (status === 'cooldown') {
            dispatch(notify('Cooldown in effect, please wait before painting again.', 'Cooldown'))
            return
          }
          dispatch(notify(`[${status}] There was a problem: ${error || 'No error message provided'}.`, 'Error'))
        })
      }
      if (tool === 'picker') {
        function rgbToHex(r, g, b) {
          return ((r << 16) | (g << 8) | b).toString(16);
      }
        var p = ctx.getImageData(imageX, imageY, 1, 1).data
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6)
        dispatch(changeColor(hex))
      }
    }

  // click to drag style setter
  const middleMousePressCheck = (e) => {
    const { button } = e
    if (button === 1 || (button === 0 && tool === 'dragger')) {
      setMouseDown(true)
    }
  }

  // no longer click to drag, reset style to painter
  const middleMouseReleaseCheck = ({ button }) => {
    setMouseDown(false)
  }

  const stateClass = (tool, mouseDown) => ({
    eraser: 'cursor-crosshair',
    dragger: mouseDown ? 'cursor-grabbing' : 'cursor-grab',
    paintbrush: 'cursor-crosshair',
    picker: 'cursor-crosshair',
  }[tool])

  return (
    <>
    <div className="flex flex-col space-0  fixed top-0 left-0 right-0 z-10">
      <Navbar socket={socket} name={canvas.name} />
      <ToolBox canvasRef={ref} name={canvas.name} socket={socket} />
    </div>
    <div className="h-full pt-8 flex items-center justify-center bg-violet-50 bg-graph-light">
      <canvas
        id="canvas"
        width={canvas.width}
        height={canvas.height}
        ref={ref}
        onClick={handleClick}
        onMouseDownCapture={middleMousePressCheck}
        onMouseUpCapture={middleMouseReleaseCheck}
        className={stateClass(tool, mouseDown) + ' hover:shadow hover:shadow-violet-200/50 [image-rendering:pixelated]'}>
      </canvas>
    </div>
    </>
  )
}

export default Canvas2
