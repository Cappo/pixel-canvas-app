import { getRandomColor } from './utils'

const CHANGE_COLOR = 'change-color'
const CHANGE_TOOL = 'change-tool'

const defaultState = {
  pixels: [],
  color: getRandomColor(),
  socket: null,
  tool: '',
}

export const changeColor = (color) => ({ type: CHANGE_COLOR, payload: color })
export const changeTool = (tool) => ({ type: CHANGE_TOOL, payload: tool })

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
    default:
      return prevState
  }
}

export default reducer
