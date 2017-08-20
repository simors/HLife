/**
 * Created by yangyang on 2017/8/19.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import Svg from '../../common/Svgs'
import Header from '../../common/Header'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../../util/ImageUtil'
import {selectOrderDetail} from '../../../selector/shopSelector'
import {activeUserId} from '../../../selector/authSelector'
import {PERSONAL_CONVERSATION} from '../../../constants/messageActionTypes'
import {fetchUsers} from '../../../action/authActions'
import {formatLeancloudTime} from '../../../util/numberUtils'
import {ORDER_STATUS} from '../../../constants/appConfig'

class UserOrderDetail extends Component {
  constructor(props) {
    super(props)
  }

  contactVendor(vendor) {
    this.props.fetchUsers({userIds: [vendor.id]})

    let payload = {
      name: vendor.shopName,
      members: [this.props.currentUserId, vendor.id],
      conversationType: PERSONAL_CONVERSATION,
      title: vendor.shopName,
    }
    Actions.CHATROOM(payload)
  }

  renderAddressView() {
    let order = this.props.orderDetail
    if (!order) {
      return <View/>
    }
    if (!order.receiver || order.receiver == "") {
      return <View/>
    }
    return (
      <View style={styles.addressView}>
        <View style={{paddingRight: normalizeW(11)}}>
          <Svg size={24} icon="location"/>
        </View>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: normalizeH(8)}}>
            <Text style={[styles.addrText, {paddingRight: normalizeW(10)}]}>{order.receiver}</Text>
            <Text style={styles.addrText}>{order.receiverPhone}</Text>
          </View>
          <View>
            <Text style={[styles.addrText, {fontSize: em(12)}]}>{order.receiverAddr}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderTipsView(order) {
    let orderStatus = order.orderStatus
    if (!order.receiver || order.receiver == "") {
      return <Text style={styles.headerTipText}>请及时与卖家沟通取货</Text>
    }
    if (orderStatus == ORDER_STATUS.PAID_FINISHED) {
      return <Text style={styles.headerTipText}>等待卖家发货</Text>
    } else if (orderStatus == ORDER_STATUS.DELIVER_GOODS) {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Svg size={32} icon="right_green"/>
          <Text style={[styles.headerTipText, {color: '#04D800', paddingLeft: normalizeW(5)}]}>已发货</Text>
        </View>
      )
    } else if (orderStatus == ORDER_STATUS.ACCOMPLISH) {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Svg size={32} icon="right_green"/>
          <Text style={[styles.headerTipText, {color: '#04D800',paddingLeft: normalizeW(5)}]}>交易成功</Text>
        </View>
      )
    }
  }

  render() {
    let order = this.props.orderDetail
    let goods = order.goods
    let vendor = order.vendor
    if (!order || !goods || !vendor) {
      return <View/>
    }
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="订单详情"
        />
        <View style={styles.body}>
          <View>
            <Image style={styles.headerTipView} source={require('../../../assets/images/bg_order.png')}>
              {this.renderTipsView(order)}
            </Image>
          </View>
          {this.renderAddressView()}
          <View style={{backgroundColor: '#FFF'}}>
            <View style={styles.titleView} >
              <View style={styles.titleContent}>
                <View style={{paddingRight: normalizeW(4)}}>
                  <Svg size={24} icon="shop_invite"/>
                </View>
                <Text style={styles.titleText}>{vendor.shopName}</Text>
              </View>
              <TouchableOpacity onPress={() => this.contactVendor(vendor)}
                style={{flexDirection: 'row', alignItems: 'center', paddingRight: normalizeW(15)}}>
                <Svg color={THEME.base.mainColor} size={24} icon="service"/>
                <Text style={[styles.titleTip, {paddingLeft: normalizeW(3)}]}>联系卖家</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.goodsView}>
              <View style={{paddingRight: normalizeW(11)}}>
                <CachedImage mutable
                             style={[{width: normalizeW(80),height: normalizeH(80)}]}
                             source={{uri: getThumbUrl(goods.coverPhoto, normalizeW(80), normalizeH(80))}} />
              </View>
              <View style={{flex: 1, paddingTop: normalizeH(6)}}>
                <Text style={styles.goodsNameText} numberOfLines={2}>{goods.goodsName}</Text>
                <View style={styles.priceView}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: em(15), color: '#000', paddingRight: normalizeW(10)}}>¥{goods.price}</Text>
                    <Text style={{fontSize: em(12), color: 'rgba(0,0,0,0.3)', textDecorationLine: 'line-through'}}>¥{goods.originalPrice}</Text>
                  </View>
                  <Text style={{fontSize: em(12), color: 'rgba(0,0,0,0.3)'}}>X {order.goodsAmount}</Text>
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', height: normalizeH(43), paddingLeft: normalizeW(15)}}>
              <Text style={styles.commonText}>下单时间：</Text>
              <Text style={styles.commonText}>{formatLeancloudTime(new Date(order.createdAt))}</Text>
            </View>
          </View>
          <View style={styles.abbView}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: normalizeH(8)}}>
              <Text style={styles.commonText}>商品总额</Text>
              <Text style={[styles.commonText, {fontSize: em(17)}]}>¥{order.paid}</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', marginBottom: normalizeH(8)}}>
              <Text style={styles.commonText}>备注信息：{order.remark}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUserId = activeUserId(state)
  let orderDetail = selectOrderDetail(state, ownProps.orderId)
  return {
    currentUserId,
    orderDetail,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUsers,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UserOrderDetail)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  body: {
    marginTop: normalizeH(64),
  },
  headerTipView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTipText: {
    fontSize: em(20),
    fontWeight: 'bold',
    color: '#D0011B',
  },
  addressView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalizeH(69),
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    backgroundColor: '#FFF',
    marginBottom: normalizeH(10),
  },
  addrText: {
    fontSize: em(15),
    color: 'rgba(0,0,0,0.8)',
    // opacity: 0.6
  },
  titleView: {
    height: normalizeH(36),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: normalizeW(15),
  },
  titleText: {
    fontSize: em(12),
    color: 'rgba(0,0,0,0.8)'
  },
  titleTip: {
    fontSize: em(12),
    color: THEME.base.mainColor,
  },
  goodsView: {
    height: normalizeH(100),
    backgroundColor: 'rgba(0,0,0,0.03)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
  },
  goodsNameText: {
    fontSize: em(15),
    color: '#000',
    lineHeight: 25,
  },
  priceView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalizeH(10),
    marginBottom: normalizeH(5),
  },
  commonText: {
    fontSize: em(14),
    color: '#4A4A4A',
  },
  abbView: {
    justifyContent: 'center',
    height: normalizeH(72),
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    marginTop: normalizeH(10),
    backgroundColor: '#FFF',
  },
})