import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const CanvasPreview = ({ canvas }) => {
  const [image, setImage] = useState(null)
  const ref = useRef(null)
  const canvasReady = canvas.status === 'READY'

  useEffect(() => {
    const fetchImage = async () => {
      const uri = `http://localhost:4000/canvas/${canvas._id}/cache/get`
      const response = await fetch(uri)
      // const blob = await fetch.blob()
      const data = await response.arrayBuffer()
      console.log(data)
      // Small red dot image
      const content = new Uint8ClampedArray(data);
      // console.log(content)
      // const blob = new Blob([content.buffer], { type: 'image/png' })
      // console.log(blob)
      // const obj = URL.createObjectURL(
      //   blob
      // );
      // console.log(obj)
      // setImage(obj)
      const imageData = new ImageData(content, canvas.width, canvas.height)
      // setImage(imageData)
      const cvs = ref.current
      const ctx = cvs.getContext('2d')
      ctx.putImageData(imageData, 0, 0)
      var dataURL = cvs.toDataURL();
      console.log(dataURL)
      setImage(dataURL)
      return () => {
        // URL.revokeObjectURL(obj);
      }
    }
    if (canvasReady && ref && ref.current) {
      fetchImage()
    }
  }, [canvas, canvasReady, ref])
  return (
    <Link to={canvas._id} key={canvas._id} className="snap-center shrink-0">
      <div className="shrink-0">
        <canvas ref={ref} width={canvas.width} height={canvas.height} className="hidden" />
        <img src={canvasReady ? image : 'https://www.svgrepo.com/show/275959/space-invaders.svg'} alt="canvas preview" className="shadow-xl rounded-lg [image-rendering:pixelated] max-h-40 max-w-xs mx-auto h-40 hover:scale-110 transition ease-out" />
      </div>
      <h3 className="mt-6 text-md text-gray-500">
          {`${canvas.height}px x ${canvas.width}px`}
      </h3>
      <p className="text-xl font-semibold text-gray-900">{canvas.name}</p>
    </Link>
  )
}

export default CanvasPreview
