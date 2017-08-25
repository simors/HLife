/**
 * Created by lilu on 2017/8/19.
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

export class ShopCommentForComment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      upCount:0,
      isLike:false
    }
  }

  componentDidMount() {
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
    if (this.props.comment.replyCommentNickname&&this.props.comment.replyCommentContent) {
      return (
        <View style={styles.parentCommentStyle}>
          <Text style={styles.parentCommentContentStyle}>
            <Text style={styles.commentUserStyle}>
              {'回复@'+this.props.comment.replyCommentNickname + ": "}
            </Text>
            <Text style={styles.parentCommentTextStyle}>
              {this.props.comment.replyCommentContent}
            </Text>
          </Text>
        </View>
      )
    }
  }

  successCallback() {

    this.setState({upCount:this.state.upCount+1,isLike:true})

  }

  onLikeCommentButton() {
    if (this.props.isLogin) {
      this.props.onLikeCommentButton({
        comment: this.props.comment,
        isLiked: this.props.isLiked,
        success: ()=>{this.successCallback()}
      })
    }
    else{
      Actions.LOGIN()
    }
  }

  render() {
    let comment = this.props.comment
    // console.log('comment====>',comment)
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

          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: comment.authorId})}>
              <Text style={styles.userNameStyle}>{comment.authorNickname}</Text>
            </TouchableOpacity>
            <View style={{justifyContent: 'flex-end'}}>
              <Text style={styles.dateName}>{comment.createdDate}</Text>
            </View>
          </View>

          {this.renderParentComment()}

          <Text style={styles.contentStyle}>
            {comment.content}
          </Text>

          <View style={styles.timeLocationStyle}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.commentTextStyle}>{'赞'+(this.state.upCount ? (this.state.upCount>999?'999+' : this.state.upCount): 0)}</Text>
              <Text style={styles.commentTextStyle}>{'回复'+(this.props.comment.commentCount ? (this.props.comment.commentCount>999?'999+' : this.props.comment.commentCount): 0)}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={()=>this.onLikeCommentButton()}>
                <View style={styles.likeStyle} >
                  <Image style={styles.likeImageStyle}
                         resizeMode='contain'
                         source={(this.props.isLiked||this.state.isLike) ?
                           require("../../assets/images/like_selected.png") :
                           require("../../assets/images/like_unselect.png")}/>
                </View>
              </TouchableOpacity>

              <TouchableOpacity  onPress={()=> {
                this.props.onCommentButton(comment)
              }}>
                <View style={styles.commentStyle}>
                  <Image style={styles.commentImageStyle} resizeMode='contain'
                         source={require("../../assets/images/artical_comments_unselect.png")}/>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>

    )
  }
}

ShopCommentForComment.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopCommentForComment)

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
    height: normalizeH(30),
    alignItems: 'center',
    justifyContent:'center',

    flexDirection: 'row',
    borderWidth: normalizeBorder(1),
    borderColor: '#F5F5F5',
    // paddingTop:normalizeH(5),
    // paddingBottom:normalizeH(5),
    // paddingLeft:normalizeW(10),
    // paddingRight: normalizeW(10),
    width:normalizeW(63),
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
    // position: 'absolute',
    // left: normalizeW(259),
    backgroundColor: '#FFFFFF',
    height: normalizeH(30),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent:'center',
    borderWidth: normalizeBorder(1),
    borderColor: '#F5F5F5',
    // paddingTop:normalizeH(5),
    // paddingBottom:normalizeH(5),

    // paddingLeft:normalizeW(10),
    // paddingRight: normalizeW(10),
    width: normalizeW(63)
  },
  attentionStyle: {
    position: "absolute",
    right: normalizeW(10),
    top: normalizeH(6),
    width: normalizeW(56),
    height: normalizeH(25)
  },
  timeLocationStyle: {
    marginTop: normalizeH(10),
    marginBottom: normalizeH(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dateName: {
    fontSize: em(12),
    color: '#8F8E94'
  }
})