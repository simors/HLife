import React, {Component} from 'react'
import {AsyncStorage} from 'react-native'
import {Actions, Scene, Switch, ActionConst, Modal} from 'react-native-router-flux'

import Launch from '../components/Launch'
import Home from '../components/Home'
import Login from '../components/Login'
import Regist from '../components/Regist'
import Reg4VerifyCode from '../components/Regist/Reg4VerifyCode'

export const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="LAUNCH" component={Launch} initial={true} />
    <Scene key="HOME" component={Home} />
    <Scene key="LOGIN" component={Login} />
    <Scene key="REGIST" component={Regist} />
    <Scene key="REG4VERIFYCODE" component={Reg4VerifyCode} />
  </Scene>
)
