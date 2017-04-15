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
  TouchableHighlight
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
import {fetchTopicDraft, handleDestroyTopicDraft,handleDestroyShopPromotionDraft} from '../../../action/draftAction'
import THEME from '../../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

export class MyTopic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabType: props.tabType ? 1 : 0

    }
  }

  componentDidMount() {

  }
  delectDraft(rowId){
    this.props.handleDestroyTopicDraft({id:rowId})
  }
  delectShopDraft(rowId){
    this.props.handleDestroyShopPromotionDraft({id:rowId})
  }
  renderShopPromotionItem(value, key,rowId) {
    // console.log('valeu',value,rowId)
    return (
      <SwipeRow style = {{flex:1,width:PAGE_WIDTH}}
                disableRightSwipe={true}
                leftOpenValue={20 + parseInt(rowId) * 5}
                rightOpenValue={-normalizeW(75)}>

        <TouchableHighlight onPress={()=>{this.delectShopDraft(rowId)}} style={{marginLeft:normalizeW(300)}}>
          <View >
            <Text>删除</Text>
          </View>
        </TouchableHighlight>
        <View style={{flex:1}}>

          <Text>{value.title}</Text>
        </View >

      </SwipeRow>
    )
  }

  renderTopicItem(value, key,rowId) {
  // console.log('valeu',value,rowId)
  return (
    <SwipeRow style = {{flex:1,width:PAGE_WIDTH}}
              disableRightSwipe={true}
              leftOpenValue={20 + parseInt(rowId) * 5}
              rightOpenValue={-normalizeW(75)}>

      <TouchableHighlight onPress={()=>{this.delectDraft(rowId)}} style={{marginLeft:normalizeW(300)}}>
        <View >
          <Text>删除</Text>
        </View>
      </TouchableHighlight>
      <View style={{flex:1}}>
        <TopicDraftShow key={rowId}
                        containerStyle={{borderBottomWidth: 1, borderColor: '#F5F5F5'}}
                        topic={value}
                        commentButtonPress={()=>{Actions.TOPIC_EDIT({topic: value})}}
        />
        {/*<Text>Row front | </Text>*/}
      </View>

    </SwipeRow>
  )
}
  toggleTab(type) {
    this.setState({tabType: type}, ()=>{
      if(0 == type) {
        this.renderTopicList()
      } else if(1 == type) {
        this.renderShopList()
      }
    })
  }
  refreshTopic() {
    this.loadMoreData(true)
  }

  // loadMoreData(isRefresh) {
  //   let lastUpdatedAt = undefined
  //   if(this.props.topics){
  //     let currentTopics = this.props.topics
  //     if(currentTopics && currentTopics.length) {
  //       lastUpdatedAt = currentTopics[currentTopics.length-1].updatedAt
  //     }
  //   }
  //   let payload = {
  //     type: "myTopics",
  //     lastUpdatedAt: lastUpdatedAt,
  //     isRefresh: !!isRefresh,
  //     success: (isEmpty) => {
  //       if(!this.listView) {
  //         return
  //       }
  //       if(isEmpty) {
  //         this.listView.isLoadUp(false)
  //       }else {
  //         this.listView.isLoadUp(true)
  //       }
  //     },
  //     error: (err)=>{
  //       Toast.show(err.message, {duration: 1000})
  //     }
  //   }
  //   this.props.fetchTopics(payload)
  // }
  renderTopicList(){
    return(

      <SwipeListView
        dataSource={this.props.dataSrc}
        renderRow={ (data,key,rowId) => ( this.renderTopicItem(data,key,rowId)
        )
          // console.log('data',data,key,rowId)

        }

        leftOpenValue={75}
        rightOpenValue={-75}
      />
    )
  }
  renderShopList(){
    return(<SwipeListView
      dataSource={this.props.shopDataSrc}
      renderRow={ (data,key,rowId) => ( this.renderShopPromotionItem(data,key,rowId)
      )
        // console.log('data',data,key,rowId)

      }

      leftOpenValue={75}
      rightOpenValue={-75}
    />)
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
          title="我的草稿"
          titleStyle={{color: '#FFF'}}
          rightType="none"
        />
        <View style={styles.body}>
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                onPress={()=> {
                  this.toggleTab(0)
                }}>
                <View style={[{width: normalizeW(100), height: normalizeH(44), justifyContent: 'flex-end', alignItems: 'center'},
                  this.state.tabType == 0 ?
                  {
                    borderBottomWidth: 3,
                    borderColor: THEME.base.mainColor
                  } : {}]}>
                  <Text style={[{fontSize: em(17), paddingBottom: normalizeH(8)},
                    this.state.tabType == 0 ?
                    {
                      color: THEME.base.mainColor,
                      fontWeight: 'bold',
                    } : {color: '#4A4A4A'}]}
                  >话题</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                onPress={()=> {
                  this.toggleTab(1)
                }}>
                <View style={[{width: normalizeW(100), height: normalizeH(44), justifyContent: 'flex-end', alignItems: 'center'},
                  this.state.tabType == 1 ?
                  {
                    borderBottomWidth: 3,
                    borderColor: THEME.base.mainColor
                  } : {}]}>
                  <Text style={[{fontSize: em(17), paddingBottom: normalizeH(8)},
                    this.state.tabType == 1 ?
                    {
                      color: THEME.base.mainColor,
                      fontWeight: 'bold',
                    } : {color: '#4A4A4A'}]}
                  >店铺活动</Text>
                </View>
              </TouchableOpacity>
            </View>
            {this.state.tabType == 0?this.renderTopicList():this.renderShopList()}


        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  const topics = getMyTopicDrafts(state)
  const shopPromotions = getMyShopPromotionDrafts(state)
  console.log('shopPromotions',shopPromotions)
  let topicArr = []
  // for (let key in topics) {
  //   topicArr.push({
  //     key: key, data: {
  //       content: topics[key].content, //话题内容
  //       title: topics[key].title,
  //       abstract: topics[key].abstract,
  //       imgGroup: topics[key].imgGroup, //图片
  //       objectId: topics[key].topicId,  //话题id
  //       categoryId: topics[key].categoryId,
  //       city: topics[key].city,
  //       draftDay: topics[key].draftDay,
  //       draftMonth: topics[key].draftMonth
  //     }
  //   })
  //   console.log('topicArr', topicArr)
  // }
    return {
      shopDataSrc : ds.cloneWithRows(shopPromotions),
      dataSrc: ds.cloneWithRows(topics),
      // dataSrc: ds.cloneWithRows(topics),
      topics: topics,
    }

}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  // fetchTopics,
  handleDestroyTopicDraft,
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
  tabBar: {
    height: normalizeH(44),
    width: PAGE_WIDTH,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
  },
  //用户、时间、地点信息
  introWrapStyle: {
    marginTop: normalizeH(12),
    marginBottom: normalizeH(12),
    backgroundColor: '#ffffff',
  },

  positionStyle: {
    marginRight: normalizeW(4),
    width: normalizeW(8),
    height: normalizeH(12)
  },
})