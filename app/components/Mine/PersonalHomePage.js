/**
 * Created by zachary on 2016/12/13.
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
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import CommonListView from '../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import {getUserInfoById, fetchOtherUserFollowers, fetchOtherUserFollowersTotalCount, followUser, unFollowUser,fetchUserFollowees, userIsFollowedTheUser} from '../../action/authActions'
import {fetchUserOwnedShopInfo} from '../../action/shopAction'
import {selectUserTopics, selectUserTopicsTotalCount} from '../../selector/topicSelector'
import {fetchTopicsByUserid, fetchUserTopicsTotalCount} from '../../action/topicActions'
import Icon from 'react-native-vector-icons/Ionicons'
import * as authSelector from '../../selector/authSelector'
import {selectUserOwnedShopInfo} from '../../selector/shopSelector'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import FollowUser from '../common/FollowUser'
import MyTopicShow from './MyTopic/MyTopicShow'
import * as Utils from '../../util/Utils'
import * as AVUtils from '../../util/AVUtils'
import {getPromoterById, activePromoter, selectPromoterByUserId} from '../../selector/promoterSelector'
import {getPromoterByUserId} from '../../action/promoterAction'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class PersonalHomePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userIsFollowedTheUser: false
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.userIsFollowedTheUser({
        userId: this.props.userId,
        success: (result)=>{
          this.setState({
            userIsFollowedTheUser: result
          })
        }
      })

      this.props.getUserInfoById({userId: this.props.userId})
      // // this.props.fetchUserOwnedShopInfo({userId: this.props.userId})
      this.props.fetchOtherUserFollowers({userId: this.props.userId})
      this.props.fetchOtherUserFollowersTotalCount({userId: this.props.userId})
      this.props.fetchUserTopicsTotalCount({userId: this.props.userId})
      this.props.getPromoterByUserId({userId: this.props.userId})
      // this.props.fetchUserFollowees()
      this.refreshData()

    })
  }

  componentWillReceiveProps(nextProps) {

  }

  sendPrivateMessage() {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else {
      if(!this.state.userIsFollowedTheUser) {
        Toast.show('只有关注了才能发私信哦!!')
        return
      }
      let payload = {
        name: this.props.userInfo.phone,
        members: [this.props.currentUser, this.props.userInfo.id],
        conversationType: PERSONAL_CONVERSATION,
        title: this.props.userInfo.nickname,
      }
      Actions.CHATROOM(payload)
    }
  }
  
  renderRow(rowData, sectionId, rowId) {
    switch (rowData.type) {
      case 'PERSONAL_INFO_COLUMN':
        return this.renderPersonalInfoColumn()
      case 'TOPICS_COLUMN':
        return this.renderTopicsColumn()
      default:
        return <View />
    }
  }

  renderUserFollowers() {
    let userFollowers = this.props.userFollowers
    let userFollowersTotalCount = this.props.userFollowersTotalCount
    // userFollowersTotalCount = 5
    // userFollowers = [{},{},{},{},{}]
    // console.log('shopFollowersTotalCount====', shopFollowersTotalCount)
    // console.log('shopFollowers====', shopFollowers)
    if(userFollowersTotalCount) {
      let shopFollowersView = userFollowers.map((item, index)=>{
        if(index > 2) {
          return null
        }
        let source = require('../../assets/images/default_portrait.png')
        if(item.avatar) {
          source = {uri: item.avatar}
        }

        return (
          <Image
            key={'user_follower_' + index}
            style={{width:20,height:20,marginRight:5,borderRadius:10}}
            source={source}
          />
        )
      })
      return (
        <View style={{flexDirection:'row',alignItems:'center'}}>
          {shopFollowersView}
          <Icon
            name="ios-arrow-forward"
            style={{marginLeft:6,color:'#f5f5f5',fontSize:17}}/>
        </View>
      )
    }
    return (
      <Text style={{color:'#8f8e94'}}>暂无粉丝!</Text>
    )
  }

  renderPersonalInfoColumn() {
    let userInfo = this.props.userInfo
    let distance = this.props.distance
    let distanceUnit = this.props.distanceUnit
    let promoter = this.props.promoter
    let avatar = require('../../assets/images/default_portrait.png')
    if(userInfo.avatar) {
      avatar = {uri: this.props.userInfo.avatar}
    }
    let genderIcon = require('../../assets/images/male.png')
    if(userInfo.gender == 'female') {
      genderIcon = require('../../assets/images/female.png')
    }

    let promoterLevelInfo = null
    if(promoter) {
      promoterLevelInfo = AVUtils.getPromoterLevelInfo(promoter.level)
    }
    
    return (
      <View style={styles.personalInfoContainer}>
        <View style={styles.personalInfoWrap}>
          <Image style={styles.avatarImg} source={avatar}/>
          <View style={styles.row}>
            <Text style={styles.nickname}>{userInfo.nickname}</Text>
            <Image style={styles.sexImg} source={genderIcon} />
          </View>
          {userInfo.geoCity 
            ?  <View style={styles.row}>
                <Text style={styles.address}>{userInfo.geoCity + ' ' + (userInfo.geoDistrict || '')}</Text>
                {distance
                  ? <Text style={styles.distance}>{'距我' + distance + distanceUnit}</Text>
                  : null
                }
              </View>
            : null
          }
          {promoterLevelInfo &&
            <View style={styles.promoterLevelBox}>
              <Image style={styles.promoterLevelIcon} source={promoterLevelInfo.levelMainIcon} />
              <Text style={styles.promoterLevelName}>{promoterLevelInfo.levelName + '推广员'}</Text>
            </View>
          }
        </View>

        <TouchableWithoutFeedback onPress={()=>{}}>
          <View style={styles.followersWrap}>
            <View style={{flexDirection:'row'}}>
              <View style={styles.titleLine}/>
              <Text style={styles.titleTxt}>粉丝·{this.props.userFollowersTotalCount}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              {this.renderUserFollowers()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderTopicsColumn() {
    let topicShowView = <View />
    if(this.props.userTopics && this.props.userTopics.length) {
      topicShowView = this.props.userTopics.map((item, index) =>{
        return (
          <MyTopicShow
            key={index}
            containerStyle={{
              borderBottomWidth: normalizeBorder(),
              borderBottomColor: '#f5f5f5'
            }}
            topic={item}
          />
        )
      })
    }

    return (
      <View style={styles.topicsWrap}>
        <View style={styles.titleWrap}>
          <View style={styles.titleLine}/>
          <Text style={styles.titleTxt}>发布话题·{this.props.userTopicsTotalCount}</Text>
        </View>
        {topicShowView}
      </View>
    )
  }

  refreshData() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    let lastCreatedAt = undefined
    if(!isRefresh) {
      if(this.props.userTopics && this.props.userTopics.length){
        lastCreatedAt = this.props.userTopics[this.props.userTopics.length-1].createdAt
      }else {
        this.listView.isLoadUp(false)
        return
      }
    }

    let payload = {
      type: "userTopics",
      userId: this.props.userId,
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
    this.props.fetchTopicsByUserid(payload)
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => {
            AVUtils.pop({
              backSceneName: this.props.backSceneName,
              backSceneParams: this.props.backSceneParams
            })
          }}
          rightType="none"
          headerContainerStyle={{borderBottomWidth:0}}
        />
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={{backgroundColor: 'rgba(0,0,0,0.05)'}}
            dataSource={this.props.ds}
            renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, sectionId, rowId)}
            loadNewData={()=>{this.refreshData()}}
            loadMoreData={()=>{this.loadMoreData()}}
            ref={(listView) => this.listView = listView}
          />
        </View>

        {this.renderBottomView()}
      </View>  
    )
  }

  renderBottomView() {
    let userIsFollowedTheUser = this.state.userIsFollowedTheUser
    let userOwnedShopInfo = this.props.userOwnedShopInfo

    return (
      <View style={styles.bottomViewWrap}>
        {userIsFollowedTheUser
          ? <TouchableOpacity style={[styles.bottomViewItemBox]} onPress={()=>{this.unFollowUser(this.props.userId)}}>
              <View style={[styles.vItem]}>
                <Image style={styles.followImg} source={require('../../assets/images/followed.png')}/>
              </View>
            </TouchableOpacity>
          : <TouchableOpacity style={[styles.bottomViewItemBox]} onPress={()=>{this.followUser(this.props.userId)}}>
              <View style={[styles.vItem]}>
                <Image style={styles.followImg} source={require('../../assets/images/add_follow.png')}/>
              </View>
            </TouchableOpacity>  
        }

        <TouchableOpacity style={[styles.bottomViewItemBox]} onPress={()=>{Actions.SHOP_DETAIL({id: userOwnedShopInfo.id})}}>
          <View style={[styles.vItem]}>
            <Image style={{}} source={require('../../assets/images/shop_24_personal.png')}/>
            <Text style={[styles.vItemTxt, {color:'#FF7819'}]}>个人店铺</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.bottomViewItemBox]}></View>

        <TouchableOpacity style={[styles.contactedWrap]} onPress={() => this.sendPrivateMessage()}>
          <Image style={{}} source={require('../../assets/images/contacted.png')}/>
          <Text style={[styles.contactedTxt]}>私信</Text>
        </TouchableOpacity>
      </View>
    )
  }

  sendPrivateMessage() {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else {
      let userInfo = this.props.userInfo
      let activeUserInfo = this.props.activeUserInfo
      let payload = {
        name: userInfo.nickname,
        members: [this.props.userId, activeUserInfo.id],
        conversationType: PERSONAL_CONVERSATION,
        title: userInfo.nickname,
      }
      Actions.CHATROOM(payload)
    }
  }

  followUser(userId) {
    if(this.isProcessing) {
      return
    }
    this.isProcessing = true
    if(!this.props.isLogin) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      userId: userId,
      success: function(result) {
        that.isProcessing = false
        that.setState({
          userIsFollowedTheUser: true
        })
        // that.props.fetchUserFollowees()
        Toast.show(result.message, {duration: 1500})
      },
      error: function(error) {
        that.isProcessing = false
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.followUser(payload)
  }

  unFollowUser(userId) {
    if(this.isProcessing) {
      return
    }
    this.isProcessing = true
    if(!this.props.isLogin) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      userId: userId,
      success: function(result) {
        that.isProcessing = false
        that.setState({
          userIsFollowedTheUser: false
        })
        // that.props.fetchUserFollowees()
        Toast.show(result.message, {duration: 1500})
      },
      error: function(error) {
        that.isProcessing = false
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.unFollowUser(payload)
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
  dataArray.push({type: 'PERSONAL_INFO_COLUMN'})
  dataArray.push({type: 'TOPICS_COLUMN'})

  const isLogin = authSelector.isUserLogined(state)
  const userInfo = authSelector.selectUserInfoById(state, ownProps.userId)
  const activeUserInfo = authSelector.selectActiveUserInfo(state)
  let distance = undefined
  let distanceUnit = 'km'
  if(userInfo.geo && activeUserInfo.geo) {
    distance = activeUserInfo.geo.kilometersTo(userInfo.geo)
    if(distance > 1) {
      distance = Number(distance).toFixed(1)
    }else {
      distance = Number(distance * 1000).toFixed(0)
      distanceUnit = 'm'
    }
  }
  // console.log('userInfo===', userInfo)
  // console.log('activeUserInfo===', activeUserInfo)
  const userOwnedShopInfo = selectUserOwnedShopInfo(state, ownProps.userId)
  const userFollowers = authSelector.selectUserFollowers(state, ownProps.userId)
  const userFollowersTotalCount = authSelector.selectUserFollowersTotalCount(state, ownProps.userId)

  const userFollowees = authSelector.selectUserFollowees(state)

  const userTopics = selectUserTopics(state, ownProps.userId)
  const userTopicsTotalCount = selectUserTopicsTotalCount(state, ownProps.userId)

  // let promoterId = activePromoter(state)
  // let promoter = getPromoterById(state, promoterId)
  let promoter = selectPromoterByUserId(state, ownProps.userId)
  // console.log('promoter=====', promoter)

  return {
    ds: ds.cloneWithRows(dataArray),
    isLogin: isLogin,
    currentUser: authSelector.activeUserId(state),
    userInfo: userInfo,
    activeUserInfo: activeUserInfo,
    userFollowers: userFollowers,
    userFollowersTotalCount: userFollowersTotalCount,
    userOwnedShopInfo: userOwnedShopInfo,
    userTopics: userTopics,
    userTopicsTotalCount: userTopicsTotalCount,
    distance: distance,
    distanceUnit: distanceUnit,
    promoter: promoter,
    userFollowees: userFollowees,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopicsByUserid,
  fetchUserTopicsTotalCount,
  fetchOtherUserFollowers,
  fetchOtherUserFollowersTotalCount,
  getUserInfoById,
  fetchUserOwnedShopInfo,
  followUser, 
  unFollowUser, 
  fetchUserFollowees,
  userIsFollowedTheUser,
  getPromoterByUserId
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PersonalHomePage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
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
  personalInfoContainer: {

  },
  personalInfoWrap: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'white',
    padding:15,
    paddingTop: 0,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#f5f5f5'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10
  },
  avatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12
  },
  nickname: {
    fontSize: 17,
    color: '#4a4a4a',
  },
  sexImg:{
    marginLeft: 8
  },
  address: {
    fontSize: 12,
    color: '#9b9b9b'
  },
  distance: {
    fontSize: 12,
    color: '#9b9b9b',
    marginLeft: 8
  },
  promoterLevelBox: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100
  },
  promoterLevelIcon: {
    marginRight: 10
  },
  promoterLevelName: {
    fontSize: 12,
    color: '#9b9b9b'
  },
  followersWrap: {
    flex:1,
    flexDirection:'row',
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor:'white',
    justifyContent: 'space-between',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  titleWrap: {
    flex:1,
    flexDirection:'row',
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor:'white',
  },
  titleLine: {
    width: 3,
    backgroundColor: '#ff7819',
    marginRight: 5,
  },
  titleTxt: {
    color: '#FF7819',
    fontSize: em(15)
  },
  bottomViewWrap: {
    position:'absolute',
    left:0,
    bottom:0,
    borderTopWidth:normalizeBorder(),
    borderTopColor: THEME.colors.lighterA,
    backgroundColor:'#fafafa',
    flexDirection:'row',
  },
  vItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 3,
    justifyContent: 'center',
  },
  vItemTxt: {
    marginTop: 6,
    fontSize: em(10),
    color: '#aaa'
  },
  bottomViewItemBox: {
    flex: 1,
  },
  contactedWrap: {
    width: normalizeW(135),
    backgroundColor: '#FF9D4E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactedTxt: {
    color: 'white',
    fontSize: em(15),
    marginLeft: normalizeW(9)
  },
  followImg: {
    width:50,
    height:45
  }

})