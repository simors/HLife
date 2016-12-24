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
import PublishViewTest from '../components/common/Input/PublishViewTest'
import PickerTest from '../components/common/Input/PickerTest'
import CommonWebView from '../components/common/CommonWebView'
import * as reactInvokeMethod from "../util/reactMethodUtils"
import TabIcon from '../components/common/TabIcon'
import DoctorCertification from '../components/Mine/DoctorCertification'
import DoctorInfo from '../components/Mine/DoctorInfo'
import Profile from '../components/Mine/Profile'
import ShopRegister from '../components/Mine/myShop/ShopRegister'
import ArticleList from '../components/Articles/ArticleList'
import Article from '../components/Articles/Article'
import ShopRegistSuccess from '../components/Mine/myShop/ShopRegistSuccess'
import GetInvitationCode from '../components/Mine/myShop/GetInvitationCode'
import Chatroom from '../components/Chatroom'
import ShopCategoryList from '../components/shop/ShopCategoryList'
import ShopDetail from '../components/shop/ShopDetail'
import PublishTopics from '../components/Find/PublishTopics'
import MessageBox from '../components/Message'
import TextImageTest from '../components/common/Input/TextImageTest'

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
  <Scene key="modal" component={Modal}>
    <Scene key="root" hideNavBar={true}>
      <Scene key="LAUNCH" component={Launch} hideTabBar hideNavBar initial={true}/>
      <Scene key="LOGIN" component={Login}/>
      <Scene key="REGIST" component={Regist} />
      <Scene key="RETRIEVE_PWD" component={RetrievePwdVerifyCode}/>
      <Scene key="FIND_PWD_VERIFY_CODE" component={FindPwdVerifyCode}/>
      <Scene key="PUBLISH_VIEW_TEST" component={PublishViewTest} />
      <Scene key="PICKER_TEST" component={PickerTest} />
      <Scene key="COMMON_WEB_VIEW" component={CommonWebView} />
      <Scene key="DCTOR_CERTIFICATION" component={DoctorCertification}/>
      <Scene key="DCTOR_INFO" component={DoctorInfo}/>
      <Scene key="PROFILE" component={Profile} />
      <Scene key="SHOPR_EGISTER" component={ShopRegister}/>
      <Scene key="ARTICLES_ARTICLE" component={Article}/>
      <Scene key="ARTICLES_ARTICLELIST" component={ArticleList}/>
      <Scene key="SHOPR_EGISTER_SUCCESS" component={ShopRegistSuccess}/>
      <Scene key="GET_INVITATION_CODE" component={GetInvitationCode}/>
      <Scene key="CHATROOM" component={Chatroom} />
      <Scene key="SHOP_CATEGORY_LIST" component={ShopCategoryList} />
      <Scene key="SHOP_DETAIL" component={ShopDetail} />
      <Scene key="PUBLISH" component={PublishTopics} />
      <Scene key="MESSAGE_BOX" component={MessageBox} />
      <Scene key="TEXTIMAGE" component={TextImageTest} />


      <Scene key="HOME" tabs hideNavBar tabBarStyle={styles.tabBarStyle}>
        <Scene key="HOME_INDEX" title="主页" number={0} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
          <Scene key="WUAI" component={Home}/>
        </Scene>

        <Scene key="LOCAL" title="本地" number={1} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
          <Scene key="LOCAL_INDEX" component={Local} />
        </Scene>

        <Scene key="FIND" title="发现" number={2} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
          <Scene key="FIND_INDEX" component={Find} />
        </Scene>

        <Scene key="MINE" title="我的" number={3} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
          <Scene key="MINE_INDEX" component={Mine}/>
        </Scene>
      </Scene>
    </Scene>
  </Scene>
)

function tapActions(props) {

  if (props.index == 3) {
    AsyncStorage.getItem("reduxPersist:AUTH").then((data) => {
      let jsonData = JSON.parse(data)
      console.log('User Auth:', jsonData)
      let activeUser = jsonData.token
      return activeUser ? true : false
    }).then((result) => {
      if (!result) {
        Actions.LOGIN()
      } else {
        Actions.MINE()
      }
    })
  } else {
    switch (props.index) {
      case 0: {
        Actions.HOME_INDEX()
        break
      }
      case 1: {
        Actions.LOCAL()
        break
      }
      case 2: {
        Actions.FIND()
        break
      }
      default: {
        Actions.HOME()
      }
    }
  }
}
