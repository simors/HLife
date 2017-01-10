import {AsyncStorage} from 'react-native'
import {persistStore} from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import createFilter from 'redux-persist-transform-filter'
import {Actions} from 'react-native-router-flux'
import * as authSelectors from '../selector/authSelector'
import {initMessageClient} from '../action/messageAction'
import {become} from '../api/leancloud/auth'
import {UserInfo, UserState, UserStateRecord, UserInfoRecord} from '../models/userModels'
import configureStore from '../store/configureStore'

const messageFilter = createFilter(
  'MESSAGE',
  [
    'conversationMap',
    'unReadMsgCnt',
    'messages',
    'activeConversation',
    'OrderedConversation'
  ]
)

export default function persist(store) {
  return persistStore(store, {
    storage: AsyncStorage,
    // transforms: [
    //   immutableTransform({
    //     records: [
    //       UserInfoRecord,
    //       UserStateRecord
    //     ],
    //   }),
    // ],
    transforms: [messageFilter],
    whitelist: ['AUTH', 'CONFIG', 'MESSAGE', 'ARTICLE', 'TOPIC', 'SHOP', 'DOCTOR', 'NOTICE'],
  }, () => {
    store.dispatch(restoreFromPersistence())
  })
}

export function restoreFromPersistence() {
  return (dispatch, getState) => {
    if (authSelectors.isUserLogined(getState())) {
      console.log('user login automatically')
      dispatch(verifyToken())
    } else {
      // Actions.LOGIN()
      try {
      } catch (e) {
        console.log("restoreFromPersistence error is", e)
      }
    }
  }
}

function verifyToken() {
  return (dispatch, getState) => {
    let payload = {
      ...authSelectors.activeUserAndToken(getState())
    }

    become(payload).then(() => {
      return dispatch(initMessageClient())
    }).then(() => {
      // Actions.HOME()
    }).catch((error) => {
      console.log('verify token error:', error)
    })
  }
}

export const store = configureStore()
export const persistor = persist(store)
