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
  InteractionManager,
  StatusBar
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {getBanner, getAnnouncement} from '../../selector/configSelector'
import {fetchBanner, fetchAnnouncement, getAllTopicCategories} from '../../action/configAction'
import {getCurrentLocation} from '../../action/locAction'
import CommonListView from '../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import Header from '../common/Header'
import CommonBanner from '../common/CommonBanner'
import CommonBanner2 from '../common/CommonBanner2'
import CommonMarquee2 from '../common/CommonMarquee2'
import Health from './Health'
import Channels from './Channels'
import DailyChosen from './DailyChosen'
import Columns from './Columns'
import {getTopicCategories} from '../../selector/configSelector'
import MessageBell from '../common/MessageBell'
import NearbyTopicView from './NearbyTopicView'
import NearbyShopView from './NearbyShopView'
import NearbySalesView from './NearbySalesView'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      defaultIndex: 0,
    }
    this.defaultIndex = 0
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getCurrentLocation()
      this.props.fetchBanner({type: 0})
      // this.props.fetchAnnouncement({type: 0})
      this.props.getAllTopicCategories({})
    })
  }

  onMomentumScrollEnd(event, state) {
    console.log(`--->onMomentumScrollEnd page index:${state.index}, total:${state.total}`)
    this.defaultIndex = state.index
  }

  renderRow(rowData, rowId) {
    switch (rowData.type) {
      case 'NEARBY_TOPIC':
        return this.renderNearbyTopic()
      case 'HEALTH_COLUMN':
        return this.renderHealthColumn()
      case 'ANNOUNCEMENT_COLUMN':
        return this.renderAnnouncementColumn()
      case 'BANNER_COLUMN':
        return this.renderBannerColumn()
      case 'COLUMNS_COLUMN':
        return this.renderColumnsColumn()
      case 'CHANNELS_COLUMN':
        return this.renderChannelsColumn()
      case 'DAILY_CHOSEN_COLUMN':
        return this.renderDailyChosenColumn()
      default:
        return <View />
    }

  }

  renderNearbyTopic() {
    return (
      <View style={styles.moduleSpace}>
        <NearbyTopicView />
      </View>
    )
  }

  renderNearbyShop() {
    return (
      <View style={styles.moduleSpace}>
        <NearbyShopView />
      </View>
    )
  }

  renderNearbySalesView() {
    return (
      <View style={styles.moduleSpace}>
        <NearbySalesView />
      </View>
    )
  }

  renderHealthColumn() {
    return (
      <View style={styles.healthModule}>
        <Health />
      </View>
    )
  }

  renderAnnouncementColumn() {
    if (this.props.announcement) {
      return (
        <View style={styles.announcementModule}>
          <CommonMarquee2 data={this.props.announcement}/>
        </View>
      )
    } else {
      return (
        <View style={styles.announcementModule}></View>
      )
    }
  }

  renderBannerColumn() {
    if (this.props.banner) {
      return (
        <View style={styles.advertisementModule}>
          <CommonBanner2
            banners={this.props.banner}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.advertisementModule}></View>
      )
    }
  }

  renderColumnsColumn() {
    return (
      <View style={styles.columnsModule}>
        <Columns/>
      </View>
    )
  }

  renderChannelsColumn() {
    if (this.props.topics.length > 0) {
      return (
        <View style={styles.channelsModule}>
          <Channels topics={this.props.topics}/>
        </View>
      )
    }
    else {
      return (
        <View style={styles.channelsModule}>
        </View>
      )
    }
  }

  renderDailyChosenColumn() {
    return (
      <View style={styles.dailyChosenModule}>
        <DailyChosen showBadge={true} containerStyle={{marginBottom: 15}}/>
        <DailyChosen />
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
        <StatusBar hidden={false}/>
        <Header
          leftType="image"
          leftImageSource={require("../../assets/images/location.png")}
          leftImageLabel="长沙"
          leftPress={() => {
          }}
          title="邻家优店"
          rightComponent={() => {
            return <MessageBell />
          }}
        />

        <View style={styles.body}>
          <ScrollView style={{flex: 1, height: PAGE_HEIGHT, marginBottom: normalizeH(45)}}>
            {this.renderBannerColumn()}
            {this.renderNearbyTopic()}
            {this.renderNearbyShop()}
            {this.renderNearbySalesView()}
          </ScrollView>
        </View>
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
  dataArray.push({type: 'BANNER_COLUMN'})
  dataArray.push({type: 'NEARBY_TOPIC'})
  // dataArray.push({type: 'ANNOUNCEMENT_COLUMN'})
  // dataArray.push({type: 'HEALTH_COLUMN'})
  // dataArray.push({type: 'COLUMNS_COLUMN'})
  // dataArray.push({type: 'CHANNELS_COLUMN'})
  // dataArray.push({type: 'DAILY_CHOSEN_COLUMN'})

  const announcement = getAnnouncement(state, 0)
  const banner = getBanner(state, 0)
  // const topics = getTopicCategories(state)

  // let pickedTopics = []
  // if (topics) {
  //   topics.forEach((value) => {
  //     if (value.isPicked) {
  //       pickedTopics.push(value)
  //     }
  //   })
  // }

  return {
    // announcement: announcement,
    banner: banner,
    // topics: pickedTopics,
    ds: ds.cloneWithRows(dataArray),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchBanner,
  fetchAnnouncement,
  getAllTopicCategories,
  getCurrentLocation,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainerStyle: {
    paddingBottom: 49
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
    flex: 1,
  },
  healthModule: {
    height: normalizeH(64),
    marginTop: normalizeH(10)
  },
  announcementModule: {
    height: normalizeH(40),
    backgroundColor: 'white',
    //   marginTop: normalizeH(15),
  },
  advertisementModule: {
    height: normalizeH(159),
    backgroundColor: '#fff', //必须加上,否则android机器无法显示banner
  },
  columnsModule: {
    height: normalizeH(84),
    marginTop: normalizeH(15),
    marginBottom: normalizeH(5),
  },
  channelsModule: {
    marginTop: normalizeH(15),
    marginBottom: normalizeH(5),
  },

  dailyChosenModule: {
    marginTop: normalizeH(15),
  },
  moduleSpace: {
    paddingBottom: normalizeH(8),
  }

})