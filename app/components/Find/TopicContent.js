/**
 * Created by wuxingyu on 2016/12/21.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  InteractionManager,
  WebView,
} from 'react-native'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {getConversationTime} from '../../util/numberUtils'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ArticleViewer from '../common/Input/ArticleViewer'
import FollowUser from '../../components/common/FollowUser'
import {Actions} from 'react-native-router-flux'
import {activeUserId} from '../../selector/authSelector'
import * as appConfig from '../../constants/appConfig'
import shallowequal from 'shallowequal'
import Avatar from '../common/Avatar'

const BASE_PADDING_SIZE = normalizeW(12)
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height
const IMAGE_MAX_WIDTH = PAGE_WIDTH - 2 * BASE_PADDING_SIZE

export class TopicContent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props, nextProps)) {
      return true;
    }
    if (!shallowequal(this.state, nextState)) {
      return true;
    }
    return false;
  }

  renderFollowUserView(userId) {
    if (this.props.currentUserId == userId) {
      return (
        <View/>
      )
    } else {
      return (
        <FollowUser
          userId={userId}
          attentionedContainerStyle={{paddingTop:0,paddingBottom:0,paddingLeft:0,paddingRight:0,borderRadius:0}}
        />
      )
    }
  }

  renderUserIntroView() {
    let topic = this.props.topic
    
    if(this.props.isSelfTopic) {
      return null
    }

    return (
      <View style={styles.introWrapStyle}>
        <View style={{flex:1,flexDirection: 'row',alignItems:'stretch'}}>
          <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: topic.userId})}>
            <Avatar size={normalizeW(44)} src={topic.avatar}/>
          </TouchableOpacity>
          <View style={{flex: 1, justifyContent:'space-between'}}>
            <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: topic.userId})}>
              <Text numberOfLines={1} style={styles.userNameStyle}>{topic.nickname}</Text>
            </TouchableOpacity>
            <View style={styles.timeLocationStyle}>
              <Text style={styles.timeTextStyle}>
                上次登录：{topic.lastLoginDuration}
              </Text>
              <Text style={styles.timeTextStyle}>粉丝：{this.props.userFollowersTotalCount}</Text>
            </View>
          </View>
          <View style={styles.attentionStyle}>
            {this.renderFollowUserView(topic.userId)}
          </View>
        </View>
      </View>
    )
  }

  render() {
    let topic = this.props.topic
    console.log('topic:', topic)
    return (
      <View style={[styles.containerStyle, this.props.containerStyle]}>
        <View style={styles.titleContainerStyle}>
          <Text style={styles.titleStyle}>
            {this.props.topic.title}
          </Text>
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            <Image style={styles.positionStyle} resizeMode='contain' source={require("../../assets/images/writer_loaction.png")}/>
            <Text style={styles.timeTextStyle}>{topic.city ? topic.city : '未知'}</Text>
            <Text style={styles.timeTextStyle}>最近编辑  {topic.createdDate}</Text>
          </View>
        </View>
        {this.renderUserIntroView()}
        <ArticleViewer lazyHost={this.props.lazyHost} artlcleContent={JSON.parse(topic.content)} />
        <View style={{paddingTop: normalizeH(10), paddingBottom: normalizeH(10), paddingLeft: normalizeW(15), paddingRight: normalizeW(15)}}>
          <Text style={{fontSize: em(15), color: '#AAAAAA'}}>特别声明：本文为{appConfig.APP_NAME}自媒体作者上传并发布，仅代表该作者观点。{appConfig.APP_NAME}仅提供信息发布平台。</Text>
        </View>
      </View>

    )
  }
}

TopicContent.defaultProps = {
  // style
  containerStyle: {},
  numberOfValues: 3,
  topic: {
    imgGroup: undefined,
    content: undefined,
    createAt: undefined,
  },
  showCommentAndLikeButton: true,
}

const mapStateToProps = (state, ownProps) => {
  let currentUserId = activeUserId(state)
  return {
    currentUserId: currentUserId,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TopicContent)


//export
const styles = StyleSheet.create({
  body: {
    color: "#555",
    fontSize: em(16),
    textAlign: 'justify',
  },
  img: {
    // display: block,
    marginLeft: 15,
    marginRight: 15,
    resizeMode: 'cover',
    maxWidth: PAGE_WIDTH,
  },

  containerStyle: {
    flex: 1,
    backgroundColor: '#fff'
  },
  titleContainerStyle: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    alignSelf: 'center',
    width: PAGE_WIDTH,
  },
  titleStyle: {
    fontSize: 17,
    flex: 1,
    color: '#030303',
    alignItems: 'center',
    fontWeight:'bold',
    lineHeight:24,
    paddingBottom: 10,
  },
  //用户、时间、地点信息
  introWrapStyle: {
    flex: 1,
    padding: 15,
    paddingTop:10,
    paddingBottom: 10,
    backgroundColor: '#f5f5f5',
    marginTop: 15
  },
  userNameStyle: {
    flex: 1,
    fontSize: em(15),
    marginTop: 1,
    marginLeft: 10,
    color: "#4a4a4a"
  },
  attentionStyle: {
    marginRight: normalizeW(15),
  },
  timeLocationStyle: {
    marginLeft: normalizeW(11),
    marginTop: normalizeH(9),
    flexDirection: 'row'
  },
  avatarStyle: {
    height: normalizeH(44),
    width: normalizeW(44),
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