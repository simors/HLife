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
  TouchableHighlight,
} from 'react-native'
import Header from '../../common/Header'
import {getMyTopics} from '../../../selector/topicSelector'
import {fetchTopics,disableTopic} from '../../../action/topicActions'
import {fetchAllTopics} from '../../../action/newTopicAction'
import {getUserTopics} from '../../../selector/newTopicSelector'
import {activeUserId} from '../../../selector/authSelector'

import CommonListView from '../../common/CommonListView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MyTopicShow from './MyTopicShow'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import {Actions} from 'react-native-router-flux'
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view'
import THEME from '../../../constants/themes/theme1'
import Popup from '@zzzkk2009/react-native-popup'
import * as Toast from '../../../components/common/Toast'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

export class MyTopic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showNoDataView: false
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.refreshTopic()
    })
  }
  clearTopic(id) {
    Popup.confirm({
      title: '提示',
      content: '确认删除话题？',
      ok: {
        text: '确定',
        style: {color: THEME.base.mainColor},
        callback: ()=> {
          this.delectTopic(id)
          Toast.show('删除成功！')

        }
      },
      cancel: {
        text: '取消',
        callback: ()=> {
          // console.log('cancel')
        }
      }
    })
  }
  delectTopic(id){
    InteractionManager.runAfterInteractions(() => {
      this.props.disableTopic({id:id,
        success:this.refreshTopic.bind(this)
      })
    })
  }
  renderTopicItem(value, key) {
    // console.log('key and value ',key,value)
    return (
      <SwipeRow style={{flex: 1, width: PAGE_WIDTH}}
                disableRightSwipe={true}
                rightOpenValue={-normalizeW(75)}>
        <TouchableHighlight onPress={()=> {
          this.clearTopic(value.objectId)
        }} style={{
          backgroundColor: THEME.base.mainColor,
          marginLeft: normalizeW(300),
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <View >
            <Text style={{color: '#fff', fontSize: em(17)}}>删除</Text>
          </View>
        </TouchableHighlight>
      <MyTopicShow key={key}
                   containerStyle={{borderBottomWidth: 1, borderColor: '#F5F5F5'}}
                   topic={value}
      />
        </SwipeRow>
    )
  }

  refreshTopic() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    if(this.isQuering) {
      // console.log('here is not fetch')
      return
    }
    this.isQuering = true

    let lastUpdatedAt = undefined
    let lastCreatedAt = undefined
    if(this.props.topics){
      let currentTopics = this.props.topics
      if(currentTopics && currentTopics.length) {
        lastUpdatedAt = currentTopics[currentTopics.length-1].updatedAt
        lastCreatedAt = currentTopics[currentTopics.length-1].createdAt
      }
    }
    // console.log('here is fetch')
    let payload = {
      type: "userTopics",
      lastUpdatedAt: lastUpdatedAt,
      lastCreatedAt: lastCreatedAt,
      isRefresh: !!isRefresh,
      userId: this.props.userId,
      success: (isEmpty) => {
        this.isQuering = false
        if(!this.listView) {
          return
        }
        if(isEmpty) {
          this.listView.isLoadUp(false)

          if(isRefresh) {
            this.setState({
              showNoDataView: true
            })
          }
        }else {
          this.listView.isLoadUp(true)
        }
      },
      error: (err)=>{
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.fetchAllTopics(payload)
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<StatusBar barStyle="light-content" />*/}
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
          {this.renderNoDataView()}
        </View>
      </View>
    )
  }

  renderNoDataView() {
    if(this.state.showNoDataView) {
      return (
        <View style={[{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'white',justifyContent:'center',alignItems:'center'}]}>
          <Image style={{marginBottom:20}} source={require('../../../assets/images/none_message_140.png')}/>
          <Text style={{color:'#b2b2b2',fontSize:17,marginBottom:15}}>还没发布过话题</Text>
          <Text style={{color:'#b2b2b2',fontSize:17,marginBottom:60}}>好吃的、好玩的、新鲜的要和邻居分享噢</Text>
          <TouchableOpacity style={{backgroundColor:'#ff7819',borderRadius:5,padding:12,paddingLeft:30,paddingRight:30}} 
            onPress={()=>{
              Actions.PUBLISH_TOPIC()
            }}>
              <Text style={{color:'white',fontSize:17}}>发布话题</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return null
  }

}

const mapStateToProps = (state, ownProps) => {
  const userId =activeUserId(state)
  const newTopics = getUserTopics(state,userId).allTopics
  // const topics = getMyTopics(state)
  // console.log('topics',topics)
  return {
    dataSrc: ds.cloneWithRows(newTopics),
    topics: newTopics,
    userId: userId,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopics,
  disableTopic,
  fetchAllTopics,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyTopic)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
  },
  body: {
    marginTop: normalizeH(64),
  },
  listViewStyle: {
    width: PAGE_WIDTH,
    backgroundColor: '#E5E5E5',
  },
})