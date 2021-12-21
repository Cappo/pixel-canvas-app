import { useState } from 'react'
import { useSelector } from 'react-redux'
import PixelDraw from './components/PixelDraw'
import Login from './components/Login'
import './App.css'

const App = () => {
  const auth = useSelector(store => store.auth)

  if (auth) {
    return <PixelDraw />
  } else {
    return (
      <Login />
    )
  }
}
export default App
