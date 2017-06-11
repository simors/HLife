/**
 * Created by lilu on 2017/6/6.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  InteractionManager,
  ScrollView,
  StatusBar,
  Keyboard,
  BackAndroid,
  ListView,
  Modal,
  TextInput,
  Animated

} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import ViewPager2 from '../common/ViewPager2'
import ViewPager from '../common/ViewPager'
import Gallery from 'react-native-gallery'

import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import ChatroomShopGoodCustiomTopView from './ChatroomShopGoodCustiomTopView'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees, fetchUsers} from '../../action/authActions'
import * as AVUtils from '../../util/AVUtils'
import {
  selectUserOwnedShopInfo,
  selectShopDetail,
  selectShopList,
  selectGuessYouLikeShopList,
  selectLatestShopAnnouncemment,
  selectUserIsFollowShop,
  selectShopComments,
  selectShopCommentsTotalCount,
  selectUserIsUpedShop,
  selectGoodsList
} from '../../selector/shopSelector'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as configSelector from '../../selector/configSelector'
import GoodAlbumShow from './GoodAlbumShow'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import ToolBarContent from '../shop/ShopCommentReply/ToolBarContent'
import {fetchOtherUserFollowersTotalCount} from '../../action/authActions'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import * as authSelector from '../../selector/authSelector'
import Icon from 'react-native-vector-icons/Ionicons'
import {getTopicLikedTotalCount, getTopicComments, isTopicLiked, getTopicLikeUsers} from '../../selector/topicSelector'
import {
  fetchTopicLikesCount,
  fetchTopicIsLiked,
  likeTopic,
  unLikeTopic,
  fetchTopicLikeUsers,
} from '../../action/topicActions'
import ActionSheet from 'react-native-actionsheet'
import CommonListView from '../common/CommonListView'
import {fetchShareDomain} from '../../action/configAction'
import {getShareDomain, getTopicCategoriesById} from '../../selector/configSelector'
import {REWARD} from '../../constants/appConfig'
import * as Toast from '../common/Toast'
import {fetchTopicCommentsByTopicId} from '../../action/topicActions'
import {DEFAULT_SHARE_DOMAIN} from '../../util/global'
import {CachedImage} from "react-native-img-cache"
import ArticleViewer from '../common/Input/ArticleViewer'
import {BUY_GOODS} from '../../constants/appConfig'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopGoodsDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPayModal: false,
      fade: new Animated.Value(0),
      buyAmount: '1',
      imgModalShow: false,
      showImg: '',
    }
    this.images = []

  }

  componentDidMount() {
    this.props.goodInfo.album.map((item) => {
        this.images.push(item)

    })
  }

  renderMainHeader() {
    return (
      <Animated.View style={{
        backgroundColor: THEME.base.mainColor,
        opacity: this.state.fade,
        position: 'absolute',
        top: 0,
        left: 0,
        width: PAGE_WIDTH,
        zIndex: 10,
      }}
      >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => {
            AVUtils.pop({
              backSceneName: this.props.backSceneName,
              backSceneParams: this.props.backSceneParams
            })
          }}
          title="商品详情"

        />
      </Animated.View>
    )
  }

  bannerClickListener(banner) {

  }
  toggleModal(isShow, src) {
    this.setState({
      ...this.state,
      imgModalShow: isShow,
      showImg: src
    })
  }

  androidHardwareBackPress() {
    this.toggleModal(false)
  }

  renderImageModal() {
    let index = this.images.findIndex((val) => {
      return (val == this.state.showImg)
    })
    if (index == -1) {
      index = 0
    }
    return (
      <View>
        <Modal
          visible={this.state.imgModalShow}
          transparent={false}
          animationType='fade'
          onRequestClose={()=>{this.androidHardwareBackPress()}}
        >
          <View style={{width: PAGE_WIDTH, height: PAGE_HEIGHT}}>
            <Gallery
              style={{flex: 1, backgroundColor: 'black'}}
              images={this.images}
              initialPage={index}
              onSingleTapConfirmed={() => this.toggleModal(!this.state.imgModalShow)}
            />
          </View>
        </Modal>
      </View>
    )
  }

  renderBannerColumn() {
     // console.log('this.props.value.album====', this.props.value.album)

    if ( this.props.goodInfo.album && this.props.goodInfo.album.length>1) {
      let pages =  this.props.goodInfo.album.map((item, index) => {
        let image = item
        return (
          // <TouchableOpacity
          //   style={{flex: 1}}
          //   key={'b_image_' + index}
          //   onPress={() => this.bannerClickListener(item)}
          // >
          //   <CachedImage
          //     mutable
          //     style={[{width: PAGE_WIDTH, height: normalizeH(223)}]}
          //     resizeMode="stretch"
          //     source={typeof(image) == 'string' ? {uri: image} : image}
          //   />
          // </TouchableOpacity>
          <GoodAlbumShow image={image} onPress={() => this.toggleModal(!this.state.imgModalShow, item)}/>
        )
      })

      let dataSource = new ViewPager.DataSource({
        pageHasChanged: (p1, p2) => p1 !== p2,
      })
      // console.log('dataSource',pages)
      return (
        <View style={styles.advertisementModule}>
          <ViewPager
            style={{flex: 1}}
            dataSource={dataSource.cloneWithPages(pages)}
            renderPage={this._renderPage}
            isLoop={true}
            autoPlay={true}
          />
        </View>
      )
    }else if(this.props.goodInfo.album && this.props.goodInfo.album.length==1){
      return(
        <TouchableWithoutFeedback
          style={{flex: 1}}
          onPress={() => this.toggleModal(!this.state.imgModalShow, this.props.goodInfo.album[0])}
        >
          <CachedImage
            mutable
            style={[{width: PAGE_WIDTH, height: normalizeH(223)}]}
            resizeMode="stretch"
            source={typeof(this.props.goodInfo.album[0]) == 'string' ? {uri: this.props.goodInfo.album[0]} : this.props.goodInfo.album[0]}
          />
        </TouchableWithoutFeedback>
      )
    }
  }
  _renderPage(data: Object, pageID) {
    // console.log('_renderPage.data====', data)
    return (
      <View style={{flex:1}}>
        {data}
      </View>
    )
  }

  handleOnScroll(e) {
    let offset = e.nativeEvent.contentOffset.y
    let comHeight = normalizeH(200)
    if (offset >= 0 && offset < 10) {
      Animated.timing(this.state.fade, {
        toValue: 0,
        duration: 100,
      }).start()
    } else if (offset > 10 && offset < comHeight) {
      Animated.timing(this.state.fade, {
        toValue: (offset - 10) / comHeight,
        duration: 100,
      }).start()
    } else if (offset >= comHeight) {
      Animated.timing(this.state.fade, {
        toValue: 1,
        duration: 100,
      }).start()
    }
  }

  openPaymentModal() {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
    } else {
      this.setState({showPayModal: true})
    }
  }

  renderBottomView() {
    return (
      <View style={styles.footerWrap}>
        <View style={styles.priceBox}>
          <Text style={styles.priceTxt}>￥{this.props.goodInfo.price}</Text>
        </View>
        <TouchableOpacity style={{flex: 1}} onPress={() => this.sendPrivateMessage()}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image style={{width: 24, height: 24}} resizeMode='contain'
                   source={require('../../assets/images/service_24.png')}/>
            <Text style={{fontSize: em(10), color: '#aaa', paddingTop: normalizeH(5)}}>联系卖家</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerBtnBox} onPress={()=> {
          this.openPaymentModal()
        }}>
          <Image source={require('../../assets/images/purchase_24.png')}/>
          <Text style={styles.footerBtnTxt}>立即购买</Text>
        </TouchableOpacity>
      </View>
    )
  }

  onShare = () => {
    let shareUrl = this.props.shareDomain ? this.props.shareDomain + "shopShare/" + this.props.shopDetail.id :
    DEFAULT_SHARE_DOMAIN + "shopShare/" + this.props.shopDetail.id

    console.log("shopShare url:", shareUrl)

    Actions.SHARE({
      title: this.props.shopDetail.shopName || "汇邻优店",
      url: shareUrl,
      author: this.props.shopDetail.shopName || "邻家小二",
      abstract: this.props.shopDetail.shopAddress || "未知地址",
      cover: this.props.shopDetail.coverUrl || '',
    })
  }

  sendPrivateMessage() {
    if (!this.props.isUserLogined) {
      Actions.LOGIN()
    } else {

      this.props.fetchUsers({userIds: [this.props.shopDetail.owner.id]})

      let payload = {
        name: this.props.shopDetail.owner.nickname,
        members: [this.props.currentUser, this.props.shopDetail.owner.id],
        conversationType: PERSONAL_CONVERSATION,
        title: this.props.goodInfo.goodsName,
        customTopView: this.customTopView()
      }
      Actions.CHATROOM(payload)
    }
  }

  renderPaymentModal() {
    return (
      <View>
        <Modal
          visible={this.state.showPayModal}
          transparent={true}
          animationType='fade'
          onRequestClose={()=> {
            this.setState({showPayModal: false})
          }}
        >
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View style={{backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center'}}>
              <View style={{paddingBottom: normalizeH(20), paddingTop: normalizeH(20)}}>
                <Text style={{fontSize: em(20), color: '#5A5A5A', fontWeight: 'bold'}}>设置购买数量</Text>
              </View>
              <View style={{paddingBottom: normalizeH(15), flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: em(17), color: THEME.base.mainColor, paddingRight: 8}}>数量：</Text>
                <TextInput
                  placeholder='输入数量'
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => this.setState({buyAmount: text})}
                  value={this.state.buyAmount}
                  keyboardType="numeric"
                  maxLength={6}
                  style={{
                    height: normalizeH(42),
                    fontSize: em(17),
                    textAlignVertical: 'center',
                    textAlign: 'right',
                    borderColor: '#0f0f0f',
                    width: normalizeW(80),
                    paddingRight: normalizeW(15),
                  }}
                />
                <Text style={{fontSize: em(17), color: '#5A5A5A', paddingLeft: 8}}>份</Text>
              </View>
              <View style={{
                width: PAGE_WIDTH - 100,
                height: normalizeH(50),
                padding: 0,
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 1,
                borderColor: '#F5F5F5'
              }}>
                <View style={{flex: 1, borderRightWidth: 1, borderColor: '#F5F5F5'}}>
                  <TouchableOpacity
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                    onPress={() => this.setState({showPayModal: false})}>
                    <Text style={{fontSize: em(17), color: '#5A5A5A'}}>取消</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                    onPress={() => this.onPaymentPress()}>
                    <Text style={{fontSize: em(17), color: THEME.base.mainColor}}>确定</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  onPaymentPress() {
    this.setState({showPayModal: false})
    let amount = this.state.buyAmount
    if (Math.floor(amount) != amount) {
      Toast.show('购买数量只能是整数')
      return
    }
    let shopGoodDetail = this.props.goodInfo
    Actions.PAYMENT({
      title: '商家活动支付',
      price: shopGoodDetail.price * Number(amount),
      metadata: {
        'fromUser': this.props.currentUser,
        'toUser': this.props.shopDetail.owner.id,
        'dealType': BUY_GOODS
      },
      subject: '购买汇邻优店商品费用',
      paySuccessJumpScene: 'BUY_GOODS_OK',
      paySuccessJumpSceneParams: {},
      payErrorJumpBack: true,
    })
  }

  customTopView() {
    return (
      <ChatroomShopGoodCustiomTopView
        shopInfo={{shopName:this.props.goodInfo.goodsName,coverUrl:this.props.goodInfo.coverPhoto,price:this.props.goodInfo.price}}
      />
    )
  }

  // renderBannerColumn() {
  //
  //   if (this.props.imageList && this.props.imageList.length) {
  //     return (
  //       <View style={styles.advertisementModule}>
  //         <ViewPager2 dataSource={this.props.imageList}/>
  //       </View>
  //     )
  //   }
  // }

  render() {
    // console.log('value',this.props.value)
    return (
      <View style={styles.containerStyle}>
        {this.renderMainHeader()}
        <View style={styles.body}>
          <ScrollView
            contentContainerStyle={[styles.contentContainerStyle]}
            onScroll={e => this.handleOnScroll(e)}
            scrollEventThrottle={80}
          >
            {/*{(this.props.imageList&&this.props.imageList.length)?this.renderBannerColumn():null}*/}
            {this.props.goodInfo.album&&this.props.goodInfo.album.length?this.renderBannerColumn():null}
            {this.props.goodInfo.goodsName?<View style={styles.titleStyle}>
              <Text style={styles.titleTextStyle}>{this.props.goodInfo.goodsName}</Text>
            </View>:null}
            {this.props.goodInfo.detail ? <ArticleViewer artlcleContent={JSON.parse(this.props.goodInfo.detail)}/> : null}
          </ScrollView>
          {this.renderBottomView()}
        </View>
        {this.renderPaymentModal()}
        {this.renderImageModal()}

      </View>

    )
  }

}

const mapStateToProps = (state, ownProps) => {
  let shopDetail = selectShopDetail(state, ownProps.goodInfo.targetShop)
  const isUserLogined = authSelector.isUserLogined(state)
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  let shareDomain = configSelector.getShareDomain(state)

  let imageList = []
  if (ownProps.goodInfo.album && ownProps.goodInfo.album.length > 0)
    imageList = ownProps.goodInfo.album.map((item, key)=> {
      return (
      {
        action: "LOGIN",
        actionType: "action",
        image: item,
        title: ownProps.goodInfo.title,
        type: 0,
        key:key
      }
      )
    })

  return {
    imageList: imageList,
    shopDetail: shopDetail,
    isUserLogined: isUserLogined,
    currentUser: authSelector.activeUserId(state),
    userOwnedShopInfo: userOwnedShopInfo,
    shareDomain: shareDomain,

  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUsers,

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopGoodsDetail)


const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'

  },

  body: {
    // marginTop: normalizeH(64),
    flex: 1,
    // backgroundColor: '#E5E5E5',
    paddingBottom: 50,
    backgroundColor: '#fff'

  },
  topicLikesWrap: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  titleLine: {
    width: 3,
    backgroundColor: '#ff7819',
    marginRight: 5,
  },
  titleTxt: {
    color: '#FF7819',
    fontSize: em(15)
  },
  likeStyle: {
    flex: 1
  },
  zanStyle: {
    backgroundColor: THEME.colors.green,
    borderColor: 'transparent',
    height: normalizeH(35),
    alignSelf: 'center',
    borderRadius: 100,
    marginLeft: normalizeW(12),
    width: normalizeW(35),
  },
  zanAvatarStyle: {
    borderColor: 'transparent',
    height: normalizeH(35),
    alignSelf: 'center',
    borderRadius: 17.5,
    marginLeft: normalizeW(10),
    width: normalizeW(35),
  },
  zanTextStyle: {
    fontSize: em(17),
    color: "#ffffff",
    marginTop: normalizeH(7),
    alignSelf: 'center',
  },
  shopCommentWrap: {
    borderTopWidth: normalizeBorder(),
    borderTopColor: THEME.colors.lighterA,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    height: 50
  },
  vItem: {
    flex: 1,
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 3,
    paddingLeft: normalizeW(15)
  },
  vItemTxt: {
    marginTop: normalizeH(17),
    fontSize: em(17),
    color: '#FF7819'
  },
  bottomZanTxt: {
    color: '#ff7819'
  },
  shopCommentInputBox: {
    width: 64,
  },
  shopCommentInput: {
    fontSize: em(17),
    color: '#8f8e94'
  },
  contactedWrap: {
    width: normalizeW(110),
    backgroundColor: '#FF9D4E',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactedBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactedTxt: {
    color: 'white',
    fontSize: em(15),
    marginLeft: normalizeW(9)
  },
  commentBtnWrap: {
    width: 60,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center'
  },
  commentBtnBadge: {
    alignItems: 'center',
    width: 30,
    backgroundColor: '#f5a623',
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: 10,
    borderWidth: normalizeBorder(),
    borderColor: '#f5a623'
  },
  commentBtnBadgeTxt: {
    fontSize: em(9),
    color: '#fff'
  },
  shopUpWrap: {
    width: 60,
    alignItems: 'center'
  },
  moreBtnStyle: {
    width: normalizeW(40),
    height: normalizeH(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(15)
  },
  priceBox: {
    flex: 1,
  },
  priceTxt: {
    color: '#FF7819',
    fontSize: em(24),
    fontWeight: 'bold'
  },
  footerBtnBox: {
    height: normalizeH(49),
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FF9D4E',
    paddingTop: normalizeH(8),
    paddingLeft: normalizeW(25),
    paddingRight: normalizeW(25),
  },
  footerBtnTxt: {
    fontSize: em(10),
    color: 'white',
    marginTop: normalizeH(2)
  },
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: normalizeH(49),
    alignItems: 'center',
    paddingLeft: 15,
    borderTopWidth: normalizeBorder(),
    borderTopColor: THEME.colors.lighterA,
    backgroundColor: '#f5f5f5',

  },
  advertisementModule: {
    height: normalizeH(223),
    backgroundColor: '#fff', //必须加上,否则android机器无法显示banner
  },
  contentContainerStyle: {},
  shopHead: {
    flexDirection: 'row',
    padding: 12,
    height: 70,
    backgroundColor: '#fff',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  titleStyle:{
    flex:1,
    width:PAGE_WIDTH,
    alignItems:'flex-start',
    marginBottom:normalizeH(15),
    borderBottomWidth:normalizeH(1),
    borderBottomColor:'#F5F5F5',
  },
  titleTextStyle:{
    marginLeft:normalizeW(19),
    marginRight:normalizeW(19),
    marginTop:normalizeH(16),
    color:'#030303',
    fontSize:em(17),
    fontWeight: 'bold',
    marginBottom:normalizeH(15),

  }
})