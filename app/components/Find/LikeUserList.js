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
import Header from '../common/Header'
import CommonListView from '../common/CommonListView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {Actions} from 'react-native-router-flux'
import {getConversationTime} from '../../util/numberUtils'
import FollowUser from '../../components/common/FollowUser'
import {
  fetchTopicLikeUsers,
  fetchTopicLikesCount
} from '../../action/topicActions'
import {getTopicLikeUsers, getTopicLikedTotalCount} from '../../selector/topicSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class LikeUserList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }

    this.topicLikeUsersCount = props.topicLikeUsersCount
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicLikesCount({
        topicId: this.props.topicId,
        upType: 'topic',
        success: (likesTotalCount) => {
          this.topicLikeUsersCount = likesTotalCount
        }
      })
      this.refreshData()
    })
  }

  renderTopicItem(value, key) {
    return (
      <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: value.userId})} key={key} style={{borderBottomWidth: normalizeBorder(), borderColor: '#e5e5e5',}}>
        <View style={styles.introWrapStyle}>
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            <View>
              <Image style={styles.avatarStyle}
                     source={value.avatar ? {uri: value.avatar} : require("../../assets/images/default_portrait.png")}/>
            </View>
            <View style={{flex:1, marginLeft:10}}>
              <View>
                <Text style={styles.userNameStyle}>{value.nickname}</Text>
              </View>
              <View style={styles.timeLocationStyle}>
                <Text style={styles.timeTextStyle}>
                  {getConversationTime(value.createdAt.valueOf())}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  refreshData() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    if(this.isQuering) {
      return
    }
    this.isQuering = true

    let lastCreatedAt = this.props.lastCreatedAt

    let payload = {
      topicId: this.props.topicId,
      isRefresh: !!isRefresh,
      lastCreatedAt: lastCreatedAt,
      success: (resLen) => {
        this.isQuering = false
        if(!this.listView) {
          return
        }

        // if(isEmpty) {
        //   this.listView.isLoadUp(false)
        // }else{
        //   this.listView.isLoadUp(true)
        // }

        let topicLikeUsers = this.props.topicLikeUsers
        let topicLikeUsersLen = topicLikeUsers ? topicLikeUsers.length : 0
        let totalFetchedLen = resLen + topicLikeUsersLen

        // console.log('resLen===', resLen)

        if(resLen) {
          if(this.topicLikeUsersCount) {
            if(this.topicLikeUsersCount <= totalFetchedLen) {
              this.listView.isLoadUp(false)
            }else {
              if(isRefresh) {
                this.loadMoreData()
              }
            }
          }else {
            this.props.fetchTopicLikesCount({
              topicId: this.props.topicId,
              success: (likesTotalCount) => {
                this.topicLikeUsersCount = likesTotalCount
                if(this.topicLikeUsersCount <= totalFetchedLen) {
                  this.listView.isLoadUp(false)
                }else {
                  if(isRefresh) {
                    this.loadMoreData()
                  }
                }
              }
            })
          }
        }else{
          this.listView.isLoadUp(false)
        }
      },
      error: (err)=>{
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }

    this.props.fetchTopicLikeUsers(payload)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="点赞的邻友"
          rightType="none"
        />
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={styles.itemLayout}
            dataSource={this.props.ds}
            renderRow={(rowData, rowId) => this.renderTopicItem(rowData, rowId)}
            loadNewData={()=> {
              this.refreshData()
            }}
            loadMoreData={()=> {
              this.loadMoreData()
            }}
            ref={(listView) => this.listView = listView}
          />
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

  const topicLikeUsers = getTopicLikeUsers(state, ownProps.topicId)

  const topicLikeUsersLen = topicLikeUsers ? topicLikeUsers.length : 0
  const topicLikeUsersCount = getTopicLikedTotalCount(state, ownProps.topicId)

  let lastCreatedAt = ''
  if(topicLikeUsers && topicLikeUsers.length) {
    lastCreatedAt = topicLikeUsers[topicLikeUsers.length-1].createdAt
  }

  return {
    ds: ds.cloneWithRows(topicLikeUsers),
    topicLikeUsers: topicLikeUsers,
    lastCreatedAt: lastCreatedAt,
    topicLikeUsersCount: topicLikeUsersCount,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopicLikeUsers,
  fetchTopicLikesCount
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LikeUserList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
  },
  buttonImage: {
    position: 'absolute',
    alignItems: 'flex-end',
    right: 20,
    bottom: 61,
    height: 45,
    width: 45
  },
  body: {
    backgroundColor: '#ffffff',
    marginTop: normalizeH(65),
  },
  itemLayout: {
    width: PAGE_WIDTH,
    backgroundColor: '#ffffff',
  },


  //用户、时间、地点信息
  introWrapStyle: {
    marginTop: normalizeH(12),
    marginBottom: normalizeH(12),
    backgroundColor: '#ffffff',
  },
  userNameStyle: {
    fontSize: em(15),
    marginTop: 1,
    color: "#4a4a4a"
  },
  attentionStyle: {
    position: "absolute",
    right: normalizeW(10),
    top: normalizeH(6),
  },
  timeLocationStyle: {
    marginTop: normalizeH(9),
    flexDirection: 'row'
  },
  avatarStyle: {
    height: normalizeH(44),
    width: normalizeW(44),
    marginLeft: normalizeW(12),
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeTextStyle: {
    marginRight: normalizeW(26),
    fontSize: em(12),
    color: THEME.colors.lighter
  },
  positionStyle: {
    marginRight: normalizeW(4),
    width: normalizeW(8),
    height: normalizeH(12)
  },
})