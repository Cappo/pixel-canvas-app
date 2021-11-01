import { memo } from 'react'
import { useSelector } from 'react-redux'
import { PIXEL_SIZE } from '../config'
import { hexToString } from '../utils'
import './Pixel.css'

const Pixel = memo(({ index, onClick }) => {
  const pixel = useSelector((store) => store.pixels[index])

  return (
    <span
      style={{
        backgroundColor: hexToString(pixel),
        width: PIXEL_SIZE + 'px',
        height: PIXEL_SIZE + 'px',
      }}
      className="pixel"
      onMouseDownCapture={(event) => onClick(event, index)}
      onContextMenu={(e) => e.preventDefault()}
    />
  )
})

export default Pixel
