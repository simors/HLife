import {Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'

const initialState = {
  mainPage: {
    column: {
      type: 'main', name: '编辑推荐'
    },
  }
}

export default function configReducer(state=initialState, action) {
  switch (action.type) {
    default:
    return state
  }
}

function onRehydrate(state, action) {
  var incoming = action.payload.CONFIG
  if (!incoming) return state

  return incoming
}