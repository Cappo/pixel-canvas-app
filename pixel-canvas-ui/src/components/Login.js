import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { GoogleLogin } from 'react-google-login'
import { login } from '../reducer'
import { OAUTH_CLIENT_ID } from '../config'
import Box from './FloatingBox'
import './PixelDraw.css'

const PixelDraw = () => {
  const [sso, setSso] = useState(() => {
    const storage = window.localStorage.getItem('sso')
    return storage === null ? false : storage
  })
  const dispatch = useDispatch()

  const responseGoogle = (res) => {
    console.log(res)
    dispatch(login(res))
  }

  return (
    <div className="application">
      <Helmet title="DrawPixel" />
      <Box top="1rem">
        <center>
          <h1>Login</h1>
          <p>Please login to use this application</p>
          <input type="checkbox" name="sso" value={sso} onChange={() => { window.localStorage.setItem('sso', !sso); setSso(!sso) }} />
          <label htmlFor="sso">Stay signed in?</label>
          <div style={{ paddingTop: '1rem' }}>
            <GoogleLogin
              clientId={OAUTH_CLIENT_ID}
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              isSignedIn={sso}
            />
          </div>
        </center>
      </Box>
    </div>
  )
}

export default PixelDraw
