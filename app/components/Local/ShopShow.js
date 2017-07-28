import React, {Component} from 'react'
import Immutable, {is} from 'immutable'
import shallowequal from 'shallowequal'
import {shallowEqualImmutable} from 'react-immutable-render-mixin'
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
  Modal,
  ViewPagerAndroid,
  StatusBar,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {selectShopCategories} from '../../selector/configSelector'
import {fetchShopCategories} from '../../action/configAction'
import CommonListView from '../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Header from '../common/Header'
import * as Toast from '../common/Toast'
import * as authSelector from '../../selector/authSelector'
import * as locSelector from '../../selector/locSelector'
import MessageBell from '../common/MessageBell'
import {selectLocalShopList} from '../../selector/shopSelector'
import {clearShopList, getNearbyShopList} from '../../action/shopAction'
import SearchBar from '../common/SearchBar'
import ScoreShow from '../common/ScoreShow'
import ViewPager from 'react-native-viewpager'
import {CachedImage} from "react-native-img-cache"
import AV from 'leancloud-storage'
import {LazyloadView} from '../common/Lazyload'
import {getThumbUrl} from '../../util/ImageUtil'
const PAGE_WIDTH = Dimensions.get('window').width


export default class ShopShow extends Component {
  constructor(props) {
    super(props)
  }

  renderShop(shopInfo, index) {
    // console.log('shopInfo====', shopInfo)

    let shopTag = []
    if (shopInfo.containedTag && shopInfo.containedTag.length) {
      shopTag = shopInfo.containedTag
    }

    return (
        <TouchableOpacity onPress={()=> {
          this.gotoShopDetailScene(shopInfo.id)
        }} >
          <View style={[styles.shopInfoWrap]}>
            <View style={styles.coverWrap}>
              <CachedImage mutable style={styles.cover}
                           source={{uri: getThumbUrl(shopInfo.coverUrl, normalizeW(80), normalizeW(80))}}/>
            </View>
            <View style={styles.shopIntroWrap}>
              <View style={styles.shopInnerIntroWrap}>
                <Text style={styles.shopName} numberOfLines={1}>{shopInfo.shopName}</Text>
                <Text style={styles.shopSpecial} numberOfLines={1}>{shopInfo.ourSpecial}</Text>

                <View style={{flex: 1, justifyContent: 'space-around',marginTop:normalizeH(11)}}>
                  {/*<ScoreShow*/}
                    {/*score={shopInfo.score}*/}
                  {/*/>*/}
                  {this.renderShopPromotion(shopInfo)}
                </View>
                <View style={styles.subInfoWrap}>
                  {this.renderShopTags(shopTag)}
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
    )
  }

  gotoShopDetailScene(id) {
    Actions.SHOP_DETAIL({id: id})
  }

  renderShopTags(tags){
    let showTags = tags.map((item,key)=>{
      if(key<5){
        return <View style={styles.shopTagBadge} key={key}>
          <Text style={styles.shopTagBadgeTxt}>{item.name}</Text>
        </View>
      }
    })
    return <View  style={styles.shopPromotionBox}>
      {showTags }
    </View>
  }

  renderShopPromotion(shopInfo) {
    // console.log('promotion===>',shopInfo.containedPromotions)

    let containedPromotions = shopInfo.containedPromotions
    if (containedPromotions && (containedPromotions.length > 0)) {
      let promotion = containedPromotions[0]
      return (
        <View style={styles.shopPromotionBox}>
          <View style={styles.shopPromotionBadge}>
            <Text style={styles.shopPromotionBadgeTxt}>{promotion.type}</Text>
          </View>
          {containedPromotions[1]?<View style={styles.shopPromotionBadge}>
            <Text style={styles.shopPromotionBadgeTxt}>{containedPromotions[1].type}</Text>
          </View>:null}
          {containedPromotions[2]?<View style={styles.shopPromotionBadge}>
            <Text style={styles.shopPromotionBadgeTxt}>{containedPromotions[2].type}</Text>
          </View>:null}
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={styles.subTxt}>{shopInfo.geoDistrict && shopInfo.geoDistrict}</Text>
          </View>
          {shopInfo.distance &&
          <Text style={[styles.subTxt]}>{shopInfo.distance + shopInfo.distanceUnit}</Text>
          }
        </View>
      )
    }else{
      return(
        <View style={styles.shopPromotionBox}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={styles.subTxt}>{shopInfo.geoDistrict && shopInfo.geoDistrict}</Text>
          </View>
          {shopInfo.distance &&
          <Text style={[styles.subTxt]}>{shopInfo.distance + shopInfo.distanceUnit}</Text>
          }
        </View>
      )
    }
    return null
  }

  render() {
    return (
      <LazyloadView key={'shop_' + this.props.index} host="localShop" placeholderStyle={{height: 200, width: PAGE_WIDTH}}>
      {this.renderShop(this.props.shopInfo, this.props.index)}
      </LazyloadView>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    marginBottom: 42
  },
  shopInfoWrap: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#f5f5f5'
  },
  shopInnerIntroWrap: {
    height: 100,
  },
  shopPromotionWrap: {
    flex: 1,
    marginTop: 10,
    borderTopWidth: normalizeBorder(),
    borderTopColor: '#f5f5f5'
  },
  shopPromotionBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopPromotionBadge: {
    backgroundColor: '#F6A623',
    borderRadius: 2,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(6),
  },
  shopPromotionBadgeTxt: {
    color: 'white',
    fontSize: em(12),
  },
  shopPromotionContent: {
    flex: 1,
    marginLeft: 10
  },
  shopPromotionContentTxt: {
    color: '#aaaaaa',
    fontSize: em(12)
  },
  coverWrap: {
    width: normalizeW(100),
    height: normalizeW(100)
  },
  cover: {
    flex: 1
  },
  shopIntroWrap: {
    flex: 1,
    paddingLeft: 10,
  },
  shopName: {
    marginTop:normalizeH(10),
    fontSize: em(17),
    color: '#5a5a5a'
  },
  subInfoWrap: {
    flexDirection: 'row',
    marginTop:normalizeH(7)
  },
  subTxt: {
    marginRight: normalizeW(10),
    color: '#d8d8d8',
    fontSize: em(12)
  },
  swiperStyle: {
    backgroundColor: '#fff',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#f5f5f5'
  },
  shopCategoryPage: {
    flex: 1,
    padding: 10,
    paddingBottom: 26,
    justifyContent: 'space-between',
  },
  shopCategoryRow: {
    flex: 1,
    flexDirection: 'row',
  },
  shopCategoryTouchBox: {
    flex: 1,
  },
  shopCategoryBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopCategoryImage: {
    height: normalizeH(45),
    width: normalizeW(45),
    marginBottom: 6
  },
  shopCategoryText: {},
  indicators: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  shopTagBadge: {
    backgroundColor: '#F5F5F5',
    borderRadius: 2.5,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(6),
  },
  shopTagBadgeTxt: {
    color: '#AAAAAA',
    fontSize: em(11),
  },
  shopSpecial:{
    color: '#AAAAAA',
    fontSize: em(12),
    marginTop:normalizeH(5),
  }
})