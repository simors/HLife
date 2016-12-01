import {AsyncStorage} from 'react-native'
import {persistStore} from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import createFilter from 'redux-persist-transform-filter'
import {Actions} from 'react-native-router-flux'

const messageFilter = createFilter(
  'MESSAGE',
  [
    'activeConversation',
    'msgById',
    'convById',
    'convListSortedByUpdatedTime',
    'unreadCount'
  ]
)

export default function persist(store) {
  persistStore(store, {
    storage: AsyncStorage,
    // transform: [
    //   immutableTransform({
    //     records: [
    //       ...useRecords,
    //     ],
    //   }),
    // ],
    // transforms: [messageFilter],
  }, () => {
    store.dispatch(restoreFromPersistence())
  })
}

export function restoreFromPersistence() {
  return (dispatch, getState) => {
    // if (authSelectors.isUserLogined(getState())) {
    //   dispatch(verifyToken())
    // } else {
    //   Actions.LOGIN()
      try {
      } catch (e) {
        console.log("restoreFromPersistence error is", e)
      }
    // }
  }
}