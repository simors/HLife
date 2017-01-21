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
} from 'react-native'
import Header from '../../common/Header'
import {getMyTopics} from '../../../selector/topicSelector'
import {fetchTopics} from '../../../action/topicActions'
import CommonListView from '../../common/CommonListView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MyTopicShow from './MyTopicShow'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import {Actions} from 'react-native-router-flux'

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
                   containerStyle={{marginBottom: 10}}
                   topic={value}
      />
    )
  }

  refreshTopic() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    let lastCreatedAt = undefined
    if(this.props.topics){
      let currentTopics = this.props.topics
      if(currentTopics && currentTopics.length) {
        lastCreatedAt = currentTopics[currentTopics.length-1].createdAt
      }
    }
    let payload = {
      type: "myTopics",
      lastCreatedAt: lastCreatedAt,
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
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="我的话题"
          rightType="none"
        />
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={styles.listViewStyle}
            dataSource={this.props.dataSrc}
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
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  const topics = getMyTopics(state)
  return {
    dataSrc: ds.cloneWithRows(topics),
    topics: topics,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopics,
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