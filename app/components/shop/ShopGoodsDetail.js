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
  Animated,
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import ViewPager from '../common/ViewPager'
import Gallery from 'react-native-gallery'

import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import ChatroomShopGoodCustiomTopView from './ChatroomShopGoodCustiomTopView'
import {fetchUsers} from '../../action/authActions'
import {fetchShopDetail} from '../../action/shopAction'

import * as AVUtils from '../../util/AVUtils'
import {
  selectUserOwnedShopInfo,
  selectShopDetail,
} from '../../selector/shopSelector'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as configSelector from '../../selector/configSelector'
import GoodAlbumShow from './GoodAlbumShow'
import * as authSelector from '../../selector/authSelector'
import * as Toast from '../common/Toast'
import {DEFAULT_SHARE_DOMAIN} from '../../util/global'
import {CachedImage} from "react-native-img-cache"
import ArticleViewer from '../common/Input/ArticleViewer'
import {BUY_GOODS} from '../../constants/appConfig'
import {LazyloadScrollView} from '../common/Lazyload'
import Svg from '../common/Svgs'
import Icon from 'react-native-vector-icons/Ionicons'


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
      height: 0,
      page: 1
    }
    this.images = []

  }

  componentDidMount() {
    this.props.goodInfo.album.map((item) => {
        this.images.push(item)
      this.props.fetchShopDetail({
        id: this.props.goodInfo.targetShop,
        success: () => {
          this.isFetchingShopDetail = false
        },
        error: () => {
          this.isFetchingShopDetail = false
        }
      })
    })
  }

  onShare = () => {
    let shareUrl = this.props.shareDomain ? this.props.shareDomain + "goodShare/" + this.props.goodInfo.id + '?userId=' + this.props.currentUser:
    DEFAULT_SHARE_DOMAIN + "goodShare/" + this.props.goodInfo.id + '?userId=' + this.props.currentUser

    Actions.SHARE({
      title: this.props.goodInfo.goodsName || "汇邻优店",
      url: shareUrl,
      author: this.props.shopDetail.shopName || "邻家小二",
      abstract: this.props.shopDetail.shopAddress || "未知地址",
      cover: this.props.goodInfo.coverPhoto || '',
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
        height: normalizeH(64),
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
          rightComponent={()=> {
            return (
              <TouchableOpacity onPress={this.onShare} style={{marginRight: 10}}>
                <Image source={require('../../assets/images/active_share.png')}/>
              </TouchableOpacity>
            )
          }}
        />
      </Animated.View>
    )
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

  renderShopLeftHeader() {
    return (
      <View style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        opacity: 30,
        position: 'absolute',
        top: normalizeH(24),
        left: normalizeW(9),
        flex: 1,
        borderRadius: normalizeH(18)
      }}
      >
        <TouchableOpacity onPress={() => {
          AVUtils.pop({
            backSceneName: this.props.backSceneName,
            backSceneParams: this.props.backSceneParams
          })
        }} style={{
          paddingTop: normalizeH(3),
          borderRadius: normalizeH(18),
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          width: normalizeW(36),
          height: normalizeH(36),
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Icon name="ios-arrow-back" style={{fontSize: em(28), color: '#FAFAFA'}}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderShopMiddleHeader() {
    return (
      <View style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        opacity: 30,
        position: 'absolute',
        top: normalizeH(24),
        left: normalizeW(160),
        flex: 1,
        borderRadius: normalizeH(18),
        width: normalizeW(60),
        height: normalizeH(28),

      }}
      >
        <View style={{
          borderRadius: normalizeH(14),
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          width: normalizeW(60),
          height: normalizeH(28),
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{fontSize:em(15),color:'#FFFFFF'}}>{this.state.page+'/'+this.props.goodInfo.album.length}</Text>
       </View>
      </View>
    )
  }

  renderShopRightHeader() {
    return (
      <View style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        opacity: 30,
        position: 'absolute',
        top: normalizeH(24),
        left: normalizeW(330),
        flex: 1,
        borderRadius: normalizeH(18),
        width: normalizeW(36),
        height: normalizeH(36)
      }}
      >
        <TouchableOpacity onPress={this.onShare} style={{
          borderRadius: normalizeH(18),
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          width: normalizeW(36),
          height: normalizeH(36),
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Icon name="md-more" style={{fontSize: em(28), color: '#FAFAFA'}}/>
        </TouchableOpacity>
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
            onChangePage={(value)=>{this.setState({page: value+1})}}
          />
          {this.state.height < 10 ? this.renderShopLeftHeader() : null}
          {this.state.height < 10 ? this.renderShopMiddleHeader() : null}
          {this.state.height < 10 ? this.renderShopRightHeader() : null}
        </View>
      )
    }else if(this.props.goodInfo.album && this.props.goodInfo.album.length==1){
      return(
        <TouchableWithoutFeedback
          onPress={() => this.toggleModal(!this.state.imgModalShow, this.props.goodInfo.album[0])}
        >
          <View       style={{flex: 1}}
          >
          <CachedImage
            mutable
            style={[{width: PAGE_WIDTH, height: normalizeH(264)}]}
            resizeMode="stretch"
            source={typeof(this.props.goodInfo.album[0]) == 'string' ? {uri: this.props.goodInfo.album[0]} : this.props.goodInfo.album[0]}
          />
          {this.state.height < 10 ? this.renderShopLeftHeader() : null}
          {this.state.height < 10 ? this.renderShopRightHeader() : null}
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }

  _renderPage(data: Object, pageID) {
    // console.log('_renderPage.data====', data)
    // console.log('pageId=============>',pageID)
    return (
      <View style={{flex:1}}>
        {data}
      </View>
    )
  }

  handleOnScroll(e) {
    let offset = e.nativeEvent.contentOffset.y
    let comHeight = normalizeH(200)
    this.setState({
      height: offset
    })
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
        <TouchableOpacity style={styles.footerBtnBox}
                          onPress={()=> {Actions.BUY_GOODS({
                            goods: this.props.goodInfo,
                            shopOwner: this.props.shopDetail.owner.id,
                            shopId: this.props.shopDetail.id,
                            shopName: this.props.shopDetail.shopName,
                          })}}>
          <Svg size={normalizeW(32)} icon="purchase_24" />
          <Text style={styles.footerBtnTxt}>立即购买</Text>
        </TouchableOpacity>
      </View>
    )
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

  renderGoToShop(){
    let distance = this.props.shopDetail.distance
    let distanceTitle = '米'
    if(distance>0){
      if(distance>1000){
        distance = Number(distance).toFixed(1)
        distanceTitle='公里'
      }
    }
    return(
      <TouchableOpacity onPress={()=>{Actions.SHOP_DETAIL({id:this.props.shopDetail.id})}}>
      <View style={styles.shopWrap}>
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>{this.props.shopDetail.shopName}</Text>
          <Text style={styles.shopLocation}>{distance+distanceTitle}</Text>
        </View>

        <View style={styles.shopAction}>
          <Text style={styles.shopActionText}>进入店铺</Text>
          <View style={styles.shopActionSvg}>
            <Svg icon="arrow_right" size={normalizeW(32)} style={{}} />
          </View>
        </View>
      </View>
        </TouchableOpacity>
    )
  }

  renderPromotion(){
    return(
      <View style={styles.promotionWrap}>
        <View style={styles.promotionTitle}>
          <Text style={styles.promotionTitleText}>{this.props.goodInfo.promotionType}</Text>
        </View>
        <View style={styles.promotionAbstract}>
          <Text style={styles.promotionAbstractText} numberOfLines={1}>{this.props.goodInfo.promotionAbstract}</Text>
        </View>
      </View>
    )
  }

  renderPriceTitle(){
    console.log('this.props.goodInfo',this.props.goodInfo)
    if(this.props.goodInfo.promotionPrice&&this.props.goodInfo.promotionType){
      return(
        <View style={styles.priceWrap}>
          <View style={styles.priceTitleBox}>
            <Text style={styles.priceTitleText}>{'¥' + this.props.goodInfo.promotionPrice}</Text>
          </View>
          <View style={styles.priceOriginBox}>
            <Text style={styles.priceOriginText}>{this.props.goodInfo.originalPrice}</Text>
          </View>
          <Text style={styles.pricePromotionText}>{this.props.goodInfo.promotionType}</Text>

          <View style={styles.pricePromotionBox}>
          </View>
        </View>
      )
    }else{
      return(
        <View style={styles.priceWrap}>
          <View style={styles.priceTitleBox}>
            <Text style={styles.priceTitleText}>{'¥'+this.props.goodInfo.price}</Text>
          </View>
          <View style={styles.priceOriginBox}>
            <Text style={styles.priceOriginText}>{this.props.goodInfo.originalPrice}</Text>
          </View>
        </View>
      )

    }
  }


  render() {
    let lazyHost = "goodsDetail"+this.props.goodInfo.id
    return (
      <View style={styles.containerStyle}>
        {this.renderMainHeader()}
        <View style={styles.body}>
          <LazyloadScrollView
            name={lazyHost}
            contentContainerStyle={[styles.contentContainerStyle]}
            onScroll={e => this.handleOnScroll(e)}
            scrollEventThrottle={80}
          >
            {/*{(this.props.imageList&&this.props.imageList.length)?this.renderBannerColumn():null}*/}
            {this.props.goodInfo.album&&this.props.goodInfo.album.length?this.renderBannerColumn():null}
            {this.renderPriceTitle()}
            {this.props.goodInfo.goodsName?<View style={styles.titleStyle}>
              <Text style={styles.titleTextStyle}>{this.props.goodInfo.goodsName}</Text>
            </View>:null}
            {this.props.goodInfo.promotionType?this.renderPromotion():null}
            {this.renderGoToShop()}
            {this.props.goodInfo.detail ? <ArticleViewer lazyHost={lazyHost} artlcleContent={JSON.parse(this.props.goodInfo.detail)}/> : null}
          </LazyloadScrollView>
          {this.renderBottomView()}
        </View>
        {this.renderImageModal()}

      </View>

    )
  }

}

const mapStateToProps = (state, ownProps) => {
  console.log('targetShop=======>',ownProps.goodInfo.targetShop)
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
  fetchShopDetail
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
    width: normalizeW(135),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF7819',
  },
  footerBtnTxt: {
    fontSize: em(15),
    color: 'white',
  },
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: normalizeH(49),
    alignItems: 'center',
    paddingLeft: normalizeW(15),
    borderTopWidth: normalizeBorder(),
    borderTopColor: THEME.colors.lighterA,
    backgroundColor: '#f5f5f5',

  },
  advertisementModule: {
    height: normalizeH(264),
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
    borderBottomWidth:normalizeH(1),
    borderBottomColor:'#F5F5F5',
  },
  titleTextStyle:{
    marginLeft:normalizeW(19),
    marginRight:normalizeW(19),
    marginTop:normalizeH(10),
    color:'#030303',
    fontSize:em(17),
    fontWeight: 'bold',
    marginBottom:normalizeH(10),
  },
  shopWrap:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth:normalizeBorder(1),
    borderTopColor:'#F5F5F5',
    borderBottomWidth:normalizeBorder(1),
    borderBottomColor:'#F5F5F5',
  },
  shopInfo:{
    marginTop: normalizeH(8),
    marginBottom: normalizeH(8),
    marginLeft: normalizeW(15),
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shopName:{
    color: '#8F8E94',
    fontSize: em(12),
  },
  shopLocation:{
    color: '#8F8E94',
    fontSize: em(12),
    marginLeft: normalizeW(15),
  },
  shopAction:{
    // flex:1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shopActionText:{
    marginTop: normalizeH(7),
    marginBottom: normalizeH(7),
    marginLeft: normalizeW(15),
    fontSize: em(15),
    color: '#FF7819'
  },
  shopActionSvg:{
    // flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft:normalizeW(10),
    // paddingTop: normalizeH(10),
    height:normalizeH(32),
    width:normalizeW(32)
  },
  promotionWrap:{
    flexDirection: 'row',
    alignItems:'center',
    paddingTop:normalizeH(10),
    paddingBottom: normalizeH(10)
  },
  promotionTitle:{
    marginLeft:normalizeW(15),
    height:normalizeH(22),
    width:normalizeW(70),
    backgroundColor:'#FF7819',
    borderBottomRightRadius:normalizeH(6),
    borderTopLeftRadius:normalizeH(6),
    justifyContent:'center',
    alignItems:'center'
  },
  promotionTitleText:{
    fontSize:em(15),
    color:'#FFFFFF',
  },
  promotionAbstract:{
    marginLeft:normalizeW(15),

  },
  promotionAbstractText:{
    color:'rgba(0,0,0,0.50)',
    fontSize:em(15),
  },
  priceWrap:{
    width:PAGE_WIDTH,
    backgroundColor:'#FF9d4e',
    height:normalizeH(55),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceTitleBox:{
    marginLeft:normalizeH(15),
  },
  priceTitleText:{
    color: '#FFFFFF',
    fontSize: em(40),
  },
  priceOriginBox:{
    marginLeft:normalizeH(15),
  },
  priceOriginText:{
    color:'rgba(255,255,255,0.70)',
    fontSize:em(20),
    marginTop: normalizeH(15),
    textDecorationLine:'line-through'
  },
  pricePromotionBox:{
    right:0,
    top:0,
    width:normalizeW(125),
    // height:normalizeH(55),
    borderBottomWidth:normalizeW(55),
    borderBottomColor:'#F3f800',
    borderLeftWidth:normalizeH(23),
    borderLeftColor:'transparent',
    backgroundColor: '#FF9d4e',
    position:'absolute'
  },
  pricePromotionText:{
    fontSize: em(18),
    color:'#FF7819',
    position:'absolute',
    zIndex: 10,
    left: normalizeW(285),
    top: normalizeH(20),
    backgroundColor: '#F3f800',
  }
})