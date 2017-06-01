/**
 * Created by lilu on 2017/5/26.
 */
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
import shallowequal from 'shallowequal'
import ViewPager from '../common/ViewPager/index'
import React, {Component} from 'react'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class NewShopCategories extends Component{
  constructor(props){
    super(props)
  }

  shouldComponentUpdate(nextProps,nextState){
    if (!shallowequal(this.props.allShopCategories, nextProps.allShopCategories))
    {
      return true
    }
    // console.log('here is false')
    return false
  }

  renderShopCategoryRow(row) {
    return (
      <View key={'row' + Math.random()} style={styles.shopCategoryRow}>
        {row}
      </View>
    )
  }

  renderShopCategoryPage(page) {
    return (
      <View key={'page' + Math.random()} style={styles.shopCategoryPage}>
        {page}
      </View>
    )
  }

  gotoShopCategoryList(shopCategory) {
    Actions.SHOP_CATEGORY_LIST({
      shopCategoryId: shopCategory.shopCategoryId,
      shopCategoryName: shopCategory.text
    })
  }

  renderShopCategoryBox(shopCategory) {
    return (
      <TouchableOpacity key={shopCategory.id} style={styles.shopCategoryTouchBox} onPress={()=> {
        this.gotoShopCategoryList(shopCategory)
      }}>
        <View style={styles.shopCategoryBox}>
          <Image
            style={[styles.shopCategoryImage]}
            source={{uri: shopCategory.imageSource}}
          />
          <Text numberOfLines={1} style={[styles.shopCategoryText]}>{shopCategory.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderPage(data:Object, pageID) {
    return (
      <View
        style={{
          width: PAGE_WIDTH,
          height: normalizeH(200),
          borderBottomWidth: normalizeBorder(),
          borderBottomColor: '#f5f5f5'
        }}
      >
        {data}
      </View>
    )
  }

  renderCategories(){
    let pages = []
    let that = this
    // console.log('this.props.allShopCategories===', this.props.allShopCategories)
    if (this.props.allShopCategories && this.props.allShopCategories.length) {
      let pageView = <View/>
      let shopCategoriesView = []
      let rowView = <View />
      let row = []
      this.props.allShopCategories.forEach((shopCategory, index) => {
        // console.log('shopCategory===', shopCategory)

        let shopCategoryView = that.renderShopCategoryBox(shopCategory)
        row.push(shopCategoryView)

        let shopCategoryLength = this.props.allShopCategories.length
        if (shopCategoryLength == (index + 1)) {
          // console.log('renderSectionHeader*****==row.length==', row.length)
          if (row.length < 4) {
            let lastRowLength = row.length
            for (let i = 0; i < (4 - lastRowLength); i++) {
              let placeholderRowView = <View key={'empty_' + i} style={styles.shopCategoryTouchBox}/>
              row.push(placeholderRowView)
            }
            // console.log('renderSectionHeader*****>>>>>>>>>>>>>==row.length==', row.length)
          }
        }

        if (row.length == 4) {
          rowView = that.renderShopCategoryRow(row)
          shopCategoriesView.push(rowView)
          row = []
        }

        if (shopCategoriesView.length == 2 || shopCategoryLength == (index + 1)) {
          pageView = that.renderShopCategoryPage(shopCategoriesView)
          pages.push(pageView)
          shopCategoriesView = []
        }

      })

      // console.log('renderSectionHeader*****==pages==', pages)

      let dataSource = new ViewPager.DataSource({
        pageHasChanged: (p1, p2) => p1 !== p2,
      })

      return (
        <ViewPager
          style={{flex: 1}}
          dataSource={dataSource.cloneWithPages(pages)}
          renderPage={this._renderPage}
          isLoop={false}
          autoPlay={false}
        />
      )
      // return (
      //   <ShopCategories shopCategories = {this.props.allShopCategories}/>
      // )
    }
    return null
  }

  render(){
    return (
      <View>
    {this.renderCategories()}
    </View>
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
    height: 80,
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
    // marginTop: 10,
  },
  shopPromotionBadge: {
    backgroundColor: '#F6A623',
    borderRadius: 2,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  shopPromotionBadgeTxt: {
    color: 'white',
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
  coverWrap: {
    width: 80,
    height: 80
  },
  cover: {
    flex: 1
  },
  shopIntroWrap: {
    flex: 1,
    paddingLeft: 10,
  },
  shopName: {
    fontSize: em(17),
    color: '#5a5a5a'
  },
  subInfoWrap: {
    flexDirection: 'row',
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
    height: 50,
    width: 50,
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

})

