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
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager,
  Modal
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
// import Modal from 'react-native-modalbox'
import {fetchUserFollowees} from '../../action/authActions'

import {getBanner, selectShopCategories} from '../../selector/configSelector'
import {fetchBanner, fetchShopCategories} from '../../action/configAction'
import {fetchTopics} from '../../action/topicActions'
import CommonListView from '../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import Header from '../common/Header'
import CommonBanner from '../common/CommonBanner'
import CommonModal from '../common/CommonModal'
import LocalHealth from './LocalHealth'
import ShopCategories from './ShopCategories'
import TopicShow from '../Find/TopicShow'
import {getAllTopics} from '../../selector/topicSelector'
import * as authSelector from '../../selector/authSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Local extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchBanner({type: 0})
      this.props.fetchShopCategories()
      this.props.fetchTopics({type:"allTopics"})
      if(this.props.isUserLogined) {
        this.props.fetchUserFollowees()
      }
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

  _shopCategoryClick(shopCategoryId, shopCategoryName) {
    if (shopCategoryId) {
      this.closeModel(function () {
        Actions.SHOP_CATEGORY_LIST({shopCategoryId: shopCategoryId, shopCategoryName: shopCategoryName})
      })
    } else {
      this.openModel()
    }
  }

  openModel(callback) {
    this.setState({
      modalVisible: true
    })
    if (callback && typeof callback == 'function') {
      callback()
    }
  }

  closeModel(callback) {
    this.setState({
      modalVisible: false
    })
    if (callback && typeof callback == 'function') {
      callback()
    }
  }

  renderLocalHealthColumn() {
    return (
      <LocalHealth />
    )
  }

  renderShopCategoryColumn() {
    if (this.props.shopCategories && this.props.shopCategories.length) {
      return (
        <View style={styles.moduleB}>
          <ShopCategories
            shopCategories={this.props.shopCategories}
            fixedHeight={true}
            onPress={this._shopCategoryClick.bind(this)}
            showMore={true}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.moduleB}></View>
      )
    }
  }

  renderAllShopCategories() {
    if (this.props.allShopCategories && this.props.allShopCategories.length) {
      return (
        <View style={styles.modalCnt}>
          <ShopCategories
            shopCategories={this.props.allShopCategories}
            hasTopBorder={true}
            hasBottomBorder={true}
            onPress={this._shopCategoryClick.bind(this)}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.modalCnt}></View>
      )
    }
  }

  renderBannerColumn() {
    if (this.props.banner) {
      return (
        <View style={styles.moduleC}>
          <CommonBanner banners={this.props.banner}/>
        </View>
      )
    } else {
      return (
        <View style={styles.moduleC}></View>
      )
    }
  }

  renderTopicItem(value, key) {
    return (
      <TopicShow key={key}
                 containerStyle={{marginBottom: 10}}
                 topic={value}
      />
    )
  }

  renderTopicItems() {
    if (this.props.topics) {
      return (
        <View>
          {
            this.props.topics.map((value, key)=> {
              return (
                this.renderTopicItem(value, key)
              )
            })
          }
          <Image style={styles.badgeStyle} source={require("../../assets/images/background_everyday.png")}>
            <Text style={styles.badgeTextStyle}>最新话题</Text>
          </Image>
        </View>
      )
    }
  }

  renderFeaturedTopicsColumn() {
    return (
      <View style={styles.moduleD}>
        {this.renderTopicItems()}
      </View>
    )
  }

  refreshData() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopics({})
    })
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
            loadNewData={()=> {
              this.refreshData()
            }}
            loadMoreData={()=> {
              this.loadMoreData()
            }}
          />
        </View>

        <CommonModal
          modalVisible={this.state.modalVisible}
          modalTitle="更多栏目"
          closeModal={() => this.closeModel()}
        >
          <ScrollView>
            {this.renderAllShopCategories()}
          </ScrollView>
        </CommonModal>

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

  let dataArray = []
  dataArray.push({type: 'LOCAL_HEALTH_COLUMN'})
  dataArray.push({type: 'BANNER_COLUMN'})
  dataArray.push({type: 'SHOP_CATEGORY_COLUMN'})
  dataArray.push({type: 'FEATURED_TOPICS_COLUMN'})

  const banner = getBanner(state, 0)
  const allShopCategories = selectShopCategories(state)
  const shopCategories = allShopCategories.slice(0, 5)
  const topics = getAllTopics(state)
  const isUserLogined = authSelector.isUserLogined(state)
  // let shopCategories = []
  // let ts = {
  //   imageSource: "http://img1.3lian.com/2015/a1/53/d/200.jpg",
  //   text: 'test',
  //   shopCategoryId: 1
  // }
  // shopCategories.push(ts)
  // shopCategories.push(ts)
  // shopCategories.push(ts)
  // shopCategories.push(ts)
  // shopCategories.push(ts)
  // allShopCategories = shopCategories

  return {
    banner: banner,
    shopCategories: shopCategories,
    allShopCategories: allShopCategories,
    ds: ds.cloneWithRows(dataArray),
    topics: topics,
    isUserLogined: isUserLogined
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchBanner,
  fetchShopCategories,
  fetchTopics,
  fetchUserFollowees
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
  badgeStyle: {
    position: 'absolute',
    left: 0,
    top: -10,
    width: 65,
    height: 20,
    justifyContent: "center",
  },
  badgeTextStyle: {
    backgroundColor: "transparent",
    fontSize: 11,
    paddingLeft: 10,
    color: "#ffffff",
    fontFamily: ".PingFangSC-Regular",
    letterSpacing: 0.13
  },
})