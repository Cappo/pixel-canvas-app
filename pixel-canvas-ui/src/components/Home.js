import { useEffect, useState } from 'react'
import CanvasPreview from './CanvasPreview'

const Home = () => {
  const [canvasList, setCanvasList] = useState([])
  // get canvas
  useEffect(() => {
    const getCanvas = async () => {
      const response = await fetch('http://localhost:4000/canvas/')
      const data = await response.json()
      setCanvasList(data)
    }
    getCanvas()
  }, [])

  return (
    <div className="bg-violet-50/50 h-full relative overflow-hidden ">
        <div className="relative rounded-xl overflow-auto flex flex-col h-full justify-center">
          <div className="container mb-28 flex container mx-auto px-2 sm:px-0">
            <h1 className="text-5xl font-extrabold text-gray-900 grow">Gallery</h1>
            <button type="button" className="shrink-0 px-5 py-3 bg-violet-800 text-gray-100 text-sm font-bold rounded-md hover:bg-violet-700">New Canvas</button>
          </div>
          <div className="relative w-full">
            <div className="pl-[50%] w-full flex gap-20 snap-x snap-mandatory overflow-auto pb-14 pr-[50%] pt-10">
            {canvasList.map((canvas) => (
              <CanvasPreview canvas={canvas} />
            ))}
          </div>
          </div>
      </div>
    </div>
  )
}

export default Home