/**
 * Created by lilu on 2017/7/6.
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
import {isCommentLiked} from '../../selector/newTopicSelector'
import {isUserLogined} from '../../selector/authSelector'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {getConversationTime} from '../../util/numberUtils'
import shallowequal from 'shallowequal'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../util/ImageUtil'
import {fetchUpItem} from '../../action/newTopicAction'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TopicComment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      upCount:0,
    }
  }

  componentDidMount() {
    console.log('hahahahahahahahahah')
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        upCount:this.props.comment.upCount
      })
      // this.props.fetchTopicLikesCount({topicId: this.props.comment.objectId, upType:'topicComment'})
      // if( this.props.isLogin ) {
      //   this.props.fetchTopicIsLiked({topicId: this.props.comment.objectId, upType: 'topicComment'})
      // }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props.comment, nextProps.comment)) {
      return true;
    }
    if (!shallowequal(this.state, nextState)) {
      return true;
    }
    return false;
  }

  renderParentComment() {
    if (this.props.comment.parentCommentContent) {
      return (
        <View style={styles.parentCommentStyle}>
          <Text style={styles.parentCommentContentStyle}>
            <Text style={styles.commentUserStyle}>
              {this.props.comment.parentCommentNickname + ": "}
            </Text>
            <Text style={styles.parentCommentTextStyle}>
              {this.props.comment.parentCommentContent}
            </Text>
          </Text>
        </View>
      )
    }
  }

  successCallback() {

        this.setState({upCount:this.state.upCount+1})

  }

  onLikeCommentButton() {
    if (this.props.isLogin) {
      this.props.onLikeCommentButton({
        comment: this.props.comment,
        isLiked: this.props.isLiked,
        success: this.successCallback.bind(this)
      })
    }
    else{
      Actions.LOGIN()
    }
  }

  render() {
    let comment = this.props.comment
    console.log('comment====>',comment)
    if (!comment) {
      return <View/>
    }
    return (
      <View style={[styles.containerStyle, this.props.containerStyle]}>

        <View style={styles.avatarViewStyle}>
          <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: comment.authorId})}>
            <CachedImage mutable style={styles.avatarStyle}
                         source={comment.authorAvatar ? {uri: getThumbUrl(comment.authorAvatar, normalizeW(35), normalizeH(35))} : require("../../assets/images/default_portrait.png")}/>
          </TouchableOpacity>
        </View>

        <View style={styles.commentContainerStyle}>

          <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: comment.authorId})}>
            <Text style={styles.userNameStyle}>{comment.authorNickname}</Text>
          </TouchableOpacity>

          {this.renderParentComment()}

          <Text style={styles.contentStyle}>
            {comment.content}
          </Text>

          <View style={styles.timeLocationStyle}>
            <Text style={styles.timeTextStyle}>{getConversationTime(new Date(comment.createdAt))}</Text>
            <Image style={styles.positionStyle} resizeMode='contain' source={require("../../assets/images/writer_loaction.png")}/>
            <Text style={styles.timeTextStyle}>{comment.city? comment.city:"未知"}</Text>
            <TouchableOpacity style={styles.likeStyle} onPress={()=>this.onLikeCommentButton()}>
              <Image style={styles.likeImageStyle}
                     resizeMode='contain'
                     source={this.props.isLiked ?
                       require("../../assets/images/like_selected.png") :
                       require("../../assets/images/like_unselect.png")}/>
              <Text style={styles.commentTextStyle}>{this.state.upCount?this.state.upCount:0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commentStyle} onPress={()=> {
              this.props.onCommentButton(comment)
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
  const isLiked = isCommentLiked(state, ownProps.comment.commentId)
  const isLogin = isUserLogined(state)
  return {
    isLiked: isLiked,
    isLogin:isLogin,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUpItem
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