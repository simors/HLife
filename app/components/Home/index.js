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

import {getBanner, getAnnouncement} from '../../selector/configSelector'
import {fetchBanner, fetchAnnouncement,getAllTopics} from '../../action/configAction'
import CommonListView from '../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import Header from '../common/Header'
import CommonBanner from '../common/CommonBanner'
import CommonMarquee from '../common/CommonMarquee'
import Health from './Health'
import Channels from './Channels'
import DailyChosen from './DailyChosen'
import Columns from './Columns'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Home extends Component {
     constructor(props) {
    super(props)

    this.iosMarginTop = Platform.OS == 'ios' ? {marginTop: 20} : {};

    this.state = {
      clickTitle: 'You can try clicking beauty',
      defaultIndex: 0,
    }
    this.defaultIndex = 0
  }
  
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchBanner({type: 0})
      this.props.fetchAnnouncement({type: 0})
      this.props.getAllTopics({})
    })

    // this.props.fetchBanner({type: 0, geo: { latitude: 39.9, longitude: 116.4 }})
  }

  clickListener(index, banners) {
    console.log(`--->clickListener page index:${index}:  banners=${banners.length}`)
    this.setState({
      clickTitle: this.banners[index].title ? `you click ${this.banners[index].title}` : 'this banner has no title',
    })
  }

  onMomentumScrollEnd(event, state) {
    console.log(`--->onMomentumScrollEnd page index:${state.index}, total:${state.total}`)
    this.defaultIndex = state.index
  }

  renderRow(rowData, rowId) {
    switch (rowData.type) {
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

  renderHealthColumn() {
    return (
      <View style={styles.healthModule}>
        <Health />
      </View>
    )
  }

  renderAnnouncementColumn() {
    if(this.props.announcement) {
      return (
        <View style={styles.announcementModule}>
          <CommonMarquee data={this.props.announcement} height={40} />
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
          <CommonBanner banners={this.props.banner} />
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
      <Columns />
      </View>
    )
  }

  renderChannelsColumn() {
    return (
      <View style={styles.channelsModule}>
        <Channels />
      </View>
    )
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
        <Header
          leftType="image"
          leftImageSource={require("../../assets/images/local_unselect.png")}
          leftImageLabel="长沙"
          leftPress={() => Actions.pop()}
          title="近来"
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
  dataArray.push({type: 'HEALTH_COLUMN'})
  dataArray.push({type: 'ANNOUNCEMENT_COLUMN'})
  dataArray.push({type: 'BANNER_COLUMN'})
  dataArray.push({type: 'COLUMNS_COLUMN'})
  dataArray.push({type: 'CHANNELS_COLUMN'})
  dataArray.push({type: 'DAILY_CHOSEN_COLUMN'})

  const announcement = getAnnouncement(state, 0)
  const banner = getBanner(state, 0)

  return {
    announcement: announcement,
    banner: banner,
    ds: ds.cloneWithRows(dataArray)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchBanner,
  fetchAnnouncement,
  getAllTopics
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)

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
  healthModule: {
    height: normalizeH(128),
  },
  announcementModule: {
    height: normalizeH(40),
    marginTop: normalizeH(15),
  },
  advertisementModule: {
    height: normalizeH(136),
    marginTop: normalizeH(15),
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

})