/**
 * Created by yangyang on 2016/12/1.
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {Provider, connect} from 'react-redux'
import {Router} from 'react-native-router-flux'
import configureStore from './app/store/configureStore'
import persist from './app/store/persistStore'
import {scenes} from './app/scenes/scenes'
import AV from 'leancloud-storage'
import CustomToast from './app/components/common/Toast'

const RouterWithRedux = connect()(Router)
const store = configureStore()
persist(store)

const KM_Dev = {
  appId: 'Ml5S2pSFVvB5FVDJXFyu8DTz-gzGzoHsz',
  appKey: 'SiktQFCusUYn8wv5OyWwzrjz',
}

const KM_PRO = {
  appId: 'Ml5S2pSFVvB5FVDJXFyu8DTz-gzGzoHsz',
  appKey: 'SiktQFCusUYn8wv5OyWwzrjz',
}

//AV.setProduction(false)
AV.init(
  __DEV__ ? KM_Dev : KM_PRO
)

export default class HLifeEntry extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <CustomToast text='hello HLife'/>
          <RouterWithRedux scenes={scenes} store={store} sceneStyle={getSceneStyle}/>
        </View>
      </Provider>
    )
  }
}

const getSceneStyle = (props, computedProps) => {
  const style = {
    flex: 1,
    backgroundColor: 'white',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
  }
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64
    style.marginBottom = computedProps.hideTabBar ? 0 : 50
  }
  return style
}