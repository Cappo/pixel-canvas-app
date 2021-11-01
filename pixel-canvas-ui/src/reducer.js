import { getRandomColor, hexToArray } from './utils'

const SET_PIXEL_MAP = 'set-pixel-map'
const ADD_TO_PIXEL_MAP = 'add-to-pixel-map'
const CHANGE_PIXEL = 'change-pixel'
const CHANGE_COLOR = 'change-color'
const CHANGE_TOOL = 'change-tool'

const defaultState = {
  pixels: [],
  color: getRandomColor(),
  socket: null,
  tool: '',
}

export const paintPixel =
  (socket, index, colorInput) => (dispatch, getState) => {
    const color = colorInput ? colorInput : getState().color
    // const _id = getState().pixels[index]._id
    socket.emit('change', { index, color }, ({ status }) => {
      if (status === 'ok') {
        dispatch(changePixel(index, color))
      }
    })
  }
export const changePixel = (index, color) => ({
  type: CHANGE_PIXEL,
  payload: { index, color },
})
export const addtoPixelMap  = (pixels) => ({
  type: ADD_TO_PIXEL_MAP,
  payload: pixels,
})
export const setPixelMap = (pixels) => ({
  type: SET_PIXEL_MAP,
  payload: pixels,
})
export const changeColor = (color) => ({ type: CHANGE_COLOR, payload: color })
export const changeTool = (tool) => ({ type: CHANGE_TOOL, payload: tool })

const reducer = (prevState = defaultState, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case SET_PIXEL_MAP:
      return {
        ...prevState,
        pixels: payload,
      }
    case ADD_TO_PIXEL_MAP:
      return {
        ...prevState,
        pixels: [...prevState.pixels, ...payload]
      }
    case CHANGE_PIXEL: {
      prevState.pixels[payload.index] = hexToArray(payload.color)
      return { ...prevState }
    }
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
