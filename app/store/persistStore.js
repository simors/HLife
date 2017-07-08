import {
  NativeModules
} from 'react-native'
import {AsyncStorage} from 'react-native'
import {persistStore} from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import createFilter from 'redux-persist-transform-filter'
import {Actions} from 'react-native-router-flux'
import {createAction} from 'redux-actions'
import * as authSelectors from '../selector/authSelector'
import {initMessageClient} from '../action/messageAction'
import {fetchUserFollowees, bindWithWeixin} from '../action/authActions'
import {become, isWXBindByPhone} from '../api/leancloud/auth'
import {UserInfo, UserState, UserStateRecord, UserInfoRecord} from '../models/userModels'
import configureStore from '../store/configureStore'
import * as AuthTypes from '../constants/authActionTypes'
import * as AVUtils from '../util/AVUtils'
import * as shopAction from '../action/shopAction'
import {getCurrentPromoter} from '../action/promoterAction'


const shareNative = NativeModules.shareComponent


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
    whitelist: ['AUTH', 'CONFIG', 'MESSAGE', 'ARTICLE', 'TOPIC', 'SHOP', 'NOTICE', 'PAYMENT', 'DRAFTS', 'PROMOTER'],
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
    let userInfo = undefined

    become(payload).then((user) => {
      userInfo = user.userInfo
      let loginAction = createAction(AuthTypes.LOGIN_SUCCESS)
      dispatch(loginAction({...user}))
      console.log('auto login: ', user)
      return user
    }).then((user) => {
      let phone = user.userInfo.phone
      return isWXBindByPhone({phone: phone})
    }).then((wxAuthed) => {
      if(!wxAuthed) {
        shareNative.loginWX(function (errorCode, data) {
          if(errorCode ===0 && data) {
            let wxUserInfo = {
              accessToken: data.accessToken,
              expiration: data.expiration,
              unionid: data.uid,
              name: data.name,
              avatar: data.iconurl,
            }
            dispatch(bindWithWeixin({
              userId: userInfo.id,
              wxUserInfo: wxUserInfo,
              success: () => {},
              error: () => {}
            }))
          }
        })
      }
      return
    }).then(() => {
      dispatch(initMessageClient())
      AVUtils.updateDeviceUserInfo({
        userId: userInfo.id
      })
      dispatch(fetchUserFollowees())
      dispatch(getCurrentPromoter())
      dispatch(shopAction.fetchUserOwnedShopInfo({userId: userInfo.id}))
    }).catch((error) => {
      let logoutAction = createAction(AuthTypes.LOGIN_OUT)
      dispatch(logoutAction({}))
      console.log('verify token error:', error)
    })
  }
}

export const store = configureStore()
export const persistor = persist(store)
