/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager,
  TextInput
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import * as authSelector from '../../selector/authSelector'
import {fetchShopPromotionDetail, fetchUserOwnedShopInfo} from '../../action/shopAction'
import {selectShopPromotionDetail} from '../../selector/shopSelector'
import ArticleViewer from '../common/Input/ArticleViewer'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import ChatroomShopPromotionCustomTopView from './ChatroomShopPromotionCustomTopView'
import {fetchUsers} from '../../action/authActions'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height



class ShopPromotionDetail extends Component {
  constructor(props) {
    super(props)
    // console.log('ShopPromotionDetail.props====', props)
    this.state = {

    }

  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      //this.props.fetchUserOwnedShopInfo()
      this.props.fetchShopPromotionDetail({id: this.props.id})
    })
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  customTopView() {
    return (
      <ChatroomShopPromotionCustomTopView
        shopPromotionInfo={this.props.shopPromotionDetail}
      />
    )
  }

  onIWantPress() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
    }else {
      let shopPromotionDetail = this.props.shopPromotionDetail
      let targetShop = shopPromotionDetail.targetShop

      this.props.fetchUsers({userIds: [targetShop.owner.id]})

      let payload = {
        name: targetShop.owner.nickname,
        members: [this.props.currentUser, targetShop.owner.id],
        conversationType: PERSONAL_CONVERSATION,
        title: targetShop.shopName,
        customTopView: this.customTopView()
        // title: targetShop.owner.nickname,
      }
      Actions.CHATROOM(payload)
    }
  }

  onShare = () => {
    let shareUrl = ""
    if (__DEV__) {
      shareUrl = shareUrl + "http://hlyd-dev.leanapp.cn/"
    } else {
      shareUrl = shareUrl + "http://hlyd-pro.leanapp.cn/"
    }
    shareUrl = shareUrl + "shopPromotionShare/" + this.props.id

    console.log("shopPromotionShare url:", shareUrl)

    Actions.SHARE({
      title: this.props.shopPromotionDetail.title,
      url: shareUrl,
      author: this.props.shopPromotionDetail.targetShop.shopName,
      abstract: this.props.shopPromotionDetail.abstract,
      cover: this.props.shopPromotionDetail.coverUrl,
    })
  }

  render() {
    let shopPromotionDetail = this.props.shopPromotionDetail
    let targetShop = shopPromotionDetail.targetShop

    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="活动详情"
          rightComponent={()=>{
            return (
              <TouchableOpacity onPress={this.onShare} style={{marginRight:10}}>
                <Image source={require('../../assets/images/active_share.png')}/>
              </TouchableOpacity>
            )
          }}
        />
        <View style={styles.body}>
          <ScrollView>
            <View style={styles.headerWrap}>
              <View style={styles.titleBox}>
                <Text style={styles.titleTxt}>{shopPromotionDetail.title}</Text>
              </View>
              <View style={styles.typeBox}>
                <View style={styles.typeInnerBox}>
                  <Text style={styles.typeTxt}>{shopPromotionDetail.type}</Text>
                </View>
                <View style={styles.typeDescBox}>
                  <Text numberOfLines={1} style={styles.typeDescTxt}>{shopPromotionDetail.typeDesc}</Text>
                </View>
                {false
                  ? <Text style={styles.pvTxt}>{shopPromotionDetail.pv}人看过</Text>
                  : null
                }
              </View>
            </View>
            <View style={styles.shopInfoWrap}>
              <Text numberOfLines={1} style={[styles.shopInfoTxt, styles.shopNameTxt, {maxWidth: PAGE_WIDTH/2}]}>{targetShop.shopName}</Text>
              <Text style={styles.shopInfoTxt}>{targetShop.distance + targetShop.distanceUnit}</Text>
              <View style={styles.shopBtnContainer}>
                <TouchableOpacity style={styles.shopBtnBox} onPress={()=>{Actions.SHOP_DETAIL({id: targetShop.id})}}>
                  <Text style={styles.shopBtnTxt}>进入店铺</Text>
                  <Image source={require('../../assets/images/arrow_right.png')}/>
                </TouchableOpacity>
              </View>
            </View>
            {shopPromotionDetail.promotionDetailInfo &&
              <ArticleViewer artlcleContent={JSON.parse(shopPromotionDetail.promotionDetailInfo)} />
            }
          </ScrollView>
          <View style={styles.footerWrap}>
            <View style={styles.priceBox}>
              <Text style={styles.priceTxt}>￥{shopPromotionDetail.promotingPrice}</Text>
            </View>
            <TouchableOpacity style={styles.footerBtnBox} onPress={()=>{this.onIWantPress()}}>
              <Image source={require('../../assets/images/contacted.png')}/>
              <Text style={styles.footerBtnTxt}>我想要</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const shopPromotionDetail = selectShopPromotionDetail(state, ownProps.id)
  // console.log('shopPromotionDetail=====>>>>>', shopPromotionDetail)
  const isUserLogined = authSelector.isUserLogined(state)

  return {
    shopPromotionDetail: shopPromotionDetail,
    isUserLogined: isUserLogined,
    currentUser: authSelector.activeUserId(state),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopPromotionDetail,
  fetchUserOwnedShopInfo,
  fetchUsers
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopPromotionDetail)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    backgroundColor: '#fafafa'
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
    flexDirection: 'row',
    backgroundColor: '#FF9D4E',
    padding: 15,
    paddingLeft: 35,
    paddingRight: 35,
  },
  footerBtnTxt: {
    fontSize: em(15),
    color: 'white',
    marginLeft: 8
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    backgroundColor: 'white',
    paddingBottom:50
  },
  headerWrap: {
    padding: 15
  },
  titleBox: {
    marginBottom: 15
  },
  titleTxt: {
    color: '#5a5a5a',
    fontSize: em(17),
    lineHeight: em(24),
    fontWeight: 'bold'
  },
  typeBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeInnerBox: {
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#F6A623',
    marginRight: 8,
    borderRadius: 2
  },
  typeTxt: {
    color: 'white',
    fontSize: em(15),
    fontWeight: 'bold'
  },
  typeDescBox: {
    flex: 1,
  },
  typeDescTxt: {
    color: '#5a5a5a',
    fontSize: em(15),
  },
  pvTxt: {
    color: '#aaa',
    fontSize: em(12),
  },
  shopInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: normalizeBorder(),
    borderTopColor: '#f5f5f5',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#f5f5f5',
  },
  shopInfoTxt: {
    color: '#5a5a5a',
    fontSize: em(12),
  },
  shopNameTxt: {
    marginLeft: 15,
    marginRight: 15,
  },
  shopBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  shopBtnBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  shopBtnTxt: {
    color: '#FF7819',
    fontSize: em(15),
    marginRight: 8
  }

})