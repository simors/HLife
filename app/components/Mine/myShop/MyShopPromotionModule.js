/**
 * Created by zachary on 2017/3/17.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  InteractionManager,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Image,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class MyShopPromotionModule extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let item = this.props.shopPromotion
    // console.log('item=============', item)
    if(!item) {
      return null
    }
    return (
      <TouchableWithoutFeedback style={styles.contentItem}>
        <View style={styles.saleItemView}>
          <View style={styles.saleItemInnerView}>
            <View style={styles.saleImg}>
              <Image style={{flex: 1}}
                     source={{uri: item.coverUrl}}/>
            </View>
            <View style={styles.saleContent}>
              <View>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              </View>
              <View style={styles.addressTextView}>
                <Text style={styles.itemText} numberOfLines={1}>{'上次更新时间:  ' + item.updatedDuration}</Text>
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
                  {item.originalPrice 
                    ? <Text style={[styles.itemText, {marginLeft: normalizeW(5), textDecorationLine: 'line-through'}]}>
                        原价 {item.originalPrice}
                      </Text>
                    : null
                  }
                </View>
                <View>
                  <Text style={styles.itemText}>{item.pv}人看过</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyShopPromotionModule)

const styles = StyleSheet.create({
  contentItem: {
    flex: 1,
  },
  saleItemView: {
    flex: 1,
    paddingTop: normalizeH(19),
    paddingBottom: normalizeH(15),
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
    backgroundColor:'white'
  },
  saleItemInnerView: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
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
  abstractTxt: {
    lineHeight: em(18),
  },
  distanceBox: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft:8,
  },
  distanceTxt: {

  },
  addressTextView: {
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