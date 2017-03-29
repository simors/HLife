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

class NearbyShopView extends Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    //console.log('NearbyShopView.allShopCategories=====>>>>>', nextProps.allShopCategories)
  }

  gotoShopCategoryList(shopCategory) {
    Actions.SHOP_CATEGORY_LIST({
      shopCategoryId: shopCategory.shopCategoryId,
      shopCategoryName: shopCategory.text})
  }

  renderMainShop() {
    let mainItemView = <View />

    if(this.props.allShopCategories && this.props.allShopCategories.length) {
      mainItemView = this.props.allShopCategories.map((item, index)=>{
        if(index >= 2) {
          return null
        }
        return (
          <TouchableOpacity key={'mainItem_' + index} style={{flex: 1}} onPress={() => {this.gotoShopCategoryList(item)}}>
            <View style={[styles.mainShopItem, {paddingRight: 2}]}>
              <View style={{width: normalizeW(80)}}>
                <View style={styles.mainShopTitleView}>
                  <Text style={[styles.shopTitle, {color: item.textColor || THEME.base.mainColor}]} numberOfLines={1}>{item.text}</Text>
                </View>
                <View style={{paddingLeft: 8, paddingRight: 8, marginTop: 5}}>
                  <Text style={styles.itemAbstract} numberOfLines={6}>{item.describe}</Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <Image style={{flex: 1}} source={{uri: item.showPictureSource}}></Image>
              </View>
            </View>
          </TouchableOpacity>
        )
      })

      return (
        <View style={styles.mainShops}>
          {mainItemView}
        </View>
      )
    }
    return mainItemView
  }

  renderSecondShop() {

    let secondItemView = <View />

    if(this.props.allShopCategories && this.props.allShopCategories.length) {
      secondItemView = this.props.allShopCategories.map((item, index)=>{
        if(index < 2 || index > 5) {
          return null
        }
        return (
          <TouchableOpacity key={'secondItem_' + index} style={{flex: 1}} onPress={() => {this.gotoShopCategoryList(item)}}>
            <View style={[styles.secondShopItem, {borderRightWidth: 1, borderColor: '#F5F5F5'}]}>
              <View>
                <Text style={[styles.shopTitle, {color: item.textColor || '#4990E2'}]} numberOfLines={1}>{item.text}</Text>
              </View>
              <View style={{paddingLeft: 8, paddingRight: 8, paddingTop: 5}}>
                <Text style={styles.itemAbstract} numberOfLines={1}>{item.describe}</Text>
              </View>
              <View style={styles.secondShopImg}>
                <Image style={{width: normalizeW(82), height: normalizeH(44)}} source={{uri: item.showPictureSource}}></Image>
              </View>
            </View>
          </TouchableOpacity>
        )
      })

      return (
        <View style={styles.secondShops}>
          {secondItemView}
        </View>
      )
    }
    return secondItemView
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <View style={styles.headerItem}>
            <Image source={require('../../assets/images/near.png')} width={12} height={14}></Image>
            <Text style={styles.headerText} numberOfLines={1}>周边必逛</Text>
          </View>
        </View>
        <View style={styles.contentItem}>
          {this.renderMainShop()}
          {this.renderSecondShop()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('NearbyShopView.mapStateToProps==ownProps===>>>>>', ownProps.allShopCategories)
  let allShopCategories = ownProps.allShopCategories
  if(allShopCategories && allShopCategories.length) {
    allShopCategories.sort((item1, item2)=>{
      let displaySort1 = item1.displaySort
      let displaySort2 = item2.displaySort
      if(!displaySort1) {
        return 1
      }
      if(!displaySort2) {
        return -1
      }
      let displaySortNum1 = parseInt(displaySort1)
      let displaySortNum2 = parseInt(displaySort2)
      if(!displaySortNum1) {
        return 1
      }
      if(!displaySortNum2) {
        return -1
      }
      return displaySortNum1 - displaySortNum2
    })
  }
  // console.log('NearbyShopView.sorted==allShopCategories===>>>>>', ownProps.allShopCategories)
  return {
    allShopCategories: allShopCategories,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NearbyShopView)

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
  mainShops: {
    flex: 1,
    flexDirection: 'row',
    height: normalizeH(108),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  secondShops: {
    flex: 1,
    flexDirection: 'row',
    height: normalizeH(102),
  },
  mainShopItem: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 13,
  },
  secondShopItem: {
    alignItems: 'center',
    paddingTop: 10,
  },
  mainShopTitleView: {
    borderLeftWidth: 3,
    borderColor: THEME.base.mainColor,
    paddingLeft: 5,
  },
  shopTitle: {
    fontSize: em(15),
    fontWeight: 'bold',
  },
  itemAbstract: {
    fontSize: em(11),
    color: '#AAAAAA',
  },
  secondShopImg: {
    paddingTop: 5,
    height: normalizeH(45),
    width: normalizeW(82),
    paddingBottom: normalizeH(10),
  },
})