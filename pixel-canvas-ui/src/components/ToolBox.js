import { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeColor } from '../reducer'
import { MAX_ZOOM, MIN_ZOOM } from '../config'
import FloatingBox from './FloatingBox'
import './ToolBox.css'

// tracks current mouse location
let mouseLoc = { x: 0, y: 0 }

// ToolBox for adjusting zoom, panning, and selecting color
const ToolBox = ({ canvasRef }) => {
  const ref = canvasRef
  const color = useSelector((store) => store.color)

  const dispatch = useDispatch()
  const increaseZoom = () => {
    let previousScale = ref.current.zoomval || MIN_ZOOM
    let newScale = previousScale * 1.1
    if (newScale > MAX_ZOOM) newScale = MAX_ZOOM
    translate({ scale: newScale })
  }
  const decreaseZoom = () => {
    let previousScale = ref.current.zoomval || MIN_ZOOM
    let newScale = previousScale * 0.9
    if (newScale < MIN_ZOOM) newScale = MIN_ZOOM
    translate({ scale: newScale })
  }
  const handleColorChange = (e) => {
    dispatch(changeColor(e.target.value))
  }

  // takes translation configuration and updates canvas
  // then saves current translation to the canvas DOM object
  const translate = useCallback(
    (translations) => {
      const { scale, originX, originY, translateX, translateY } = translations
      const newScale = scale || ref.current.zoomval || MIN_ZOOM
      const newTranslateX =
        translateX !== undefined ? translateX : ref.current.translateX
      const newTranslateY =
        translateY !== undefined ? translateY : ref.current.translateY
      const newOrigX =
        originX !== undefined ? originX : ref.current.transformOriginX || 0
      const newOrigY =
        originY !== undefined ? originY : ref.current.transformOriginY || 0
      ref.current.style.transform = `matrix(${newScale.toFixed(
        1
      )},0,0,${newScale.toFixed(1)},${newTranslateX.toFixed(
        1
      )},${newTranslateY.toFixed(1)})`
      ref.current.style.transformOrigin = `${newOrigX.toFixed(
        10
      )}px ${newOrigY.toFixed(10)}px`
      ref.current.transformOriginX = newOrigX
      ref.current.transformOriginY = newOrigY
      ref.current.translateX = newTranslateX
      ref.current.translateY = newTranslateY
      ref.current.zoomval = newScale
    },
    [ref]
  )

  // Zoom on scroll
  const onScroll = useCallback(
    (e) => {
      e.preventDefault() // don't try to actually scroll
      const previousScale = ref.current.zoomval || 1
      // normalize zoom scale
      let newScale = previousScale + e.wheelDelta / 500
      if (newScale < MIN_ZOOM) newScale = MIN_ZOOM
      if (newScale > MAX_ZOOM) newScale = MAX_ZOOM
      // current cursor position on image
      const rect = ref.current.getBoundingClientRect()
      const imageX = (e.pageX - rect.left).toFixed(2)
      const imageY = (e.pageY - rect.top).toFixed(2)
      // previous cursor position on image
      const prevOrigX = (
        (ref.current.transformOriginX || 0) * previousScale
      ).toFixed(2)
      const prevOrigY = (
        (ref.current.transformOriginY || 0) * previousScale
      ).toFixed(2)
      // previous zooming frame translate
      let translateX = ref.current.translateX || 0
      let translateY = ref.current.translateY || 0
      // set origin to current cursor position
      let newOrigX = imageX / previousScale
      let newOrigY = imageY / previousScale
      // move zooming frame to current cursor position
      if (
        (Math.abs(imageX - prevOrigX) > 1 ||
          Math.abs(imageY - prevOrigY) > 1) &&
        previousScale < MAX_ZOOM
      ) {
        translateX = translateX + (imageX - prevOrigX) * (1 - 1 / previousScale)
        translateY = translateY + (imageY - prevOrigY) * (1 - 1 / previousScale)
      }
      // stabilize position by zooming on previous cursor position
      else if (
        previousScale !== 1 ||
        (imageX !== prevOrigX && imageY !== prevOrigY)
      ) {
        //frame limit
        newOrigX = prevOrigX / previousScale
        newOrigY = prevOrigY / previousScale
      }
      translate({
        scale: newScale,
        originX: newOrigX,
        originY: newOrigY,
        translateX,
        translateY,
      })
    },
    [ref, translate]
  )

  const mouseMove = useCallback(
    (e) => {
      // click and drag around canvas with middle mouse button
      if (e.which === 2) {
        const translateX = ref.current.translateX || 0
        const translateY = ref.current.translateY || 0
        translate({
          translateX: translateX - (mouseLoc.x - e.pageX),
          translateY: translateY - (mouseLoc.y - e.pageY),
        })
      }
      mouseLoc = { x: e.pageX, y: e.pageY }
    },
    [ref, translate]
  )

  // TODO: use keyboard for movement

  useEffect(() => {
    if (ref && ref.current) {
      const canvas = ref.current
      canvas.addEventListener('wheel', onScroll, { passive: false })
      canvas.addEventListener('dragstart', (e) => {
        e.preventDefault()
      })
      document.addEventListener('mousemove', mouseMove)
      return () => {
        canvas.removeEventListener('wheel', onScroll)
        document.removeEventListener('mousemove', mouseMove)
      }
    }
  }, [ref, translate, onScroll, mouseMove])

  return (
    <FloatingBox bottom="10px" left="10px">
      <div className="toolbox">
        <input type="color" value={color} onChange={handleColorChange} />
        <button onClick={increaseZoom}>+</button>
        <button onClick={decreaseZoom}>-</button>
      </div>
    </FloatingBox>
  )
}

export default ToolBox
