import ReactDOM from 'react-dom'
import Helmet from 'react-helmet'
import reportWebVitals from './reportWebVitals';
import { createStore, applyMiddleware } from 'redux'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
import Home from './components/Home'
import Login from './components/Login'
import './index.css'
import RequireAuth from './components/RequireAuth'
import PixelDraw from './components/PixelDraw'

const store = createStore(reducer, applyMiddleware(thunk))

ReactDOM.render(
  <Provider store={store}>
    <Helmet defaultTitle="Pixel Canvas App" titleTemplate="Pixel Canvas App | %s"/>
    <HashRouter>
      <Routes>
        <Route path="/" element={<RequireAuth />}>
          <Route index element={<Home />} />
          <Route path=":canvasId" element={<PixelDraw />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
