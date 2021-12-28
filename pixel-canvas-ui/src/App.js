import { useState } from 'react'
import Helmet from 'react-helmet'
import { useSelector } from 'react-redux'
import PixelDraw from './components/PixelDraw'
import Login from './components/Login'
import './App.css'

const App = () => {
  const auth = useSelector(store => store.auth)

  return (
    <>
      <Helmet title="Pixel Canvas App" />
      {auth ? <PixelDraw /> : <Login />}
    </>
  )
}
export default App
