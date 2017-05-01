/**
 * Created by wuxingyu on 2016/12/9.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  InteractionManager,
  TouchableHighlight,
  ListView,
  StatusBar,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {fetchUserFollowees} from '../../action/authActions'
import {getTopicCategories} from '../../selector/configSelector'
import {getCity} from '../../selector/locSelector'
import {getTopics, getLocalTopics, getPickedTopics} from '../../selector/topicSelector'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import {fetchTopics, likeTopic, unLikeTopic} from '../../action/topicActions'
import CommonListView from '../common/CommonListView'
import {TabScrollView} from '../common/TabScrollView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import TopicShow from './TopicShow'
import * as Toast from '../common/Toast'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

export class Find extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 0,
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.refreshTopic()
    })
  }

  componentDidMount() {
    // InteractionManager.runAfterInteractions(() => {
    //   if (this.state.selectedTab == 0) {
    //     this.props.fetchTopics({
    //       type: "pickedTopics",
    //       isRefresh: true
    //     })
    //   }
    //   else if (this.state.selectedTab == 1) {
    //     this.props.fetchTopics({
    //       type: "localTopics",
    //       isRefresh: true
    //     })
    //   } else {
    //     this.props.fetchTopics({
    //       type: "topics",
    //       categoryId: this.props.topicCategories[this.state.selectedTab].objectId,
    //       isRefresh: true
    //     })
    //   }
    // })
  }

  componentWillReceiveProps(nextProps) {
    
  }

  getSelectedTab(index) {
    this.setState({selectedTab: index}, ()=>{
      this.refreshTopic()
    })
    // InteractionManager.runAfterInteractions(() => {
    //   if (index == 0) {
    //     this.props.fetchTopics({
    //       type: "pickedTopics",
    //       isRefresh: true
    //     })
    //   }
    //   else if (index == 1) {
    //     this.props.fetchTopics({
    //       type: "localTopics",
    //       isRefresh: true
    //     })
    //   }
    //   else {
    //     this.props.fetchTopics({
    //       type: "topics",
    //       categoryId: this.props.topicCategories[index].objectId,
    //       isRefresh: true
    //     })
    //   }
    // })
  }

  onLikeButton(payload) {
    if (payload.isLiked) {
      this.props.unLikeTopic({
        topicId: payload.topic.objectId,
        upType: 'topic',
        success: payload.success,
        error: this.submitErrorCallback
      })
    }
    else {
      this.props.likeTopic({
        topicId: payload.topic.objectId,
        upType: 'topic',
        success: payload.success,
        error: this.submitErrorCallback
      })
    }
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  renderTopicItem(value, key) {
    return (
      <TopicShow key={key}
                 containerStyle={{borderBottomWidth: 1, borderColor: '#F5F5F5'}}
                 topic={value}
                 onLikeButton={(payload)=>this.onLikeButton(payload)}
      />
    )
  }

  refreshTopic() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    if(this.isQuering) {
      return
    }
    this.isQuering = true

    // console.log('refresh in topic')

    let lastCreatedAt = undefined
    let lastUpdatedAt = undefined
    let payload = undefined
    if (this.props.topics) {
      if (this.state.selectedTab == 0 || this.state.selectedTab == 1) {
        let currentTopics = this.props.topics[this.state.selectedTab]
        if (currentTopics && currentTopics.length) {
          lastCreatedAt = currentTopics[currentTopics.length - 1].createdAt
          lastUpdatedAt = currentTopics[currentTopics.length - 1].updatedAt
        }
      } else {
        let currentTopics = this.props.topics[this.props.topicCategories[this.state.selectedTab].objectId]
        if (currentTopics && currentTopics.length) {
          lastCreatedAt = currentTopics[currentTopics.length - 1].createdAt
          lastUpdatedAt = currentTopics[currentTopics.length - 1].updatedAt
        }
      }
    }
    if (this.state.selectedTab == 0) {
      payload = {
        type: "pickedTopics",
        lastCreatedAt: lastCreatedAt,
        lastUpdatedAt: lastUpdatedAt,
        isRefresh: !!isRefresh,
        success: (isEmpty) => {
          this.isQuering = false
          if (!this.listView) {
            return
          }
          if (isEmpty) {
            this.listView.isLoadUp(false)
          } else {
            this.listView.isLoadUp(true)
          }
        },
        error: (err)=> {
          this.isQuering = false
          Toast.show(err.message, {duration: 1000})
        }
      }
    } else if (this.state.selectedTab == 1) {
      payload = {
        type: "localTopics",
        lastCreatedAt: lastCreatedAt,
        lastUpdatedAt: lastUpdatedAt,
        isRefresh: !!isRefresh,
        success: (isEmpty) => {
          this.isQuering = false
          if (!this.listView) {
            return
          }
          if (isEmpty) {
            this.listView.isLoadUp(false)
          } else {
            this.listView.isLoadUp(true)
          }
        },
        error: (err)=> {
          this.isQuering = false
          Toast.show(err.message, {duration: 1000})
        }
      }
    } else {
      payload = {
        type: "topics",
        categoryId: this.props.topicCategories[this.state.selectedTab].objectId,
        lastCreatedAt: lastCreatedAt,
        lastUpdatedAt: lastUpdatedAt,
        isRefresh: !!isRefresh,
        success: (isEmpty) => {
          this.isQuering = false
          if (!this.listView) {
            return
          }
          if (isEmpty) {
            this.listView.isLoadUp(false)
          } else {
            this.listView.isLoadUp(true)
          }
        },
        error: (err)=> {
          this.isQuering = false
          Toast.show(err.message, {duration: 1000})
        }
      }
    }
    this.props.fetchTopics(payload)
  }

  renderTopics() {
    let dataSrc = ds.cloneWithRows([])
    if (this.props.topics) {
      if (this.state.selectedTab == 0) {
        dataSrc = ds.cloneWithRows(this.props.topics[0])
      }
      else if (this.state.selectedTab == 1) {
        dataSrc = ds.cloneWithRows(this.props.topics[1])
      }
      else if (this.props.topics[this.props.topicCategories[this.state.selectedTab].objectId]) {
        dataSrc = ds.cloneWithRows(this.props.topics[this.props.topicCategories[this.state.selectedTab].objectId])
      }
    }
    return (
      this.props.topicCategories.map((value, key)=> {
        if (key == 1 && (!this.props.localCity || this.props.localCity == '全国')) {
          return (
            <View key={key} tabLabel={value.title}
                  style={[styles.itemLayout, this.props.itemLayout && this.props.itemLayout]}>
              <Text style={{alignSelf: 'center', paddingTop: 20}}>请开启定位服务</Text>
            </View>
          )
        }
        return (
          <View key={key} tabLabel={value.title}
                style={[styles.itemLayout, this.props.itemLayout && this.props.itemLayout]}>
            <CommonListView
              contentContainerStyle={{backgroundColor: '#FFF'}}
              dataSource={dataSrc}
              renderRow={(rowData, rowId) => this.renderTopicItem(rowData, rowId)}
              loadNewData={()=> {
                this.refreshTopic()
              }}
              loadMoreData={()=> {
                this.loadMoreData(false)
              }}
              ref={(listView) => this.listView = listView}
            />
          </View>
        )
      })
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TabScrollView topics={this.props.topicCategories}
                       topicId={this.props.categoryId}
                       renderTopics={() => this.renderTopics()}
                       onSelected={(index) => this.getSelectedTab(index)}/>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const topicCategories = getTopicCategories(state)
  const topics = getTopics(state)
  const localTopics = getLocalTopics(state)
  const isLogin = isUserLogined(state)
  const pickedTopic = getPickedTopics(state)
  const userInfo = activeUserInfo(state)
  const localCity = getCity(state)
  if (!localCity)
    topicCategories.unshift({title: "全国"})
  else {
    topicCategories.unshift({title: localCity})
  }
  topicCategories.unshift({title: "精选"})
  topics[0] = pickedTopic
  topics[1] = localTopics

  return {
    dataSrc: ds.cloneWithRows([]),
    topicCategories: topicCategories,
    topics: topics,
    isLogin: isLogin,
    userInfo: userInfo,
    localCity: localCity,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopics,
  likeTopic,
  unLikeTopic,
  fetchUserFollowees
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Find)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  buttonImage: {
    position: 'absolute',
    alignItems: 'flex-end',
    right: 20,
    bottom: 61,
    height: 45,
    width: 45
  },
  itemLayout: {
    flex: 1,
    marginBottom: 50,
  },
})