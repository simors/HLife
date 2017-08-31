/**
 * Created by yangyang on 2017/3/18.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import ScoreShow from '../../common/ScoreShow'
import ShopShow from '../../Local/ShopShow'

class ShopFolloweesView extends Component {
  constructor(props) {
    super(props)
  }

  renderShopPromotion(shopInfo) {
    // console.log('renderShopPromotion.shopInfo=**********==', shopInfo)
    let containedPromotions = shopInfo.containedPromotions
    if(containedPromotions && containedPromotions.length) {
      let shopPromotionView = containedPromotions.map((promotion, index)=>{
        return (
          <View key={'promotion_' + index} style={styles.shopPromotionBox}>
            <View style={styles.shopPromotionBadge}>
              <Text style={styles.shopPromotionBadgeTxt}>{promotion.type}</Text>
            </View>
            <View style={styles.shopPromotionContent}>
              <Text numberOfLines={1} style={styles.shopPromotionContentTxt}>{promotion.typeDesc}</Text>
            </View>
          </View>
        )
      })
      return (
        <View style={styles.shopPromotionWrap}>
          {shopPromotionView}
        </View>
      )
    }
    return null
  }

  render() {
    let shopInfo = this.props.shopInfo

    let shopTag = null
    if(shopInfo.containedTag && shopInfo.containedTag.length) {
      shopTag = shopInfo.containedTag[0].name
    }

    return (
      <View>
        <TouchableOpacity onPress={()=>{
          Actions.SHOP_DETAIL({
            id: shopInfo.id
          })
        }}>
          <View style={[styles.shopInfoWrap]}>
            <View style={styles.coverWrap}>
              <Image style={styles.cover} source={{uri: shopInfo.coverUrl}}/>
            </View>
            <View style={styles.shopIntroWrap}>
              <View style={styles.shopInnerIntroWrap}>
                <Text style={styles.shopName} numberOfLines={1}>{shopInfo.shopName}</Text>
                <ScoreShow
                  containerStyle={{flex:1}}
                  score={shopInfo.score}
                />
                <View style={styles.subInfoWrap}>
                  {shopTag 
                    ? <Text style={[styles.subTxt]}>{shopTag}</Text>
                    : null
                  }
                  <View style={{flex:1,flexDirection:'row'}}>
                    <Text style={styles.subTxt}>{shopInfo.geoDistrict && shopInfo.geoDistrict}</Text>
                  </View>
                  {shopInfo.distance 
                    ? <Text style={styles.subTxt}>{shopInfo.distance + shopInfo.distanceUnit}</Text>
                    : null
                  }
                </View>
              </View>
              {this.renderShopPromotion(shopInfo)}
            </View>
          </View>
        </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopFolloweesView)

const styles = StyleSheet.create({
  shopInfoWrap: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  coverWrap: {
    width: 80,
    height: 80
  },
  cover: {
    flex: 1
  },
  shopInfoWrap: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    paddingBottom:15,
    backgroundColor: '#fff',
    borderBottomWidth:normalizeBorder(),
    borderBottomColor: '#f5f5f5'
  },
  shopIntroWrap: {
    flex: 1,
    paddingLeft: 10,
  },
  shopName: {
    fontSize: em(17),
    color: '#8f8e94'
  },
  subInfoWrap: {
    flexDirection: 'row',
  },
  shopInnerIntroWrap: {
    height: 80,
  },
  subTxt: {
    marginRight: normalizeW(10),
    color: '#d8d8d8',
    fontSize: em(12)
  },
  shopPromotionWrap: {
    flex: 1,
    marginTop: 10,
    borderTopWidth:normalizeBorder(),
    borderTopColor: '#f5f5f5'
  },
  shopPromotionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  shopPromotionBadge: {
    backgroundColor: '#F6A623',
    borderRadius: 2,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  shopPromotionBadgeTxt: {
    color:'white',
    fontSize: em(12)
  },
  shopPromotionContent: {
    flex: 1,
    marginLeft: 10
  },
  shopPromotionContentTxt: {
    color: '#aaaaaa',
    fontSize: em(12)
  },
})