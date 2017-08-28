/**
 * Created by yangyang on 2017/3/7.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  InteractionManager,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import shallowequal from 'shallowequal'
import {LazyloadView} from '../common/Lazyload'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../util/ImageUtil'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class NearbySalesView extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props.shopPromotionList, nextProps.shopPromotionList)) {
      return true
    }
    if (!shallowequal(this.state, nextState)) {
      return true
    }
    return false
  }

  renderSaleItems() {


    let promotionsView = <View />
    if(this.props.shopPromotionList && this.props.shopPromotionList.length) {
      promotionsView = this.props.shopPromotionList.map((item, index)=>{
        console.log('item123123123123',item)
        let goodInfo = {
          id: item.goodId,
          targetShop: item.shopId,
          goodsName: item.goodName,
          price: item.price,
          originalPrice: item.originalPrice,
          promotionPrice: item.promotionPrice,
          coverPhoto: item.coverPhoto,
          album: item.album,
          status: item.goodStatus,
          detail: item.detail,
          promotion: item.id,
          updatedAt: item.goodUpdatedAt,
          promotionType: item.type,
          promotionAbstract: item.abstract
        }
        // console.log('startDate====>',new Date(item.startDate))

        return (
          <TouchableOpacity key={'promotion_' + index} style={{flex: 1}} onPress={() => {Actions.SHOP_GOODS_DETAIL({goodInfo:goodInfo})}}>
            <LazyloadView host="homeList" style={styles.saleItemView}>
              <View style={styles.saleImg}>
                <CachedImage mutable style={{flex: 1}}
                       source={{uri: getThumbUrl(item.coverPhoto, normalizeW(100), normalizeW(100))}}/>
              </View>
              <View style={styles.saleContent}>
                <View>
                  <Text style={styles.itemTitle} numberOfLines={1}>{item.goodName}</Text>
                </View>
                <View style={styles.addressTextView}>
                  <View style={{flexDirection: 'row', width: normalizeW(180)}}>
                    <Text style={[styles.itemText, {maxWidth: normalizeW(150)}]} numberOfLines={1}>{item.shopName}</Text>
                  </View>
                  <View>
                    <Text style={styles.itemText}>{item.distance + item.distanceUnit}</Text>
                  </View>
                </View>
                <View style={styles.saleAbstract}>
                  <View style={styles.saleLabel}>
                    <Text style={styles.saleLabelText}>{item.type}</Text>
                  </View>
                  <View style={{marginLeft: normalizeW(10)}}>
                    <Text style={styles.itemText} numberOfLines={1}>{item.typeDesc}</Text>
                  </View>
                </View>
                <View style={styles.priceView}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.priceText}>¥</Text>
                    <Text style={[styles.priceText, {marginLeft: normalizeW(5)}]}>{item.promotionPrice}</Text>
                    {item.originalPrice
                      ? <Text style={[styles.itemText, {marginLeft: normalizeW(5), textDecorationLine: 'line-through'}]}>
                          原价 {item.originalPrice}
                        </Text>
                      : null
                    }
                  </View>
                  <View>
                    {item.pv
                      ? <Text style={styles.itemText}>{item.pv}人看过</Text>
                      : null
                    }
                  </View>
                </View>
              </View>
            </LazyloadView>
          </TouchableOpacity>
        )
      })
    }

    return (
      <View style={{flex: 1}}>
        {promotionsView}
      </View>
    )

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <View style={styles.headerItem}>
            <Image source={require('../../assets/images/activity.png')} width={12} height={14}></Image>
            <Text style={styles.headerText} numberOfLines={1}>附近促销</Text>
          </View>
        </View>
        <View style={styles.contentItem}>
          {this.renderSaleItems()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NearbySalesView)

const styles = StyleSheet.create({
  container: {
    width: PAGE_WIDTH,
    justifyContent: 'center',
    backgroundColor: THEME.base.backgroundColor,
  },
  headerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalizeH(42),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    marginLeft: normalizeW(18),
    marginRight: normalizeW(18),
  },
  headerItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: normalizeH(10),
  },
  headerText: {
    fontSize: em(12),
    color: '#5A5A5A',
    paddingLeft: 5,
  },
  contentItem: {
    flex: 1,
    marginLeft: normalizeW(18),
    marginRight: normalizeW(18),
  },
  saleItemView: {
    ...Platform.select({
      ios: {
        height: normalizeH(130),
      },
      android: {
        height: normalizeH(140),
      }
    }),
    flex: 1,
    flexDirection: 'row',
    paddingTop: normalizeH(19),
    paddingBottom: normalizeH(15),
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  saleImg: {
    width: normalizeW(100),
    height: normalizeW(100),
    paddingLeft: normalizeW(5),
    paddingRight: normalizeW(5),
  },
  saleContent: {
    flex: 1,
    marginLeft: normalizeW(15),
    marginRight: normalizeW(5),
  },
  itemTitle: {
    fontSize: em(17),
    fontWeight: 'bold',
    color: '#5A5A5A',
  },
  itemText: {
    fontSize: em(12),
    color: '#AAAAAA',
  },
  addressTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalizeH(10),
  },
  saleAbstract: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalizeH(17),
  },
  saleLabel: {
    backgroundColor: THEME.base.lightColor,
    borderRadius: 2,
    padding: 2,
  },
  saleLabelText: {
    color: 'white',
    fontSize: em(12),
    fontWeight: 'bold',
  },
  priceView: {
    flexDirection: 'row',
    marginTop: normalizeH(7),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: em(15),
    fontWeight: 'bold',
    color: '#00BE96',
  },
})