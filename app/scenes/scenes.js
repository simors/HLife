import React, {Component} from 'react'
import {StyleSheet, AsyncStorage} from 'react-native'
import {Actions, Scene, Switch, ActionConst, Modal} from 'react-native-router-flux'

import Launch from '../components/Launch'
import Home from '../components/Home'
import Local from '../components/Local'
import Find from '../components/Find'
import Mine from '../components/Mine'
import Login from '../components/Login'
import Regist from '../components/Login/Regist'
import FindPwdVerifyCode from '../components/Login/FindPwdVerifyCode'
import RetrievePwdVerifyCode from '../components/Login/RetrievePwdVerifyCode'
import InputTest from '../components/common/Input/InputTest'
import * as reactInvokeMethod from "../util/reactMethodUtils"
import TabIcon from '../components/common/TabIcon'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    backgroundColor: '#FAFAFA',
  },
  tabBarSelectedItemStyle: {
    backgroundColor: 'transparent',
  }
})

export const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="LAUNCH" component={Launch} initial={true}/>
    <Scene key="LOGIN" component={Login}/>
    <Scene key="REGIST" component={Regist} />
    <Scene key="RETRIEVE_PWD" component={RetrievePwdVerifyCode}/>
    <Scene key="FIND_PWD_VERIFY_CODE" component={FindPwdVerifyCode} />
    <Scene key="INPUT_TEST" component={InputTest}  />

    <Scene key="HOME" tabs hideNavBar tabBarStyle={styles.tabBarStyle}>
      <Scene key="HOME_INDEX" title="主页" number={0} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
        <Scene key="WELLCHOOSEN" component={Home} />
      </Scene>

      <Scene key="LOCAL" title="本地" number={1} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
        <Scene key="LOCAL_INDEX" component={Local} />
      </Scene>

      <Scene key="FIND" title="发现" number={2} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
        <Scene key="FIND_INDEX" component={Find} />
      </Scene>

      <Scene key="MINE" title="我的" number={3} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
        <Scene key="MINE_INDEX" component={Mine} />
      </Scene>
    </Scene>
  </Scene>
)

function tapActions(props) {
  AsyncStorage.getItem("reduxPersist:AUTH").then((data) => {
    let jsonData = JSON.parse(data)
    let activeUser = jsonData.token
    return activeUser ? true : false
  }).then((result) => {
    //if (!result) {
    if (result) { //TODO just test
      //reactInvokeMethod.event('publish_noLogin_click')
      if (props.index != 0) {
        Actions.Login()
      }
    } else {
      switch (props.index) {
        case 0: {
          Actions.HOME_INDEX()
        }
          break
        case 1: {
          Actions.LOCAL()
        }
          break
        case 2: {
          Actions.FIND()
          break
        }
        case 3: {
          Actions.MINE()
        }
          break
        default: {
          Actions.PUBLISH_ONE_WORD()
        }
      }
    }
  })
}
