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
  InteractionManager
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {getTopicLikedTotalCount, isTopicLiked} from '../../selector/topicSelector'
import {isUserLogined} from '../../selector/authSelector'
import {fetchTopicLikesCount, fetchTopicIsLiked} from '../../action/topicActions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {getConversationTime} from '../../util/numberUtils'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TopicComment extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicLikesCount({topicId: this.props.topic.objectId, upType:'topicComment'})
      if( this.props.isLogin ) {
        this.props.fetchTopicIsLiked({topicId: this.props.topic.objectId, upType: 'topicComment'})
      }
    })
  }

  renderParentComment() {
    if (this.props.topic.parentCommentContent) {
      return (
        <View style={styles.parentCommentStyle}>
          <Text style={styles.parentCommentContentStyle}>
            <Text style={styles.commentUserStyle}>
              {this.props.topic.parentCommentUser + ": "}
            </Text>
            <Text style={styles.parentCommentTextStyle}>
              {this.props.topic.parentCommentContent}
            </Text>
          </Text>
        </View>
      )
    }
  }

  successCallback() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicLikesCount({topicId: this.props.topic.objectId, upType:'topicComment'})
      this.props.fetchTopicIsLiked({topicId: this.props.topic.objectId, upType:'topicComment'})
    })
  }

  onLikeCommentButton() {
    if (this.props.isLogin) {
      this.props.onLikeCommentButton({
        topic: this.props.topic,
        isLiked: this.props.isLiked,
        success: this.successCallback.bind(this)
      })
    }
    else{
      Actions.LOGIN()
    }
  }

  render() {
    return (
      <View style={[styles.containerStyle, this.props.containerStyle]}>

        <View style={styles.avatarViewStyle}>
          <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: this.props.topic.userId})}>
            <Image style={styles.avatarStyle}
                   source={this.props.topic.avatar ? {uri: this.props.topic.avatar} : require("../../assets/images/default_portrait.png")}/>
          </TouchableOpacity>
        </View>

        <View style={styles.commentContainerStyle}>

          <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: this.props.topic.userId})}>
            <Text style={styles.userNameStyle}>{this.props.topic.nickname}</Text>
          </TouchableOpacity>

          {this.renderParentComment()}

          <Text style={styles.contentStyle}>
            {this.props.topic.content}
          </Text>

          <View style={styles.timeLocationStyle}>
            <Text style={styles.timeTextStyle}>{getConversationTime(this.props.topic.createdAt)}</Text>
            <Image style={styles.positionStyle} resizeMode='contain' source={require("../../assets/images/writer_loaction.png")}/>
            <Text style={styles.timeTextStyle}>{this.props.topic.position? this.props.topic.position.city:"未知"}</Text>
            <TouchableOpacity style={styles.likeStyle} onPress={()=>this.onLikeCommentButton()}>
              <Image style={styles.likeImageStyle}
                     resizeMode='contain'
                     source={this.props.isLiked ?
                       require("../../assets/images/like_selected.png") :
                       require("../../assets/images/like_unselect.png")}/>
              <Text style={styles.commentTextStyle}>{this.props.likesCount?this.props.likesCount:0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commentStyle} onPress={()=> {
              this.props.onCommentButton(this.props.topic)
            }}>
              <Image style={styles.commentImageStyle} resizeMode='contain' source={require("../../assets/images/comments_unselect.png")}/>
              <Text style={styles.commentTextStyle}>回复</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>

    )
  }
}

TopicComment.defaultProps = {
  // style
  containerStyle: {},
  numberOfValues: 3,
  topic: {
    nickname: "鱼爱上猫",
    imgGroup: undefined,
    content: "一起去农村盖豪宅",
    createAt: undefined,
    topic: undefined,
  },
}

const mapStateToProps = (state, ownProps) => {
  const likesCount = getTopicLikedTotalCount(state, ownProps.topic.objectId)
  const isLiked = isTopicLiked(state, ownProps.topic.objectId)
  const isLogin = isUserLogined(state)
  return {
    likesCount: likesCount,
    isLiked: isLiked,
    isLogin:isLogin,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopicLikesCount,
  fetchTopicIsLiked
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TopicComment)

//export
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: PAGE_WIDTH,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  commentUserStyle: {
    fontSize: em(15),
    color: "#ff7819"
  },
  avatarViewStyle: {
    width: normalizeW(57),
  },
  avatarStyle: {
    height: normalizeH(35),
    width: normalizeW(35),
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: 'transparent',
    marginTop: normalizeH(10),
    marginLeft: normalizeW(12),
  },

  parentCommentStyle: {
    width: normalizeW(300),
    backgroundColor: '#f2f2f2',
    marginRight: 8,
    marginTop: normalizeH(10),
  },

  parentCommentContentStyle: {
    marginBottom: normalizeH(8),
    marginTop: normalizeH(7),
    marginLeft: normalizeW(5),
    marginRight: normalizeW(4),
  },
  commentContainerStyle: {
    width: normalizeW(318),
  },
  userNameStyle: {
    fontSize: em(15),
    marginTop: normalizeH(10),
    color: "#ff7819"
  },
  parentCommentTextStyle: {
    color: '#000000',
    letterSpacing: 0.15,
    lineHeight: 20
  },
  contentStyle: {
    fontSize: em(17),
    lineHeight: 20,
    paddingTop: normalizeH(10),
    paddingRight: normalizeW(8),
    color: "#4a4a4a"
  },
  likeStyle: {
    position: 'absolute',
    left: normalizeW(189),
    backgroundColor: '#FFFFFF',
    height: normalizeH(16),
    alignItems: 'center',
    flexDirection: 'row',
  },
  likeImageStyle: {
    height: normalizeW(16),
    width: normalizeH(18),
    marginRight: 3,
    resizeMode:'stretch'
  },
  commentImageStyle: {
    height: normalizeH(16),
    width: normalizeW(16),
    marginRight: 3,
    resizeMode:'stretch'
  },
  commentTextStyle: {
    fontSize: em(12),
    letterSpacing: 0.14,
    color: THEME.colors.lighter
  },
  commentStyle: {
    position: 'absolute',
    left: normalizeW(259),
    backgroundColor: '#FFFFFF',
    height: normalizeH(16),
    alignItems: 'center',
    flexDirection: 'row',
  },
  attentionStyle: {
    position: "absolute",
    right: normalizeW(10),
    top: normalizeH(6),
    width: normalizeW(56),
    height: normalizeH(25)
  },
  timeLocationStyle: {
    marginTop: normalizeH(14),
    marginBottom: normalizeH(15),
    flexDirection: 'row',
    alignItems: 'center',
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