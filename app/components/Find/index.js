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
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {fetchUserFollowees} from '../../action/authActions'
import {getTopicCategories} from '../../selector/configSelector'
import {getTopics} from '../../selector/topicSelector'
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

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if(this.props.isLogin) {
        this.props.fetchUserFollowees()
      }
      this.props.fetchTopics({
        type: "topics",
        categoryId: this.props.topicCategories[this.state.selectedTab].objectId
      })
    })
    // this.props.fetchBanner({type: 0, geo: { latitude: 39.9, longitude: 116.4 }})
  }

  getSelectedTab(index) {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopics({
        type: "topics",
        categoryId: this.props.topicCategories[index].objectId
      })
    })
    this.setState({selectedTab: index})
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
                 containerStyle={{marginBottom: 10}}
                 topic={value}
                 onLikeButton={(payload)=>this.onLikeButton(payload)}
      />
    )
  }

  refreshTopic() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopics({
        type: "topics",
        categoryId: this.props.topicCategories[this.state.selectedTab].objectId
      })
    })
  }

  loadMoreData() {

  }

  renderTopics() {
    let dataSrc = ds.cloneWithRows([])
    if (this.props.topics){
      if (this.props.topics[this.props.topicCategories[this.state.selectedTab].objectId]) {
        dataSrc = ds.cloneWithRows(this.props.topics[this.props.topicCategories[this.state.selectedTab].objectId])
      }
    }
    return (
      this.props.topicCategories.map((value, key)=> {
        return (
          <View key={key} tabLabel={value.title}
                style={[styles.itemLayout, this.props.itemLayout && this.props.itemLayout]}>
            <CommonListView
              contentContainerStyle={{backgroundColor: '#E5E5E5'}}
              dataSource={dataSrc}
              renderRow={(rowData, rowId) => this.renderTopicItem(rowData, rowId)}
              loadNewData={()=> {
                this.refreshTopic()
              }}
              loadMoreData={()=> {
                this.loadMoreData()
              }}
            />
          </View>
        )
      })
    )
  }

  render() {
    let topicId = this.props.topicCategories[this.state.selectedTab]
    return (
      <View style={styles.container}>
        <Header
          leftType="none"
          title="发现"
          rightType="none"
        />
        <TabScrollView topics={this.props.topicCategories}
                       topicId={this.props.topicId}
                       renderTopics={() => this.renderTopics()}
                       onSelected={(index) => this.getSelectedTab(index)}/>
        <TouchableHighlight underlayColor="transparent" style={styles.buttonImage}
                            onPress={()=> {
                              if (this.props.isLogin) {
                                Actions.PUBLISH({topicId})
                              } else {
                                Actions.LOGIN()
                              }
                            }}
        >
          <Image source={require("../../assets/images/local_write@2x.png")}/>
        </TouchableHighlight>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log("+_+_+_>", state)
  const topicCategories = getTopicCategories(state)
  const topics = getTopics(state)
  const isLogin = isUserLogined(state)
  const userInfo = activeUserInfo(state)
  return {
    dataSrc: ds.cloneWithRows([]),
    topicCategories: topicCategories,
    topics: topics,
    isLogin: isLogin,
    userInfo: userInfo,
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
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
    //  alignItems: 'center',
//    justifyContent: 'center'
  },
})