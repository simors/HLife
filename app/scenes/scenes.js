import React, {Component} from 'react'
import {AsyncStorage} from 'react-native'
import {Actions, Scene, Switch, ActionConst, Modal} from 'react-native-router-flux'

import Launch from '../components/Launch'
import Home from '../components/Home'
import Login from '../components/Login'
import Regist from '../components/Login/Regist'
import FindPwdVerifyCode from '../components/Login/FindPwdVerifyCode'
import RetrievePwdVerifyCode from '../components/Login/RetrievePwdVerifyCode'
import RetrievePwd from '../components/Login/RetrievePwd'

export const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="LAUNCH" component={Launch} />
    <Scene key="HOME" component={Home} />
    <Scene key="LOGIN" component={Login} initial={true}/>
    <Scene key="REGIST" component={Regist}/>
    <Scene key="RETRIEVE_PASSWORD" component={RetrievePwdVerifyCode}/>
    <Scene key="SETPSW" component={RetrievePwd}/>
    <Scene key="FIND_PWD_VERIFY_CODE" component={FindPwdVerifyCode}/>
  </Scene>
)
