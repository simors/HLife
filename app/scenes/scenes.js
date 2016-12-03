import React, {Component} from 'react'
import {AsyncStorage} from 'react-native'
import {Actions, Scene, Switch, ActionConst, Modal} from 'react-native-router-flux'

import Launch from '../components/Launch'
import Home from '../components/Home'
import Login from '../components/Login'
import Regist from '../components/Login/Regist'
import RegVerifyCode from '../components/Login/RegVerifyCode'
import SetPsw from '../components/Login/SetPsw/index'

export const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="LAUNCH" component={Launch} />
    <Scene key="HOME" component={Home} />
    <Scene key="LOGIN" component={Login} />
    <Scene key="REGIST" component={Regist} />
    <Scene key="REG4VERIFYCODE" component={RegVerifyCode}   />
    <Scene key="SETPSW" component={SetPsw} initial={true}/>
  </Scene>
)
