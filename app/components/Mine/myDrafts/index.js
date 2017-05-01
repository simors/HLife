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
import {getMyTopicDrafts, getMyShopPromotionDrafts} from '../../../selector/draftSelector'
// import {fetchTopics} from '../../../action/topicActions'
// import CommonListView from '../../common/CommonListView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import TopicDraftShow from './topicDraftShow'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import {Actions} from 'react-native-router-flux'
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view'
import {fetchTopicDraft, handleDestroyTopicDraft, handleDestroyShopPromotionDraft} from '../../../action/draftAction'
import THEME from '../../../constants/themes/theme1'
import ShopPromotionDraftShow from './shopPromotionDraftShow'
import Popup from '@zzzkk2009/react-native-popup'
import * as Toast from '../../../components/common/Toast'
import * as authSelector from '../../../selector/authSelector'
import {IDENTITY_SHOPKEEPER} from '../../../constants/appConfig'

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

  clearTopic(rowId) {
    Popup.confirm({
      title: '提示',
      content: '确认删除草稿？',
      ok: {
        text: '确定',
        style: {color: THEME.base.mainColor},
        callback: ()=> {
          this.delectDraft(rowId)
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

  clearShopPromotion(rowId) {
    Popup.confirm({
      title: '提示',
      content: '确认删除草稿？',
      ok: {
        text: '确定',
        style: {color: THEME.base.mainColor},
        callback: ()=> {
          this.delectShopDraft(rowId)
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

  delectDraft(rowId) {
    this.props.handleDestroyTopicDraft({id: rowId})
  }

  delectShopDraft(rowId) {
    this.props.handleDestroyShopPromotionDraft({id: rowId})
  }

  renderShopPromotionItem(value, key, rowId) {
    // console.log('valeu',value,rowId)
    return (
      <SwipeRow style={{flex: 1, width: PAGE_WIDTH}}
                disableRightSwipe={true}
                leftOpenValue={20 + parseInt(rowId) * 5}
                rightOpenValue={-normalizeW(75)}>

        <TouchableHighlight onPress={()=> {
          this.clearShopPromotion(rowId)
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
        <View style={{flex: 1}}>

          <ShopPromotionDraftShow key={rowId}
                                  shopPromotion={value}
          >

          </ShopPromotionDraftShow>
        </View >

      </SwipeRow>
    )
  }

  renderTopicItem(value, key, rowId) {
    // console.log('valeu',value,rowId)
    return (
      <SwipeRow style={{flex: 1, width: PAGE_WIDTH}}
                disableRightSwipe={true}
                leftOpenValue={20 + parseInt(rowId) * 5}
                rightOpenValue={-normalizeW(75)}>

        <TouchableHighlight onPress={()=> {
          this.clearTopic(rowId)
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
        <View style={{flex: 1}}>
          <TopicDraftShow key={rowId}
                          containerStyle={{borderBottomWidth: 1, borderColor: '#F5F5F5'}}
                          topic={value}
                          commentButtonPress={()=> {
                            Actions.TOPIC_EDIT({topic: value})
                          }}
          />
          {/*<Text>Row front | </Text>*/}
        </View>

      </SwipeRow>
    )
  }

  toggleTab(type) {
    this.setState({tabType: type}, ()=> {
      if (0 == type) {
        this.renderTopicList()
      } else if (1 == type) {
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
  renderTopicList() {
    return (

      <SwipeListView
        dataSource={this.props.dataSrc}
        renderRow={(data, key, rowId) => (this.renderTopicItem(data, key, rowId))}

        leftOpenValue={75}
        rightOpenValue={-75}
        enableEmptySections={true}
      />
    )
  }

  renderShopList() {
    return (
      <SwipeListView
        dataSource={this.props.shopDataSrc}
        renderRow={(data, key, rowId) => (this.renderShopPromotionItem(data, key, rowId))}

        leftOpenValue={75}
        rightOpenValue={-75}
        enableEmptySections={true}
      />
    )
  }

  renderTabBar() {
    let identity=this.props.identity
    if (identity && identity.includes(IDENTITY_SHOPKEEPER)) {
      return (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={()=> {
              this.toggleTab(0)
            }}>
            <View style={[{
              width: normalizeW(100),
              height: normalizeH(44),
              justifyContent: 'flex-end',
              alignItems: 'center'
            },
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
            <View style={[{
              width: normalizeW(100),
              height: normalizeH(44),
              justifyContent: 'flex-end',
              alignItems: 'center'
            },
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
      )
    } else {
      return <View/>
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<StatusBar barStyle="light-content"/>*/}
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
          {this.renderTabBar()}
          {this.state.tabType == 0 ? this.renderTopicList() : this.renderShopList()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  const userId = authSelector.activeUserId(state)
  const identity = authSelector.getUserIdentity(state, userId)
  const topics = getMyTopicDrafts(state)
  const shopPromotions = getMyShopPromotionDrafts(state)

  // let topicArr = []
  // for (let key in topics) {
  //   if(topics[key].userId!=userId){
  //     delete topics[key]
  //   }
  // }
  // for (let key in shopPromotions) {
  //
  //   if(shopPromotions[key].userId!=userId){
  //     delete shopPromotions[key]
  //   }
  // }

  return {
    shopDataSrc: ds.cloneWithRows(shopPromotions),
    dataSrc: ds.cloneWithRows(topics),
    // dataSrc: ds.cloneWithRows(topics),
    identity:identity,
    topics: topics,
  }

}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  // fetchTopics,
  handleDestroyTopicDraft,
  handleDestroyShopPromotionDraft,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyTopic)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  body: {
    marginTop: normalizeH(64),
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