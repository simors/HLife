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
  ListView,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import Avator from '../../common/Avatar'
import THEME from '../../../constants/themes/theme1'
import Popup from '@zzzkk2009/react-native-popup'
import CommonListView from '../../common/CommonListView'
import {LazyloadView} from '../../common/Lazyload'
import Svg from '../../common/Svgs'
import {selectVendorOrders} from '../../../selector/shopSelector'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../../util/ImageUtil'
import {ORDER_STATUS} from '../../../constants/appConfig'
import {fetchShopperOrders, modifyShopperOrderStatus} from '../../../action/shopAction'
import * as Toast from '../../../components/common/Toast'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopOrderListView extends Component {
  constructor(props) {
    super(props)
    this.lastTime = undefined
    this.isQuery = false
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.refreshData()
    })
  }

  setOrderStatus(vendorId, orderId, status) {
    let promption = "确定更新的订单？"
    if (ORDER_STATUS.ACCOMPLISH == status) {
      promption = "确定订单已发货吗？"
    } else if (ORDER_STATUS.DELETED == status) {
      promption = "确定要删除订单？"
    }
    Popup.confirm({
      title: '提示',
      content: promption,
      ok: {
        text: '确定',
        style: {color: THEME.base.mainColor},
        callback: ()=>{
          this.props.modifyShopperOrderStatus({
            vendorId,
            orderId,
            orderStatus: status,
            success: () => {
              Toast.show('订单状态更新成功！')
            },
            error: () => {
              Toast.show('订单状态更新失败！')
            }
          })
        }
      },
      cancel: {
        text: '取消',
        callback: ()=>{
          // console.log('cancel')
        }
      }
    })
  }

  refreshData() {
    this.lastTime = undefined
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    if (this.isQuery) {
      return
    }
    this.isQuery = true
    let payload = {
      more: !isRefresh,
      vendorId: this.props.vendorId,
      type: this.props.type,
      lastTime: this.lastTime,
      limit: 10,
      success: (isEmpty) => {
        this.isQuery = false
        if(!this.listView) {
          return
        }
        this.listView.isLoadUp(!isEmpty)
      },
      error: (err)=>{
        this.isQuery = false
      }
    }
    this.props.fetchShopperOrders(payload)
  }

  tipsText(order) {
    let orderStatus = order.orderStatus
    if (!order.receiver || order.receiver == "") {
      return '请联系买家取货'
    }
    if (orderStatus == ORDER_STATUS.PAID_FINISHED) {
      return '请及时发货'
    } else if (orderStatus == ORDER_STATUS.DELIVER_GOODS) {
      return '已发货，等待买家确认'
    } else if (orderStatus == ORDER_STATUS.ACCOMPLISH) {
      return '已完成'
    }
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
    let orderStatus = order.orderStatus
    if (!order.receiver || order.receiver == "") {
      return <View/>
    }
    if (orderStatus == ORDER_STATUS.PAID_FINISHED) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', padding: normalizeW(6)}}>
          {this.renderAddressView(order)}
        </View>
      )
    } else if (orderStatus == ORDER_STATUS.DELIVER_GOODS) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', padding: normalizeW(6)}}>
          {this.renderAddressView(order)}
        </View>
      )
    } else if (orderStatus == ORDER_STATUS.ACCOMPLISH) {
      return <View/>
    }
  }

  renderItemBottom(order) {
    let orderStatus = order.orderStatus
    if (orderStatus == ORDER_STATUS.PAID_FINISHED) {
      return (
        <View style={styles.itemBottomView}>
          <TouchableOpacity style={styles.btnStyle}
                            onPress={() => {this.setOrderStatus(order.vendorId, order.id, ORDER_STATUS.DELIVER_GOODS)}}>
            <Text style={styles.btnText}>已发货</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (orderStatus == ORDER_STATUS.DELIVER_GOODS) {
      return <View/>
    } else if (orderStatus == ORDER_STATUS.ACCOMPLISH) {
      return (
        <View style={styles.itemBottomView}>
          <TouchableOpacity style={[styles.btnStyle, {borderColor: '#000'}]}
                            onPress={() => {this.setOrderStatus(order.vendorId, order.id, ORDER_STATUS.DELETED)}}>
            <Text style={[styles.btnText, {color: '#000'}]}>删除订单</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderRow(rowData, rowId) {
    let userOrder = rowData
    let goods = userOrder.goods
    let vendor = userOrder.vendor
    let buyer = userOrder.buyer
    if (!goods || !vendor || !buyer) {
      return <View/>
    }
    this.lastTime = userOrder.createdAt
    return (
      <LazyloadView host="shopOrderList" style={styles.itemView} >
        <TouchableOpacity onPress={() => {Actions.SHOP_ORDER_DETAIL({orderId: userOrder.id})}}>
          <View style={styles.titleView} >
            <View style={styles.titleContent}>
              <View style={{paddingRight: normalizeW(4)}}>
                <Avator size={24} src={buyer.avatar} />
              </View>
              <Text style={styles.titleText}>{buyer.nickname}</Text>
            </View>
            <View style={{paddingRight: normalizeW(15)}}>
              <Text style={styles.titleTip}>{this.tipsText(userOrder)}</Text>
            </View>
          </View>
          {this.renderAddressShow(userOrder)}
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
              <Text style={{fontSize: em(15), color: THEME.base.mainColor}}>x {userOrder.goodsAmount}</Text>
              <Text style={{fontSize: em(12), color: '#000', paddingTop: normalizeH(11)}}>¥{userOrder.paid}</Text>
            </View>
          </View>
          <View style={styles.remarkView}>
            <Text style={{fontSize: em(14), color: '#4A4A4A'}}>备注信息：</Text>
            <Text style={{fontSize: em(14), color: '#4A4A4A'}}>{userOrder.remark}</Text>
          </View>
        </TouchableOpacity>
        {this.renderItemBottom(userOrder)}
      </LazyloadView>
    )
  }

  render() {
    return (
      <View>
        <CommonListView
          name="shopOrderList"
          contentContainerStyle={{backgroundColor: '#F5F5F5'}}
          dataSource={this.props.ds}
          renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
          loadNewData={()=> {
            this.refreshData()
          }}
          loadMoreData={()=> {
            this.loadMoreData(false)
          }}
          ref={(listView) => this.listView = listView}
        />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = undefined
  if (ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }

  let userOrders = selectVendorOrders(state, ownProps.vendorId, ownProps.type)
  return {
    ds: ds.cloneWithRows(userOrders),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopperOrders,
  modifyShopperOrderStatus,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopOrderListView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemView: {
    marginBottom: normalizeH(10),
    backgroundColor: '#FFF',
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
    justifyContent: 'flex-start',
    marginTop: normalizeH(6),
    marginBottom: normalizeH(5),
  },
  remarkView: {
    height: normalizeH(35),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: normalizeW(15),
    marginRight: normalizeW(15),
  },
  itemBottomView: {
    height: normalizeH(47),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: normalizeW(15),
    marginRight: normalizeW(15),
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  btnStyle: {
    width: normalizeW(100),
    height: normalizeH(32),
    borderWidth: 1,
    borderColor: THEME.base.mainColor,
    borderRadius: normalizeH(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: em(15),
    color: THEME.base.mainColor,
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
})