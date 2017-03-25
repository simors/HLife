import React, {Component} from 'react'
import {StyleSheet, AsyncStorage} from 'react-native'
import {Actions, Scene, Switch, ActionConst, Modal} from 'react-native-router-flux'

import {IDENTITY_SHOPKEEPER} from '../constants/appConfig'
import Launch from '../components/Launch'
import Home from '../components/Home'
import Local from '../components/Local'
import Find from '../components/Find'
import Mine from '../components/Mine'
import Login from '../components/Login'
import Regist from '../components/Login/Regist'
import NicknameView from '../components/Login/NicknameView'
import AgreementView from '../components/Login/AgreementView'
import RetrievePwdVerifyCode from '../components/Login/RetrievePwdVerifyCode'
import PublishViewTest from '../components/common/Input/PublishViewTest'
import PickerTest from '../components/common/Input/PickerTest'
import CommonWebView from '../components/common/CommonWebView'
import * as reactInvokeMethod from "../util/reactMethodUtils"
import TabIcon from '../components/common/TabIcon'
import DoctorCertification from '../components/Mine/DoctorCertification'
import DoctorInfo from '../components/Mine/DoctorInfo'
import DoctorRevise from '../components/Mine/DoctorRevise'
import DoctorChecking from '../components/Mine/DoctorChecking'
import Profile from '../components/Mine/Profile'
import PersonalHomePage from '../components/Mine/PersonalHomePage'
import ShopRegister from '../components/Mine/myShop/ShopRegister'
import ArticleList from '../components/Articles/ArticleList'
import Article from '../components/Articles/Article'
import ShopRegistSuccess from '../components/Mine/myShop/ShopRegistSuccess'
import CompleteShopInfo from '../components/Mine/myShop/CompleteShopInfo'
import ShopManageIndex from '../components/Mine/myShop/ShopManageIndex'
import UpdateShopCover from '../components/Mine/myShop/UpdateShopCover'
import ShopReCertification from '../components/Mine/myShop/ShopReCertification'
import UpdateShopAlbum from '../components/Mine/myShop/UpdateShopAlbum'
import ShopAnnouncementsManage from '../components/Mine/myShop/ShopAnnouncementsManage'
import PublishShopAnnouncement from '../components/Mine/myShop/PublishShopAnnouncement'
import GetInvitationCode from '../components/Mine/myShop/GetInvitationCode'
import Chatroom from '../components/Chatroom'
import ShopCategoryList from '../components/shop/ShopCategoryList'
import ShopDetail from '../components/shop/ShopDetail'
import PublishShopComment from '../components/shop/PublishShopComment'
import ShopPromotionDetail from '../components/shop/ShopPromotionDetail'
import ShopCommentList from '../components/shop/ShopCommentList'
import PublishTopics from '../components/Find/PublishTopics'
import MessageBox from '../components/Message'
import TextImageTest from '../components/common/Input/TextImageTest'
import Setting from '../components/Mine/Setting'
import Popup from '../components/common/Popup'
import TopicDetail from '../components/Find/TopicDetail'
import DocterFinder from '../components/Health/DocterFinder'
import Inguiry from '../components/Home/Inquiry/index'
import AddHealthProfile from '../components/Home/Inquiry/AddHealthProfile'
import SelectDoctor from '../components/Home/Inquiry/SelectDoctor'
import QA from '../components/Home/Inquiry/QA'
import QAList from '../components/Home/Inquiry/QAList'
import DoctorIntro from '../components/Mine/DoctorIntro'
import DoctorSpec from '../components/Mine/DoctorSpec'
import SelectHealthProfile from '../components/Home/Inquiry/SelectHealthProfile'
import InquiryMessageBox from '../components/Message/InquiryMessageBox'
import PrivateMessageBox from '../components/Message/PrivateMessageBox'
import ArticleInputTest from '../components/common/Input/ArticleInputTest'
import PromoterAuth from '../components/Mine/promote/PromoterAuth'
import GetInviteCode from '../components/Mine/promote/GetInviteCode'
import PromoterAuthSuccess from '../components/Mine/promote/PromoterAuthSuccess'
import Doctor from '../components/Mine/Doctor/index'
import Acknowledge from '../components/Mine/Doctor/Acknowledge'
import Earnings from '../components/Mine/Doctor/Earnings'
import BasicDoctorInfo from '../components/Mine/Doctor/BasicDoctorInfo'
import FavoriteArticles from '../components/Mine/myFavorite/FavoriteArticles'
import MyTopic from '../components/Mine/MyTopic'
import MyAttention from '../components/Mine/MyAttention'
import MyFans from '../components/Mine/myFans'
import LikeUserList from '../components/Find/LikeUserList'
import ShopNotifyView from '../components/Message/ShopNotifyView'
import TopicNotifyView from '../components/Message/TopicNotifyView'
import BaiduMapView from '../components/common/BaiduMapView'
import ShopAddressSelect from '../components/Mine/myShop/ShopAddressSelect'
import CommentDoctor from '../components/Mine/Doctor/CommentDoctor'
import QRCodeReader from '../components/Mine/QRCodeReader'
import PersonalQR from '../components/Mine/PersonalQR'
import Publish from '../components/Publish'
import PublishShopPromotion from '../components/shop/PublishShopPromotion'
import PromoterPerformance from '../components/Mine/promote/PromoterPerformance'
import TopicEdit from '../components/Find/TopicEdit'

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
      <Scene key="LOGIN" component={Login} />
      <Scene key="REGIST" component={Regist} />
      <Scene key="NICKNAME_VIEW" component={NicknameView} />
      <Scene key="AGREEMENT_VIEW" component={AgreementView} />
      <Scene key="RETRIEVE_PWD" component={RetrievePwdVerifyCode}/>
      <Scene key="PUBLISH_VIEW_TEST" component={PublishViewTest} />
      <Scene key="PICKER_TEST" component={PickerTest} />
      <Scene key="COMMON_WEB_VIEW" component={CommonWebView} />
      <Scene key="DCTOR_CERTIFICATION" component={DoctorCertification} />
      <Scene key="DCTOR_INFO" component={DoctorInfo} />
      <Scene key="DCTOR_REVISE" component={DoctorRevise} />
      <Scene key="DCTOR_CHECKING" component={DoctorChecking}/>
      <Scene key="PROFILE" component={Profile} />
      <Scene key="PERSONAL_HOMEPAGE" component={PersonalHomePage}/>
      <Scene key="SHOPR_EGISTER" component={ShopRegister}/>
      <Scene key="ARTICLES_ARTICLE" component={Article}/>
      <Scene key="ARTICLES_ARTICLELIST" component={ArticleList}/>
      <Scene key="SHOPR_EGISTER_SUCCESS" component={ShopRegistSuccess}/>
      <Scene key="COMPLETE_SHOP_INFO" component={CompleteShopInfo}/>
      <Scene key="SHOP_MANAGE_INDEX" component={ShopManageIndex}/>
      <Scene key="UPDATE_SHOP_COVER" component={UpdateShopCover}/>
      <Scene key="UPDATE_SHOP_ALBUM" component={UpdateShopAlbum}/>
      <Scene key="SHOP_RE_CERTIFICATION" component={ShopReCertification}/>
      <Scene key="SHOP_ANNOUNCEMENTS_MANAGE" component={ShopAnnouncementsManage}/>
      <Scene key="PUBLISH_SHOP_ANNOUNCEMENT" component={PublishShopAnnouncement}/>
      <Scene key="GET_INVITATION_CODE" component={GetInvitationCode}/>
      <Scene key="CHATROOM" component={Chatroom} />
      <Scene key="SHOP_CATEGORY_LIST" component={ShopCategoryList} />
      <Scene key="SHOP_DETAIL" component={ShopDetail} />
      <Scene key="PUBLISH_SHOP_COMMENT" component={PublishShopComment} />
      <Scene key="SHOP_COMMENT_LIST" component={ShopCommentList} />
      <Scene key="PUBLISH_TOPIC" component={PublishTopics} />
      <Scene key="TOPIC_DETAIL" component={TopicDetail} />
      <Scene key="MESSAGE_BOX" component={MessageBox} />
      <Scene key="INQUIRY_MESSAGE_BOX" component={InquiryMessageBox} />
      <Scene key="PRIVATE_MESSAGE_BOX" component={PrivateMessageBox} />
      <Scene key="TEXTIMAGE" component={TextImageTest} />
      <Scene key="SETTING" component={Setting} />
      <Scene key="DOCTER_FINDER" component={DocterFinder} />
      <Scene key="INQUIRY" component={Inguiry} />
      <Scene key="HEALTH_PROFILE" component={AddHealthProfile} />
      <Scene key="SELECT_DOCTOR" component={SelectDoctor} />
      <Scene key="QA" component={QA}/>
      <Scene key="QA_LIST" component={QAList}/>
      <Scene key="DOCTOR_INTRO" component={DoctorIntro}/>
      <Scene key="DOCTOR_SPEC" component={DoctorSpec}/>
      <Scene key="SELECT_HEALTH_PROFILE" component={SelectHealthProfile}/>
      <Scene key="ARTICLE_INPUT_TEST" component={ArticleInputTest} />
      <Scene key="PROMOTER_AUTH" component={PromoterAuth}/>
      <Scene key="GET_INVITE_CODE" component={GetInviteCode}/>
      <Scene key="PROMOTER_AUTH_SUCCESS" component={PromoterAuthSuccess}/>
      <Scene key="FAVORITE_ARTICLES" component={FavoriteArticles}/>
      <Scene key="DOCTOR" component={Doctor} />
      <Scene key="ACKNOWLEDGE" component={Acknowledge} />
      <Scene key="EARNINGS" component={Earnings} />
      <Scene key="BASIC_DOCTOR_INFO" component={BasicDoctorInfo}/>
      <Scene key="LIKE_USER_LIST" component={LikeUserList}/>
      <Scene key="MYTOPIC" component={MyTopic}/>
      <Scene key="MYATTENTION" component={MyAttention}/>
      <Scene key="MYFANS" component={MyFans} />
      <Scene key="SHOP_NOTIFY" component={ShopNotifyView} />
      <Scene key="TOPIC_NOTIFY" component={TopicNotifyView} />
      <Scene key="BAI_DU_MAP_VIEW" component={BaiduMapView} />
      <Scene key="SHOP_ADDRESS_SELECT" component={ShopAddressSelect} />
      <Scene key="COMMENT_DOCTOR" component={CommentDoctor}/>
      <Scene key="QRCODEREADER" component={QRCodeReader}/>
      <Scene key="GEN_PERSONALQR" component={PersonalQR} />
      <Scene key="PUBLISH" component={Publish}/>
      <Scene key="PUBLISH_SHOP_PROMOTION" component={PublishShopPromotion}/>
      <Scene key="SHOP_PROMOTION_DETAIL" component={ShopPromotionDetail}/>
      <Scene key="PROMOTER_PERFORMANCE" component={PromoterPerformance} />
      <Scene key="TOPIC_EDIT" component={TopicEdit}/>

      <Scene key="HOME" tabs hideNavBar tabBarStyle={styles.tabBarStyle}>
        <Scene key="HOME_INDEX" title="主页" number={0} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
          <Scene key="WUAI" component={Home}/>
        </Scene>

        <Scene key="LOCAL" title="优店" number={1} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
          <Scene key="LOCAL_INDEX" component={Local} />
        </Scene>

        <Scene key="PUBLISH_VIEW" title="发布"  number={2} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
        </Scene>

        <Scene key="FIND" title="话题" number={3} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
          <Scene key="FIND_INDEX" component={Find} />
        </Scene>

        <Scene key="MINE" title="我的" number={4} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
          <Scene key="MINE_INDEX" component={Mine}/>
        </Scene>
      </Scene>

      <Scene key="POPUP" component={Popup} />
    </Scene>
  </Scene>
)

function tapActions(props) {
  if (props.index == 4) {
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
  } if (props.index == 2) {
    if (!props.isLogin) {
      Actions.LOGIN()
    } else {
      let identity = props.identity
      if (identity && identity.includes(IDENTITY_SHOPKEEPER)) {
        Actions.PUBLISH()
      } else {
        Actions.PUBLISH_TOPIC()
      }
    }
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
      case 3: {
        Actions.FIND()
        break
      }
      default: {
        Actions.HOME()
      }
    }
  }
}
