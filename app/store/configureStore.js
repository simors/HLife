import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import {enableBatching} from 'redux-batched-actions'
import {autoRehydrate} from 'redux-persist'

import rootReducer from '../reducers/rootReducer'

const logger = createLogger({predicate: (getState, action) => __DEV__})

export default function configureStore() {
  const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore)
  const store = createStoreWithMiddleware(enableBatching(rootReducer))
  return store
}
