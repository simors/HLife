import React, {Component} from 'react'
import {AsyncStorage} from 'react-native'
import {Actions, Scene, Switch, ActionConst, Modal} from 'react-native-router-flux'

import Launch from '../components/Launch'
import Home from '../components/Home'

export const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="LAUNCH" component={Launch} initial={true} />
    <Scene key="HOME" component={Home} />
  </Scene>
)
