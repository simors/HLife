import React, {Component} from 'react'
import {StyleSheet, AsyncStorage, StatusBar, InteractionManager} from 'react-native'
import {Actions, Scene, Switch, ActionConst, Modal} from 'react-native-router-flux'
import {store} from '../store/persistStore'
import {fetchUserOwnedShopInfo} from '../action/shopAction'
import {getCurrentPromoter, getPromoterTenant} from '../action/promoterAction'
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
import CommonWebView from '../components/common/CommonWebView'
import TabIcon from '../components/common/TabIcon'
import Profile from '../components/Mine/Profile'
import PersonalHomePage from '../components/Mine/PersonalHomePage'
import ShopRegister from '../components/Mine/myShop/ShopRegister'
import ArticleList from '../components/Articles/ArticleList'
import Article from '../components/Articles/Article'
import ShopRegistSuccess from '../components/Mine/myShop/ShopRegistSuccess'
import CompleteShopInfo from '../components/Mine/myShop/CompleteShopInfo'
import MyShopIndex from '../components/Mine/myShop/MyShopIndex'
import EditShop from '../components/Mine/myShop/EditShop'
import ShopManageIndex from '../components/Mine/myShop/ShopManageIndex'
import ShopFansIndex from '../components/Mine/myShop/ShopFansIndex'
import MyShopPromotionManageIndex from '../components/Mine/myShop/MyShopPromotionManageIndex'
import ShopCertificationInfoShow from '../components/Mine/myShop/ShopCertificationInfoShow'
import UpdateShopCover from '../components/Mine/myShop/UpdateShopCover'
import UpdateShopCover4EditShop from '../components/Mine/myShop/UpdateShopCover4EditShop'
import ShopReCertification from '../components/Mine/myShop/ShopReCertification'
import UpdateShopAlbum from '../components/Mine/myShop/UpdateShopAlbum'
import UpdateShopAlbum4EditShop from '../components/Mine/myShop/UpdateShopAlbum4EditShop'
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
import PrivateMessageBox from '../components/Message/PrivateMessageBox'
import ArticleInputTest from '../components/common/Input/ArticleInputTest'
import GetInviteCode from '../components/Mine/promote/GetInviteCode'
import PromoterAuthSuccess from '../components/Mine/promote/PromoterAuthSuccess'
import FavoriteArticles from '../components/Mine/myFavorite/FavoriteArticles'
import MyTopic from '../components/Mine/MyTopic'
import MyAttention from '../components/Mine/MyAttention'
import MyFans from '../components/Mine/myFans'
import LikeUserList from '../components/Find/LikeUserList'
import ShopNotifyView from '../components/Message/ShopNotifyView'
import TopicNotifyView from '../components/Message/TopicNotifyView'
import SystemNotifyView from '../components/Message/SystemNotifyView'
import BaiduMapView from '../components/common/BaiduMapView'
import ShopAddressSelect from '../components/Mine/myShop/ShopAddressSelect'
import QRCodeReader from '../components/Mine/QRCodeReader'
import PersonalQR from '../components/Mine/PersonalQR'
import Publish from '../components/Publish'
import PublishShopPromotion from '../components/shop/PublishShopPromotion'
import EditShopPromotion from '../components/Mine/myShop/EditShopPromotion'
import PromoterPerformance from '../components/Mine/promote/PromoterPerformance'
import TopicEdit from '../components/Find/TopicEdit'
import InviteCodeViewer from '../components/Mine/promote/InviteCodeViewer'
import InviteExplain from '../components/Mine/promote/InviteExplain'
import Payment from '../components/Payment'
import PaymentSuccess from '../components/Payment/PaymentSuccess'
import AdviseFeedback from '../components/Advise/index'
import SubmitAdviseSuccess from '../components/Advise/submitSuccess'
import PromoterDirectTeam from '../components/Mine/promote/PromoterDirectTeam'
import Wallet from '../components/Payment/Wallet'
import IdentifyCard from '../components/Payment/IdentifyCard'
import PaymentSmsAuth from '../components/Payment/PaymentSmsAuth'
import PaymentPassword from '../components/Payment/PaymentPassword'
import PromoterSecondTeam from '../components/Mine/promote/PromoterSecondTeam'
import InvitedShops from '../components/Mine/promote/InvitedShops'
import AgentPromoter from '../components/Mine/promote/AgentPromoter'
import AreaPromoterManager from '../components/Mine/promote/AreaPromoterManager'
import PasswordConfirm from '../components/Payment/PasswordConfirm'
import Mydrafts from '../components/Mine/myDrafts/index'
import AreaPromoterDetail from '../components/Mine/promote/AreaPromoterDetail'
import ChangeAgentView from '../components/Mine/promote/ChangeAgentView'
import PasswordSetting from '../components/Payment/PasswordSetting'
import Withdrawals from '../components/Payment/Withdrawals'
import Share from '../components/common/Share'
import PromoterPaymentOk from '../components/Payment/PromoterPaymentOk'
import EarningRecord from '../components/Mine/promote/EarningRecord'
import PublishShopPromotionChooseGood from '../components/Mine/myShop/PublishShopPromotionChooseGood'
import Contact from '../components/Mine/Contact'
import Search from '../components/Search'
import SearchUser from '../components/Search/SearchUser'
import SearchShop from '../components/Search/SearchShop'
import SearchTopic from '../components/Search/SearchTopic'
import DealRecords from '../components/Payment/DealRecords'
import BuyGoodsPaySuccess from '../components/Payment/BuyGoodsPaySuccess'
import RewardSuccess from '../components/Payment/RewardSuccess'
import ShopAlbumView from '../components/Mine/myShop/ShopAlbumView'
import ShopGoodsManage from '../components/Mine/myShop/ShopGoodsManage'
import UpdateShopGoodAlbum from '../components/Mine/myShop/UpdateShopGoodAlbum'
import PublishShopGood from '../components/shop/PublishShopGood'
import EditShopGood from '../components/Mine/myShop/EditShopGood'
import ShopGoodsListView from '../components/shop/ShopGoodsListView'
import ShopGoodsDetail from '../components/shop/ShopGoodsDetail'
import SupplementUserInfo from '../components/Login/SupplementUserInfo'
import QrcodeView from '../components/Mine/promote/QrcodeView'
import TopicCommentDetail from '../components/Find/TopicCommentDetail'
import SetMobilePhoneNumber from '../components/Login/SetMobilePhoneNumber'

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
      <Scene key="LAUNCH" component={Launch} hideTabBar hideNavBar />
      <Scene key="LOGIN" component={Login} />
      <Scene key="REGIST" component={Regist} />
      <Scene key="NICKNAME_VIEW" component={NicknameView} />
      <Scene key="AGREEMENT_VIEW" component={AgreementView} />
      <Scene key="RETRIEVE_PWD" component={RetrievePwdVerifyCode}/>
      <Scene key="PUBLISH_VIEW_TEST" component={PublishViewTest} />
      <Scene key="COMMON_WEB_VIEW" component={CommonWebView} />
      <Scene key="PROFILE" component={Profile} />
      <Scene key="PERSONAL_HOMEPAGE" component={PersonalHomePage}/>
      <Scene key="SHOPR_EGISTER" component={ShopRegister} />
      <Scene key="ARTICLES_ARTICLE" component={Article}/>
      <Scene key="ARTICLES_ARTICLELIST" component={ArticleList}/>
      <Scene key="SHOPR_EGISTER_SUCCESS" component={ShopRegistSuccess}/>
      <Scene key="COMPLETE_SHOP_INFO" component={CompleteShopInfo} />
      <Scene key="SHOP_MANAGE_INDEX" component={ShopManageIndex}/>
      <Scene key="SHOP_FANS_INDEX" component={ShopFansIndex}/>
      <Scene key="MY_SHOP_PROMOTION_MANAGE_INDEX" component={MyShopPromotionManageIndex}/>
      <Scene key="SHOP_CERTIFICATION_INFO_SHOW" component={ShopCertificationInfoShow}/>
      <Scene key="MY_SHOP_INDEX" component={MyShopIndex}/>
      <Scene key="EDIT_SHOP" component={EditShop} />
      <Scene key="UPDATE_SHOP_COVER" component={UpdateShopCover}/>
      <Scene key="UPDATE_SHOP_COVER_FOR_EDIT_SHOP" component={UpdateShopCover4EditShop}/>
      <Scene key="UPDATE_SHOP_ALBUM" component={UpdateShopAlbum}/>
      <Scene key="UPDATE_SHOP_ALBUM_FOR_EDIT_SHOP" component={UpdateShopAlbum4EditShop}/>
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
      <Scene key="PRIVATE_MESSAGE_BOX" component={PrivateMessageBox} />
      <Scene key="TEXTIMAGE" component={TextImageTest} />
      <Scene key="SETTING" component={Setting} />
      <Scene key="ARTICLE_INPUT_TEST" component={ArticleInputTest} />
      <Scene key="GET_INVITE_CODE" component={GetInviteCode}/>
      <Scene key="PROMOTER_AUTH_SUCCESS" component={PromoterAuthSuccess}/>
      <Scene key="FAVORITE_ARTICLES" component={FavoriteArticles}/>
      <Scene key="LIKE_USER_LIST" component={LikeUserList}/>
      <Scene key="TOPIC_COMMENT_DETAIL" component={TopicCommentDetail}/>

      <Scene key="MYTOPIC" component={MyTopic}/>
      <Scene key="SHOP_GOODSLIST_VIEW"component={ShopGoodsListView}/>
      <Scene key="MYATTENTION" component={MyAttention}/>
      <Scene key="MYFANS" component={MyFans} />
      <Scene key="SHOP_NOTIFY" component={ShopNotifyView} />
      <Scene key="TOPIC_NOTIFY" component={TopicNotifyView} />
      <Scene key="SYSTEM_NOTIFY" component={SystemNotifyView} />
      <Scene key="BAI_DU_MAP_VIEW" component={BaiduMapView} />
      <Scene key="SHOP_ADDRESS_SELECT" component={ShopAddressSelect} />
      <Scene key="QRCODEREADER" component={QRCodeReader}/>
      <Scene key="GEN_PERSONALQR" component={PersonalQR} />
      <Scene key="PUBLISH" component={Publish}/>
      <Scene key="PUBLISH_SHOP_PROMOTION" component={PublishShopPromotion}/>
      <Scene key="EDIT_SHOP_PROMOTION" component={EditShopPromotion}/>
      <Scene key="SHOP_PROMOTION_DETAIL" component={ShopPromotionDetail}/>
      <Scene key="PROMOTER_PERFORMANCE" component={PromoterPerformance} />
      <Scene key="TOPIC_EDIT" component={TopicEdit}/>
      <Scene key="INVITE_CODE_VIEWER" component={InviteCodeViewer} />
      <Scene key="INVITE_EXPLAIN" component={InviteExplain}/>
      <Scene key="PAYMENT" component={Payment}/>
      <Scene key="PAYMENT_SUCCESS" component={PaymentSuccess}/>
      <Scene key="ADVISE_FEEDBACK" component={AdviseFeedback}/>
      <Scene key="SUBMIT_ADVISE_SUCCESS" component={SubmitAdviseSuccess}/>
      <Scene key="DIRECT_TEAM" component={PromoterDirectTeam} />
      <Scene key="WALLET" component={Wallet} />
      <Scene key="IDENTIFY_CARD" component={IdentifyCard} />
      <Scene key="PAYMENT_SMS_AUTH" component={PaymentSmsAuth} />
      <Scene key="PAYMENT_PASSWORD" component={PaymentPassword} />
      <Scene key="PROMOTER_SECOND_TEAM" component={PromoterSecondTeam} />
      <Scene key="INVITED_SHOPS" component={InvitedShops} />
      <Scene key="AGENT_PROMOTER" component={AgentPromoter} />
      <Scene key="AREA_MANAGER" component={AreaPromoterManager}/>
      <Scene key="PASSWORD_CONFIRM" component={PasswordConfirm}/>
      <Scene key="MY_DRAFTS" component={Mydrafts}/>
      <Scene key="AREA_DETAIL" component={AreaPromoterDetail}/>
      <Scene key="CHANGE_AGENT" component={ChangeAgentView}/>
      <Scene key="PAYMENT_SETTING" component={PasswordSetting}/>
      <Scene key="WITHDRAWALS" component={Withdrawals} />
      <Scene key="PROMOTER_PAYMENT_OK" component={PromoterPaymentOk}/>
      <Scene key="EARN_RECORD" component={EarningRecord}/>
      <Scene key="CONTACT" component={Contact}/>
      <Scene key="SEARCH" component={Search}/>
      <Scene key="SEARCH_USER" component={SearchUser}/>
      <Scene key="SEARCH_SHOP" component={SearchShop}/>
      <Scene key="SEARCH_TOPIC" component={SearchTopic}/>
      <Scene key="DEAL_RECORDS" component={DealRecords}/>
      <Scene key="BUY_GOODS_OK" component={BuyGoodsPaySuccess}/>
      <Scene key="REWARD_OK" component={RewardSuccess}/>
      <Scene key="SHOP_ALBUM_VIEW" component={ShopAlbumView}/>
      <Scene key="SHOP_GOODS_MANAGE" component={ShopGoodsManage}/>
      <Scene key="PUBLISH_SHOP_GOOD" component={PublishShopGood}/>
      <Scene key="UPDATE_SHOP_GOOD_ALBUM" component={UpdateShopGoodAlbum}/>
      <Scene key="EDIT_SHOP_GOOD" component={EditShopGood}/>
      <Scene key="SHOP_GOODS_DETAIL" component={ShopGoodsDetail}/>
      <Scene key="SUPPLEMENT_USERINFO" component={SupplementUserInfo}/>
      <Scene key="QRCODE_VIEW" component={QrcodeView}/>
      <Scene key="SET_MOBILE_PHONE_NUMBER" component={SetMobilePhoneNumber}/>
      <Scene key="PUBLISH_SHOP_PROMOTION_CHOOSE_GOOD" component={PublishShopPromotionChooseGood}/>

      <Scene key="HOME" tabs hideNavBar tabBarStyle={styles.tabBarStyle} initial={true}>
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
    <Scene key="SHARE" component={Share}/>
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
        InteractionManager.runAfterInteractions(()=>{
          store.dispatch(fetchUserOwnedShopInfo())
          store.dispatch(getCurrentPromoter({}))
          // store.dispatch(getPromoterTenant())    // 推广员不再需要缴费
        })
      }
    })
  } if (props.index == 2) {
    if (!props.isLogin) {
      Actions.LOGIN()
    } else {
      let identity = props.identity
      let shopPayment = props.shopPayment
      let shopInfoComplete = props.shopInfoComplete
      if (identity && identity.includes(IDENTITY_SHOPKEEPER) && shopPayment && shopInfoComplete) {
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
