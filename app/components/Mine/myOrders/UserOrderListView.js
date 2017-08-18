/**
 * Created by yangyang on 2017/8/18.
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
import THEME from '../../../constants/themes/theme1'
import CommonListView from '../../common/CommonListView'
import {LazyloadView} from '../../common/Lazyload'
import {selectUserOrders} from '../../../selector/shopSelector'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../../util/ImageUtil'
import {ORDER_STATUS} from '../../../constants/appConfig'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class UserOrderListView extends Component {
  constructor(props) {
    super(props)
  }

  refreshData() {

  }

  loadMoreData(more) {

  }

  tipsText(orderStatus) {
    if (orderStatus == ORDER_STATUS.PAID_FINISHED) {
      return '等待卖家发货'
    } else if (orderStatus == ORDER_STATUS.DELIVER_GOODS) {
      return '已发货'
    } else if (orderStatus == ORDER_STATUS.ACCOMPLISH) {
      return '已完成'
    }
  }

  getItemHeight(orderStatus) {
    if (orderStatus == ORDER_STATUS.PAID_FINISHED) {
      return normalizeH(181)
    } else if (orderStatus == ORDER_STATUS.DELIVER_GOODS) {
      return normalizeH(218)
    } else if (orderStatus == ORDER_STATUS.ACCOMPLISH) {
      return normalizeH(218)
    }
  }

  renderItemBottom(orderStatus) {
    if (orderStatus == ORDER_STATUS.PAID_FINISHED) {
      return (
        <View style={{height: normalizeH(12)}}></View>
      )
    } else if (orderStatus == ORDER_STATUS.DELIVER_GOODS) {
      return (
        <View style={styles.itemBottomView}>
          <TouchableOpacity style={styles.btnStyle} onPress={() => {}}>
            <Text style={styles.btnText}>确认收货</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (orderStatus == ORDER_STATUS.ACCOMPLISH) {
      return (
        <View style={styles.itemBottomView}>
          <TouchableOpacity style={[styles.btnStyle, {marginRight: normalizeW(5), borderColor: '#000'}]} onPress={() => {}}>
            <Text style={[styles.btnText, {color: '#000'}]}>删除订单</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnStyle} onPress={() => {}}>
            <Text style={styles.btnText}>评价</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderRow(rowData, rowId) {
    let userOrder = rowData
    let goods = userOrder.goods
    let vendor = userOrder.vendor
    if (!goods || !vendor) {
      return <View/>
    }
    console.log('userOrder', userOrder)
    return (
      <LazyloadView host="userOrderList" style={[styles.itemView, {height: this.getItemHeight(userOrder.orderStatus)}]} >
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.titleView} >
            <View style={styles.titleContent}>
              <Text style={styles.titleText}>{vendor.shopName}</Text>
            </View>
            <View style={{paddingRight: normalizeW(15)}}>
              <Text style={styles.titleTip}>{this.tipsText(userOrder.orderStatus)}</Text>
            </View>
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
                <Text style={{fontSize: em(12), color: 'rgba(0,0,0,0.3)'}}>X {userOrder.goodsAmount}</Text>
              </View>
            </View>
          </View>
          <View style={styles.paidView}>
            <Text style={{fontSize: em(14), color: '#4A4A4A'}}>共{userOrder.goodsAmount}件商品  实付款：</Text>
            <Text style={{fontSize: em(17), color: '#000'}}>¥{userOrder.paid}</Text>
          </View>
        </TouchableOpacity>
        {this.renderItemBottom(userOrder.orderStatus)}
      </LazyloadView>
    )
  }

  render() {
    return (
      <View>
        <CommonListView
          name="userOrderList"
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

  let userOrders = selectUserOrders(state, ownProps.buyerId, ownProps.type)
  return {
    ds: ds.cloneWithRows(userOrders),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UserOrderListView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemView: {
    marginBottom: normalizeH(10),
    height: normalizeH(169),
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
  paidView: {
    height: normalizeH(33),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: normalizeW(15),
    marginRight: normalizeW(15),
    // borderBottomWidth: 1,
    // borderColor: 'rgba(0,0,0,0.05)'
  },
  itemBottomView: {
    flex: 1,
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
    fontSize: em(17),
    color: THEME.base.mainColor,
  },
})