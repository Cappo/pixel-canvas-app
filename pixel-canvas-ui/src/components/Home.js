import { useEffect, useState } from 'react'
import CanvasPreview from './CanvasPreview'
import NewCanvas from './NewCanvas'

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

  const addCanvas = (canvas) => {
    setCanvasList([{...canvas}, ...canvasList])
  }

  return (
    <div className="bg-violet-50/20 h-full relative overflow-hidden ">
        <div className="relative rounded-xl overflow-auto flex flex-col h-full justify-center">
          <div className="container mb-28 flex container mx-auto px-2 sm:px-0">
            <h1 className="text-5xl font-extrabold text-gray-900 grow">Gallery</h1>
            <NewCanvas addCanvas={addCanvas} />
          </div>
          <div id="gallery-list" className="relative w-full">
            <div  className="xs:pl-[40%] md:pl-[50%] w-full flex gap-20 snap-x snap-mandatory overflow-auto pb-14 pr-[50%] pt-10">
            {canvasList.map((canvas) => (
              <div key={canvas._id} className="snap-center shrink-0">
                <CanvasPreview  canvas={canvas} />
              </div>
            ))}
          </div>
          </div>
      </div>
    </div>
  )
}

export default Home
