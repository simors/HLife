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
import {getUserInfoById, fetchOtherUserFollowers, fetchOtherUserFollowersTotalCount} from '../../action/authActions'
import {fetchUserOwnedShopInfo} from '../../action/shopAction'
import {selectUserTopics} from '../../selector/topicSelector'
import {fetchTopicsByUserid} from '../../action/topicActions'
import Icon from 'react-native-vector-icons/Ionicons'
import * as authSelector from '../../selector/authSelector'
import {selectUserOwnedShopInfo} from '../../selector/shopSelector'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import FollowUser from '../common/FollowUser'
import {getDoctorInfoByUserId} from '../../selector/doctorSelector'
import {fetchDoctorByUserId} from '../../action/doctorAction'
import MyTopicShow from './MyTopic/MyTopicShow'
import * as Utils from '../../util/Utils'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class PersonalHomePage extends Component {
  constructor(props) {
    super(props)

    this.replyInput = null
    
    this.state = {

    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      if(this.props.isLogin) {
        this.props.fetchUserOwnedShopInfo({userId: this.props.userId})
        this.props.fetchOtherUserFollowers({userId: this.props.userId})
        this.props.fetchOtherUserFollowersTotalCount({userId: this.props.userId})
        this.props.getUserInfoById({userId: this.props.userId})
        this.props.fetchDoctorByUserId({id: this.props.userId})
        this.refreshData()
      }else {
        Actions.LOGIN()
      }
    })
  }

  componentWillReceiveProps(nextProps) {

  }

  sendPrivateMessage() {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else {
      let isFollowed = Utils.userIsFollowedTheUser(this.props.userId, this.props.userFollowees)
      if(!isFollowed) {
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

  onUserDoctorClick() {
    if(this.props.doctorInfo) {

    }else {
      Toast.show('该用户还不是医生')
    }
  }

  onUserShopClick() {
    if(this.props.userOwnedShopInfo.id) {
      Actions.SHOP_DETAIL({id: this.props.userOwnedShopInfo.id})
    }else {
      Toast.show('该用户暂未注册店铺')
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

  renderRowFollowers(userFollowers, rowIndex, totalCount) {
    let followersView = userFollowers.map((item, index)=>{
      if(totalCount && userFollowers.length == (index + 1)) {
        // console.log('renderRowFollowers.totalCount===', totalCount)
        return (
          <View key={"follower_totalCount"} style={styles.followersTotalCountWrap}>
            <Text style={styles.followersTotalCountTxt}>{totalCount > 99 ? '99+' : totalCount}</Text>
          </View>
        )
      }

      let source = require('../../assets/images/default_portrait.png')
      if(item.avatar) {
        source = {uri: item.avatar}
      }
      return (
        <View
          key={"follower_" + (8 * (rowIndex-1) + index)}
          style={styles.attentionAvatar}
        >
          <Image
            style={styles.attentionAvatarImg}
            source={source}
          />
        </View>
      )
    })

    return (
      <View key={"follower_row_" + rowIndex} style={styles.attentionAvatarWrap}>
        {followersView}
      </View>
    )
  }

  renderFollowers() {
    if(this.props.userFollowers && this.props.userFollowers.length) {
      if(this.props.userFollowers.length <= 8) {
        return this.renderRowFollowers(this.props.userFollowers, 1)
      }else if (this.props.userFollowers.length <= 16) {
        let multiRow = []
        multiRow.push(this.renderRowFollowers(this.props.userFollowers.slice(0, 8), 1))
        multiRow.push(this.renderRowFollowers(this.props.userFollowers.slice(8), 2))
        return multiRow
      }else if (this.props.userFollowers.length <= 24) {
        let multiRow = []
        multiRow.push(this.renderRowFollowers(this.props.userFollowers.slice(0, 8), 1))
        multiRow.push(this.renderRowFollowers(this.props.userFollowers.slice(8, 16), 2))
        multiRow.push(this.renderRowFollowers(this.props.userFollowers.slice(16), 3))
        return multiRow
      }else {
        let multiRow = []
        multiRow.push(this.renderRowFollowers(this.props.userFollowers.slice(0, 8), 1))
        multiRow.push(this.renderRowFollowers(this.props.userFollowers.slice(8, 16), 2))
        multiRow.push(this.renderRowFollowers(this.props.userFollowers.slice(16, 24), 3, this.props.userFollowersTotalCount))
        return multiRow
      }
    }else {
      return (
        <View style={styles.noAttentionWrap}>
          <Text style={styles.noAttentionTxt}>暂无粉丝</Text>
        </View>
      )
    }
  }

  renderNoFollow() {
    return (
      <Text style={styles.btnTxt}>关注</Text>
    )
  }

  renderFollow() {
    return (
      <Text style={styles.btnTxt}>已关注</Text>
    )
  }

  renderPersonalInfoColumn() {
    let avatar = require('../../assets/images/default_portrait.png')
    if(this.props.userInfo.avatar) {
      avatar = {uri: this.props.userInfo.avatar}
    }
    let genderIcon = require('../../assets/images/male.png')
    if(this.props.userInfo.gender == 'female') {
      genderIcon = require('../../assets/images/female.png')
    }
    
    return (
      <View style={styles.personalInfoWrap}>
        <View style={[styles.row, styles.baseInfoWrap]}>
          <View style={styles.goBackBox}>
            <TouchableOpacity onPress={()=>{Actions.pop()}}>
              <Icon
                name='ios-arrow-back'
                style={[styles.goBack]}/>
            </TouchableOpacity>
          </View>
          <View style={styles.thumbnailWrap}>
            <Image
              style={styles.avatarImg}
              source={avatar}
            />
            <View style={styles.sexNameWrap}>
              <Image
                style={styles.sexImg}
                source={genderIcon}
              />
              <Text style={styles.nickname}>{this.props.userInfo.nickname}</Text>
            </View>
          </View>
          <View style={styles.btnWrap}>
            <TouchableOpacity style={{flex:1}} onPress={() => this.toggleFollow()}>
              <View style={[styles.btnBox, styles.rightBorder]}>
                <FollowUser
                  userId={this.props.userId}
                  renderFollow={this.renderFollow.bind(this)}
                  renderNoFollow={this.renderNoFollow.bind(this)}
                  attentionedContainerStyle={{backgroundColor:'#fff'}}
                  attentionedTxtStyle={{color: THEME.colors.green, fontSize:em(17)}}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1}} onPress={() => this.sendPrivateMessage()}>
              <View style={styles.btnBox}>
                <Text style={styles.btnTxt}>发私信</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.row, styles.otherInfoWrap]}>
          <TouchableOpacity style={{flex:1}} onPress={()=>{this.onUserDoctorClick()}}>
            <View style={[styles.otherInfoBox, styles.borderBottom]}>
              <Image
                source={require('../../assets/images/doctor_small.png')}
              />
              <Text style={styles.otherInfoTxt}>医生专属</Text>
              <Icon
                name='ios-arrow-forward'
                style={[styles.arrowForward]}/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1}} onPress={()=>{this.onUserShopClick()}}>
            <View style={styles.otherInfoBox}>
              <Image
                source={require('../../assets/images/shop_small.png')}
              />
              <Text style={styles.otherInfoTxt}>个人店铺</Text>
              <Icon
                name='ios-arrow-forward'
                style={[styles.arrowForward]}/>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.row, styles.followersInfoWrap]}>
          <Text style={styles.attentionTitle}>粉丝</Text>
          {this.renderFollowers()}
        </View>

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
            containerStyle={{marginBottom: 10}}
            topic={item}
          />
        )
      })
    }

    return (
      <View style={styles.topicsWrap}>
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
        <CommonListView
          contentContainerStyle={{backgroundColor: 'rgba(0,0,0,0.05)'}}
          dataSource={this.props.ds}
          renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, sectionId, rowId)}
          loadNewData={()=>{this.refreshData()}}
          loadMoreData={()=>{this.loadMoreData()}}
          ref={(listView) => this.listView = listView}
        />
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
  dataArray.push({type: 'PERSONAL_INFO_COLUMN'})
  dataArray.push({type: 'TOPICS_COLUMN'})

  const doctorInfo = getDoctorInfoByUserId(state, ownProps.userId)
  // console.log('doctorInfo========', doctorInfo)
  const isLogin = authSelector.isUserLogined(state)
  const userInfo = authSelector.userInfoById(state, ownProps.userId)
  const userOwnedShopInfo = selectUserOwnedShopInfo(state, ownProps.userId)
  const userFollowers = authSelector.selectUserFollowers(state, ownProps.userId)
  const userFollowersTotalCount = authSelector.selectUserFollowersTotalCount(state, ownProps.userId)
  // console.log('mapStateToProps.userFollowers===', userFollowers)
  // console.log('mapStateToProps.userFollowersTotalCount===', userFollowersTotalCount)
  // const userFollowers = [
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  //   {},
  // ]
  // const userFollowersTotalCount = 200

  const userTopics = selectUserTopics(state, ownProps.userId)
  const userFollowees = authSelector.selectUserFollowees(state)

  return {
    ds: ds.cloneWithRows(dataArray),
    isLogin: isLogin,
    currentUser: authSelector.activeUserId(state),
    userInfo: userInfo,
    userFollowers: userFollowers,
    userFollowersTotalCount: userFollowersTotalCount,
    userOwnedShopInfo: userOwnedShopInfo,
    doctorInfo: doctorInfo,
    userTopics: userTopics,
    userFollowees: userFollowees
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopicsByUserid,
  fetchOtherUserFollowers,
  fetchOtherUserFollowersTotalCount,
  getUserInfoById,
  fetchUserOwnedShopInfo,
  fetchDoctorByUserId
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PersonalHomePage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  personalInfoWrap: {

  },
  goBackBox: {
    paddingLeft: 10,
    paddingTop: 10,
    marginBottom: 10
  },
  goBack: {
    fontSize: em(28),
    color: THEME.colors.green
  },
  row: {
    backgroundColor: '#fff',
    marginBottom: normalizeH(10)
  },
  baseInfoWrap: {
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },
  thumbnailWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#e6e6e6'
  },
  btnWrap: {
    flexDirection: 'row'
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10
  },
  sexNameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  sexImg: {
    marginRight: 5
  },
  nickname: {
    fontSize: em(17),
    color: '#4a4a4a'
  },
  btnBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  btnTxt: {
    fontSize: em(17),
    color: THEME.base.mainColor,
  },
  rightBorder: {
    borderRightWidth: normalizeBorder(),
    borderRightColor: '#e6e6e6'
  },
  borderBottom: {
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#e6e6e6'
  },
  otherInfoWrap: {
    backgroundColor: '#fff',
  },
  otherInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    padding: 10,
    paddingLeft: 20
  },
  otherInfoTxt: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: em(17),
    color: '#4a4a4a'
  },
  arrowForward: {
    fontSize: em(20),
    color: '#e9e9e9'
  },
  followersInfoWrap: {
    padding: 10,
    backgroundColor: '#fff',
  },
  attentionTitle: {
    fontSize: em(17),
    color: '#4a4a4a',
    marginBottom: 10,
  },
  attentionAvatarWrap: {
    flexDirection: 'row',
    marginBottom: 10
  },
  attentionAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(10),
  },
  attentionAvatarImg: {
    width: normalizeW(35),
    height: normalizeW(35),
    borderRadius: normalizeW(35/2),
  },
  noAttentionWrap: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  noAttentionTxt: {
    color: '#b2b2b2',
    fontSize: em(15),
  },
  followersTotalCountWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(10),
    width: normalizeW(35),
    height: normalizeW(35),
    borderRadius: normalizeW(35/2),
    backgroundColor: THEME.colors.green
  },
  followersTotalCountTxt: {
    color: '#fff',
    fontSize: em(15),
  },

})