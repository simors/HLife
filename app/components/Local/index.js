/**
 * Created by yangyang on 2016/12/1.
 *
 *bugs:
 * renderRow={(rowData, rowId) => {this.renderRow(rowData, rowId)}}
 * StaticRenderer.render(): A valid React element(or null) must be returned.
 *
 * 解决:
 * renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
 * remove {} of this.renderRow(rowData, rowId)
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'

import {getBanner, selectShopCategories} from '../../selector/configSelector'
import {fetchBanner,fetchShopCategories} from '../../action/configAction'
import CommonListView from '../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import Header from '../common/Header'
import CommonBanner from '../common/CommonBanner'
import LocalHealth from './LocalHealth'
import ShopCategories from './ShopCategories'
import PickedTopic from './PickedTopic'
import {getTopic} from '../../selector/configSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Local extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchBanner({type: 0})
      this.props.fetchShopCategories()
    })

    // this.props.fetchBanner({type: 0, geo: { latitude: 39.9, longitude: 116.4 }})
  }

  renderRow(rowData, rowId) {
    switch (rowData.type) {
      case 'LOCAL_HEALTH_COLUMN':
        return this.renderLocalHealthColumn()
      case 'SHOP_CATEGORY_COLUMN':
        return this.renderShopCategoryColumn()
      case 'BANNER_COLUMN':
        return this.renderBannerColumn()
      case 'FEATURED_TOPICS_COLUMN':
        return this.renderFeaturedTopicsColumn()
      default:
        return <View />
    }

  }

  renderLocalHealthColumn() {
    return (
      <View style={styles.moduleA}>
        <LocalHealth />
      </View>
    )
  }

  renderShopCategoryColumn() {
    if(this.props.shopCategories && this.props.shopCategories.length) {
      return (
        <View style={styles.moduleB}>
          <ShopCategories
            shopCategories={this.props.shopCategories}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.moduleB}></View>
      )
    }
  }

  renderBannerColumn() {
    if (this.props.banner) {
      return (
        <View style={styles.moduleC}>
          <CommonBanner banners={this.props.banner} />
        </View>
      )
    } else {
      return (
        <View style={styles.moduleC}></View>
      )
    }
  }

  renderFeaturedTopicsColumn() {
    return (
      <View style={styles.moduleD}>
        <PickedTopic />
      </View>
    )
  }

  refreshData() {

  }

  loadMoreData() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="none"
          title="本地生活"
          rightType="image"
          rightImageSource={require("../../assets/images/home_message.png")}
          rightPress={() => Actions.REGIST()}
        />

        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={{backgroundColor: '#E5E5E5'}}
            dataSource={this.props.ds}
            renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
            loadNewData={()=>{this.refreshData()}}
            loadMoreData={()=>{this.loadMoreData()}}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = undefined
  if(ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }

  let dataArray = []
  dataArray.push({type: 'LOCAL_HEALTH_COLUMN'})
  dataArray.push({type: 'SHOP_CATEGORY_COLUMN'})
  dataArray.push({type: 'BANNER_COLUMN'})
  dataArray.push({type: 'FEATURED_TOPICS_COLUMN'})

  const banner = getBanner(state, 0)
  const shopCategories = selectShopCategories(state, 5)

  return {
    banner: banner,
    shopCategories: shopCategories,
    ds: ds.cloneWithRows(dataArray)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchBanner,
  fetchShopCategories
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Local)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
  contentContainerStyle: {
    paddingBottom: 49
  },
  body: {
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#E5E5E5',
  },
  moduleA: {
    height: normalizeH(84),
  },
  moduleB: {
    height: normalizeH(183),
    marginTop: normalizeH(15),
    backgroundColor: '#fff'
  },
  moduleC: {
    height: normalizeH(136),
    marginTop: normalizeH(15),
    backgroundColor: '#fff'
  },
  moduleD: {
    marginTop: normalizeH(15),
  },

})