import { useCallback, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeColor } from '../reducer'
import { MAX_ZOOM, MIN_ZOOM } from '../config'
import FloatingBox from './FloatingBox'
import './ToolBox.css'

// ToolBox for adjusting zoom, panning, and selecting color
const ToolBox = ({ canvasRef }) => {
  const ref = canvasRef
  const color = useSelector((store) => store.color)
  const mouseLoc = useRef({ x: 0, y: 0}) // track mouse location
  const translations = useRef({ // track current translations
    originX: 0,
    originY: 0,
    scale: MIN_ZOOM,
    translateX: 0,
    translateY: 0,
  })

  const dispatch = useDispatch()

  // takes translation configuration and updates canvas
  // then saves current translation to the canvas DOM object
  const translate = useCallback(
    (translationParam) => {
      const newTranslations = {
        ...translations.current,
        ...translationParam,
      }
      console.log(newTranslations)
      const { scale, originX, originY, translateX, translateY } = newTranslations
      ref.current.style.transform = `matrix(${scale.toFixed(
        1
      )},0,0,${scale.toFixed(1)},${translateX.toFixed(
        1
      )},${translateY.toFixed(1)})`
      ref.current.style.transformOrigin = `${originX.toFixed(
        10
      )}px ${originY.toFixed(10)}px`
      translations.current = newTranslations
      // scale used by Canvas paint
      ref.current.zoomval = scale
    },
    [ref]
  )

  const increaseZoom = useCallback(() => {
    let previousScale = translations.current.scale || MIN_ZOOM
    let newScale = previousScale * 1.1
    if (newScale > MAX_ZOOM) newScale = MAX_ZOOM
    translate({ scale: newScale })
  }, [translate])

  const decreaseZoom = useCallback(() => {
    let previousScale = translations.current.scale || MIN_ZOOM
    let newScale = previousScale * 0.9
    if (newScale < MIN_ZOOM) newScale = MIN_ZOOM
    translate({ scale: newScale })
  }, [translate])

  const handleColorChange = (e) => {
    dispatch(changeColor(e.target.value))
  }

  // Zoom on scroll
  const onScroll = useCallback(
    (e) => {
      e.preventDefault() // don't try to actually scroll
      let { scale, originX, originY, translateX, translateY } = translations.current
      const previousScale = scale
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
        (originX || 0) * previousScale
      ).toFixed(2)
      const prevOrigY = (
        (originY || 0) * previousScale
      ).toFixed(2)
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
        const translateX = translations.current.translateX
        const translateY = translations.current.translateY
        translate({
          translateX: translateX - (mouseLoc.current.x - e.pageX),
          translateY: translateY - (mouseLoc.current.y - e.pageY),
        })
      }
      mouseLoc.current = { x: e.pageX, y: e.pageY }
    },
    [translate]
  )

  const keyboardMove = useCallback((e) => {
    const { code } = e
    console.log(code)
    let scale = translations.current.scale
    const speedNormalizer = 5
    const movementSpeed = MAX_ZOOM * scale / speedNormalizer
    switch (code) {
      case 'ArrowLeft':
        translate({ translateX: translations.current.translateX + movementSpeed })
        break
      case 'ArrowRight':
        translate({ translateX: translations.current.translateX - movementSpeed })
        break
      case 'ArrowUp':
        translate({ translateY: translations.current.translateY + movementSpeed })
        break
      case 'ArrowDown':
        translate({ translateY: translations.current.translateY - movementSpeed })
        break
      case 'PageUp':
        increaseZoom()
        break
      case 'PageDown':
        decreaseZoom()
        break
      default:
        break
    }
  }, [decreaseZoom, increaseZoom, translate])

  useEffect(() => {
    if (ref && ref.current) {
      const canvas = ref.current
      canvas.addEventListener('wheel', onScroll, { passive: false })
      canvas.addEventListener('dragstart', (e) => {
        e.preventDefault()
      })
      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('keydown', keyboardMove)
      return () => {
        canvas.removeEventListener('wheel', onScroll)
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('keydown', keyboardMove)
      }
    }
  }, [ref, translate, onScroll, mouseMove, keyboardMove])

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
