/**
 * Created by yangyang on 2017/8/20.
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
import Avator from '../../common/Avatar'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../../util/ImageUtil'
import {selectOrderDetail} from '../../../selector/shopSelector'
import {activeUserId} from '../../../selector/authSelector'
import {fetchUsers} from '../../../action/authActions'
import {formatLeancloudTime} from '../../../util/numberUtils'
import {ORDER_STATUS} from '../../../constants/appConfig'

class ShopOrderDetail extends Component {
  constructor(props) {
    super(props)
  }

  renderAddressView(order) {
    return (
      <View style={styles.addrView}>
        <View style={{height: normalizeH(35), flexDirection: 'row', alignItems: 'center', marginLeft: normalizeW(15), marginRight: normalizeW(15)}}>
          <Text style={[styles.addrText, {paddingRight: normalizeW(15)}]}>{order.receiver}</Text>
          <Text style={styles.addrText}>{order.receiverPhone}</Text>
        </View>
        <View style={{flex: 1, paddingTop: normalizeH(8), marginLeft: normalizeW(15), marginRight: normalizeW(15), borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.05)'}}>
          <Text style={styles.addrText}>{order.receiverAddr}</Text>
        </View>
      </View>
    )
  }

  renderAddressShow(order) {
    if (!order.receiver || order.receiver == "") {
      return <View/>
    }
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', padding: normalizeW(6), backgroundColor: '#FFF',}}>
        {this.renderAddressView(order)}
      </View>
    )
  }

  renderTipsView(order) {
    let orderStatus = order.orderStatus
    if (!order.receiver || order.receiver == "") {
      return <Text style={styles.headerTipText}>请联系买家取货</Text>
    }
    if (orderStatus == ORDER_STATUS.PAID_FINISHED) {
      return <Text style={styles.headerTipText}>请及时发货</Text>
    } else if (orderStatus == ORDER_STATUS.DELIVER_GOODS) {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Svg size={32} icon="right_green"/>
          <Text style={[styles.headerTipText, {color: '#04D800', paddingLeft: normalizeW(5)}]}>已发货，等待买家确认</Text>
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
    let buyer = order.buyer
    if (!order || !goods || !vendor || !buyer) {
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
          <View style={styles.titleView} >
            <View style={styles.titleContent}>
              <View style={{paddingRight: normalizeW(4)}}>
                <Avator size={24} src={buyer.avatar} />
              </View>
              <Text style={styles.titleText}>{buyer.nickname}</Text>
            </View>
          </View>
          {this.renderAddressShow(order)}
          <View style={styles.goodsView}>
            <View style={{paddingRight: normalizeW(11)}}>
              <CachedImage mutable
                           style={[{width: normalizeW(50),height: normalizeH(50)}]}
                           source={{uri: getThumbUrl(goods.coverPhoto, normalizeW(50), normalizeH(50))}} />
            </View>
            <View style={{flex: 1, paddingTop: normalizeH(4), paddingRight: normalizeW(6)}}>
              <Text style={styles.goodsNameText} numberOfLines={2}>{goods.goodsName}</Text>
              <View style={styles.priceView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: em(15), color: '#000', paddingRight: normalizeW(10)}}>¥{goods.price}</Text>
                  <Text style={{fontSize: em(12), color: 'rgba(0,0,0,0.3)', textDecorationLine: 'line-through'}}>¥{goods.originalPrice}</Text>
                </View>
              </View>
            </View>
            <View style={styles.paidView}>
              <Text style={{fontSize: em(15), color: THEME.base.mainColor}}>x {order.goodsAmount}</Text>
              <Text style={{fontSize: em(12), color: '#000', paddingTop: normalizeH(11)}}>¥{order.paid}</Text>
            </View>
          </View>
          <View style={styles.remarkView}>
            <Text style={{fontSize: em(14), color: '#4A4A4A'}}>备注信息：</Text>
            <Text style={{fontSize: em(14), color: '#4A4A4A'}}>{order.remark}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', height: normalizeH(43), paddingLeft: normalizeW(15), backgroundColor: '#FFF',}}>
            <Text style={styles.commonText}>下单时间：</Text>
            <Text style={styles.commonText}>{formatLeancloudTime(new Date(order.createdAt))}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopOrderDetail)

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
  addrText: {
    fontSize: em(15),
    color: 'rgba(0,0,0,0.8)',
    // opacity: 0.6
  },
  titleView: {
    height: normalizeH(36),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFF',
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
    height: normalizeH(64),
    backgroundColor: 'rgba(0,0,0,0.03)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
  },
  goodsNameText: {
    fontSize: em(12),
    color: '#7B7B7B',
    lineHeight: 16,
  },
  priceView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalizeH(10),
    marginBottom: normalizeH(5),
  },
  addrView: {
    width: normalizeW(345),
    height: normalizeH(85),
    borderWidth: 1,
    borderRadius: normalizeW(5),
    borderColor: '#E2E2E2',
  },
  addrText: {
    fontSize: em(14),
    color: '#000',
    opacity: 0.8
  },
  paidView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: normalizeW(90),
    height: normalizeH(52),
    borderLeftWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  remarkView: {
    height: normalizeH(35),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    borderBottomWidth: 1,
    borderColor: '#E2E2E2',
    backgroundColor: '#FFF',
  },
  commonText: {
    fontSize: em(14),
    color: '#4A4A4A',
  },
})