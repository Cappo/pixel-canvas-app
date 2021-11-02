import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import './PixelDraw.css'
import Users from './Users'
import Canvas from './Canvas'
import axios from 'axios'
import io from 'socket.io-client'
import { randomName } from '../utils'
import FloatingBox from './FloatingBox'

const numberOfPixels = 1000000
const pageSize = 50000
const method = '!ALL'

const PixelDraw = () => {
  const [socket, setSocket] = useState(null)
  const [pixels, setPixels] = useState([])

  // get initial pixels from API
  useEffect(() => {
    // creates promise for one page response
    const fetchPixels = (page) => {
      return axios.get('http://localhost:4000/pixels', { params: { page, limit: pageSize } })
    }

    // fetch all the pixels at once
    const fetchAll = async () => {
      try {
        const res = await axios.get('http://localhost:4000/pixels')
        setPixels(res.data)
      } catch (e) {
        console.error(e)
      }
    }

    // fetch pixels by page
    // calculate how many pages are necessary given pageSize constant and numberOfPixels constant
    // create a list of promises to resolve
    // await for each promise to be done
    // merge responses into one pixel list
    const fetchByPage = async () => {
      let pixelsCache = new Array(numberOfPixels)
      const numPages = Math.ceil(numberOfPixels / pageSize)
      console.log(numPages)
      const promises = []
      for (let i = 0; i < numPages; i++) {
        promises.push(fetchPixels(i))
      }
      const res = await Promise.all(promises)
      res.forEach(
        (resp, i) =>
          resp.data.forEach(
            (pixel, j) => {
              pixelsCache[(i * pageSize) + j] = pixel
            }
          )
      )
      setPixels(pixelsCache)
    }

    // method === 'ALL' ? fetchAll() : fetchByPage()
  }, [])

  useEffect(() => {
    const newSocket = io('http://localhost:4000')
    setSocket(newSocket)
    return () => {
      newSocket.removeAllListeners()
      newSocket.emit('logout', randomName)
      newSocket.close()
    }
  }, [])

  const  renderCanvas = () => {
    return socket ? <Canvas socket={socket} pixels={pixels} /> : <FloatingBox top={10} left={10}>Connecting...</FloatingBox>
  }

  const renderUsers = () => {
    return socket ? <Users socket={socket} /> : null
  }

  return (
    <div className="application">
      <Helmet title="DrawPixel" />
      <div id="view-port">
        {renderCanvas()}
        {renderUsers()}
      </div>
    </div>
  )
}

export default PixelDraw
