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

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class NearbySalesView extends Component {
  constructor(props) {
    super(props)
  }

  renderSaleItems() {
    let promotionsView = <View />
    if(this.props.shopPromotionList && this.props.shopPromotionList.length) {
      promotionsView = this.props.shopPromotionList.map((item, index)=>{
        return (
          <TouchableOpacity key={'promotion_' + index} style={{flex: 1}} onPress={() => {Actions.SHOP_PROMOTION_DETAIL({id:item.id})}}>
            <View style={styles.saleItemView}>
              <View style={styles.saleImg}>
                <Image style={{flex: 1}}
                       source={{uri: item.coverUrl}}/>
              </View>
              <View style={styles.saleContent}>
                <View>
                  <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                </View>
                <View style={styles.addressTextView}>
                  <View style={{flexDirection: 'row', width: 180}}>
                    <Text style={[styles.itemText, {maxWidth: 90}]} numberOfLines={1}>{item.targetShop.shopName}</Text>
                    <Text style={styles.itemText}> | </Text>
                    <Text style={[styles.itemText, {maxWidth: 80}]} numberOfLines={1}>{item.targetShop.geoDistrict}</Text>
                  </View>
                  <View>
                    <Text style={styles.itemText}>{item.targetShop.distance + item.targetShop.distanceUnit}</Text>
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
                    <Text style={[styles.priceText, {marginLeft: normalizeW(5)}]}>{item.promotingPrice}</Text>
                    {item.originalPrice &&
                      <Text style={[styles.itemText, {marginLeft: normalizeW(5)}]}>(原价 {item.originalPrice})</Text>
                    }
                  </View>
                  <View>
                    <Text style={styles.itemText}>{item.pv}人看过</Text>
                  </View>
                </View>
              </View>
            </View>
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
    lineHeight: 12,
    paddingLeft: 5,
  },
  contentItem: {
    flex: 1,
    marginLeft: normalizeW(18),
    marginRight: normalizeW(18),
  },
  saleItemView: {
    flex: 1,
    flexDirection: 'row',
    height: normalizeH(130),
    paddingTop: normalizeH(19),
    paddingBottom: normalizeH(15),
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  saleImg: {
    width: normalizeW(100),
    height: normalizeH(100),
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
    lineHeight: 12,
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
    lineHeight: 17,
  },
})