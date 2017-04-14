/**
 * Created by lilu on 2017/4/14.
 */
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
  ListView,
  StatusBar,
} from 'react-native'
import Header from '../../common/Header'
import {getMyTopicDrafts,getMyShopPromotionDrafts} from '../../../selector/draftSelector'
// import {fetchTopics} from '../../../action/topicActions'
// import CommonListView from '../../common/CommonListView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import TopicDraftShow from './topicDraftShow'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import {Actions} from 'react-native-router-flux'
import {SwipeListView,SwipeRow} from 'react-native-swipe-list-view'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

export class MyTopic extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopics({isRefresh: true, type: "myTopics"})
    })
  }

  renderTopicItem(value, key) {
    return (
      <MyTopicShow key={key}
                   containerStyle={{borderBottomWidth: 1, borderColor: '#F5F5F5'}}
                   topic={value}
      />
    )
  }

  refreshTopic() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    let lastUpdatedAt = undefined
    if(this.props.topics){
      let currentTopics = this.props.topics
      if(currentTopics && currentTopics.length) {
        lastUpdatedAt = currentTopics[currentTopics.length-1].updatedAt
      }
    }
    let payload = {
      type: "myTopics",
      lastUpdatedAt: lastUpdatedAt,
      isRefresh: !!isRefresh,
      success: (isEmpty) => {
        if(!this.listView) {
          return
        }
        if(isEmpty) {
          this.listView.isLoadUp(false)
        }else {
          this.listView.isLoadUp(true)
        }
      },
      error: (err)=>{
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.fetchTopics(payload)
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header
          headerContainerStyle={{backgroundColor: THEME.base.mainColor}}
          leftType="icon"
          leftStyle={{color: '#FFFFFF'}}
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="我的话题"
          titleStyle={{color: '#FFF'}}
          rightType="none"
        />
        <View style={styles.body}>
          <SwipeListView
            dataSource={this.props.topics.cloneWithRows(data)}
            renderRow={ (data, secId, rowId) => (
              <SwipeRow
                disableRightSwipe={parseInt(rowId) % 2 !== 0}
                disableLeftSwipe={parseInt(rowId) % 2 === 0}
                leftOpenValue={20 + parseInt(rowId) * 5}
                rightOpenValue={-150}
              >
                <View style={styles.rowBack}>
                  <Text>Left Hidden</Text>
                  <Text>Right Hidden</Text>
                </View>
                <View style={styles.rowFront}>
                  <Text>Row front | {data}</Text>
                </View>
              </SwipeRow>
            )}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  const topics = getMyTopicDrafts(state)
  console.log('topics',topics)
  return {
    // dataSrc: ds.cloneWithRows(topics),
    topics: topics,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  // fetchTopics,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyTopic)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
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
  },
  listViewStyle: {
    width: PAGE_WIDTH,
    backgroundColor: '#E5E5E5',
  },
})