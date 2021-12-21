import { getRandomColor } from './utils'

const CHANGE_COLOR = 'change-color'
const CHANGE_TOOL = 'change-tool'
const LOGIN = 'oauth-login'
const LOGOUT = 'oauth-logout'

const defaultState = {
  pixels: [],
  color: getRandomColor(),
  socket: null,
  tool: '',
  auth: null,
}

export const changeColor = (color) => ({ type: CHANGE_COLOR, payload: color })
export const changeTool = (tool) => ({ type: CHANGE_TOOL, payload: tool })
export const login = (res) => ({ type: LOGIN, payload: res })
export const logout = () => ({ type: LOGOUT })

const reducer = (prevState = defaultState, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case CHANGE_COLOR:
      return {
        ...prevState,
        color: payload,
      }
    case CHANGE_TOOL:
      return {
        ...prevState,
        tool: payload,
      }
    case LOGIN:
      return {
        ...prevState,
        auth: payload,
      }
    case LOGOUT:
      return {
        ...prevState,
        auth: null,
      }
    default:
      return prevState
  }
}

export default reducer
