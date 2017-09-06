/**
 * Created by yangyang on 2017/8/31.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import shallowequal from 'shallowequal'
import {LazyloadView} from '../common/Lazyload'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../util/ImageUtil'

export default class NearbySalesItem extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props.promotion.id, nextProps.promotion.id)) {
      return true
    }
    if (!shallowequal(this.state, nextState)) {
      return true
    }
    return false
  }

  render() {
    let index = this.props.index
    let promotion = this.props.promotion
    let goodInfo = {
      id: promotion.goodId,
      targetShop: promotion.shopId,
      goodsName: promotion.goodName,
      price: promotion.price,
      originalPrice: promotion.originalPrice,
      promotionPrice: promotion.promotionPrice,
      coverPhoto: promotion.coverPhoto,
      album: promotion.album,
      status: promotion.goodStatus,
      detail: promotion.detail,
      promotion: promotion.id,
      updatedAt: promotion.goodUpdatedAt,
      promotionType: promotion.type,
      promotionAbstract: promotion.abstract
    }
    return (
      <TouchableOpacity key={'promotion_' + index} style={{flex: 1}} onPress={() => {Actions.SHOP_GOODS_DETAIL({goodInfo:goodInfo})}}>
        <View style={styles.saleItemView}>
          <LazyloadView host="homeList"  style={styles.saleImg} placeholderStyle={styles.saleImg}>
            <CachedImage mutable style={{flex: 1}}
                         source={{uri: getThumbUrl(promotion.coverPhoto, normalizeW(100), normalizeW(100))}}/>
          </LazyloadView>
          <View style={styles.saleContent}>
            <View>
              <Text style={styles.itemTitle} numberOfLines={1}>{promotion.goodName}</Text>
            </View>
            <View style={styles.addressTextView}>
              <View style={{flexDirection: 'row', width: normalizeW(180)}}>
                <Text style={[styles.itemText, {maxWidth: normalizeW(150)}]} numberOfLines={1}>{promotion.shopName}</Text>
              </View>
              <View>
                <Text style={styles.itemText}>{promotion.distance + promotion.distanceUnit}</Text>
              </View>
            </View>
            <View style={styles.saleAbstract}>
              <View style={styles.saleLabel}>
                <Text style={styles.saleLabelText}>{promotion.type}</Text>
              </View>
              <View style={{marginLeft: normalizeW(10)}}>
                <Text style={styles.itemText} numberOfLines={1}>{promotion.typeDesc}</Text>
              </View>
            </View>
            <View style={styles.priceView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.priceText}>¥</Text>
                <Text style={[styles.priceText, {marginLeft: normalizeW(5)}]}>{promotion.promotionPrice}</Text>
                {promotion.originalPrice
                  ? <Text style={[styles.itemText, {marginLeft: normalizeW(5), textDecorationLine: 'line-through'}]}>
                  原价 {promotion.originalPrice}
                </Text>
                  : null
                }
              </View>
              <View>
                {promotion.pv
                  ? <Text style={styles.itemText}>{promotion.pv}人看过</Text>
                  : null
                }
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
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