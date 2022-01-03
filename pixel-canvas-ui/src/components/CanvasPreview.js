import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { classNames } from '../utils'

const CanvasPreview = ({ canvas }) => {
  const [image, setImage] = useState(null)
  const ref = useRef(null)
  const item = useRef(null)

  useEffect(() => {
    const fetchImage = async () => {
      const uri = `http://localhost:4000/canvas/${canvas._id}/cache/get`
      const response = await fetch(uri)
      const data = await response.arrayBuffer()
      const content = new Uint8ClampedArray(data);
      const imageData = new ImageData(content, canvas.width, canvas.height)
      const cvs = ref.current
      const ctx = cvs.getContext('2d')
      ctx.putImageData(imageData, 0, 0)
      var dataURL = cvs.toDataURL()
      setImage(dataURL)
    }
    if (ref && ref.current && item && item.current) {
      let observer
      let current = item.current
      const intersectionCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isVisible || (entry.isIntersecting && entry.intersectionRatio >= 0.1)) {
              if (image === null) {
                fetchImage()
                observer.unobserve(current)
              }
            }
        })
      }
      observer = new IntersectionObserver(intersectionCallback, {
        root: document.querySelector('#gallery-list'),
        rootMargin: '0px',
        threshold: 1.0
      })
      observer.observe(current)

      return () => {
        observer.unobserve(current)
      }
    }
  }, [canvas, ref, item, image])


  return (
    <Link to={canvas._id} className="snap-center shrink-0">
      <div className="shrink-0">
        <canvas ref={ref} width={canvas.width} height={canvas.height} className="hidden" />
        <img ref={item} src={(image) ? image : `https://dummyimage.com/${canvas.width}x${canvas.height}/fff/aaa`} alt="canvas preview" className={classNames("shadow-xl rounded-lg [image-rendering:pixelated] max-h-40 max-w-xs mx-auto h-40 hover:scale-110 transition ease-out", image ? false : 'animate-pulse')} />
      </div>
      <h3 className="mt-6 text-md text-gray-500">
          {`${canvas.height}px x ${canvas.width}px`}
      </h3>
      <p className="text-xl font-semibold text-gray-900">{canvas.name}</p>
    </Link>
  )
}

export default CanvasPreview
