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
import {isCommentLiked} from '../../selector/shopSelector'
import {isUserLogined} from '../../selector/authSelector'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {getConversationTime} from '../../util/numberUtils'
import shallowequal from 'shallowequal'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../util/ImageUtil'
import {userUpShopComment} from '../../action/shopAction'
import ImageGroupViewer from '../common/Input/ImageGroupViewer'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class ShopCommentForShop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      upCount: 0,
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        upCount: this.props.comment.upCount
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
    if (this.props.comment.commentCount) {
      return (
        <TouchableOpacity onPress={() => Actions.SHOP_COMMENT_DETAIL({comment: this.props.comment})}>
          <View style={styles.parentCommentStyle}>
            <Text style={styles.parentCommentContentStyle}>
              <Text style={styles.commentUserStyle}>
                {"全部回复·" + (this.props.comment.commentCount < 999 ? this.props.comment.commentCount : 999)}
              </Text>
            </Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  successCallback() {

    this.setState({upCount: this.state.upCount + 1})

  }

  onLikeCommentButton() {
    if (this.props.isLogin) {
      this.props.onLikeCommentButton({
        comment: this.props.comment,
        isLiked: this.props.isLiked,
        upType: 'topicComment',
        success: this.successCallback.bind(this)

      })
    }
    else {
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

          <Text style={styles.contentStyle}>
            {comment.content}
          </Text>
          {
            comment.blueprints && comment.blueprints.length
              ? <View style={ {flex: 1, marginBottom: 10}}>
              <ImageGroupViewer
                images={comment.blueprints}
                containerStyle={{marginLeft: 0, marginRight: 0}}
                imageStyle={{margin: 0, marginRight: 2}}
                imgSize={85}
              />
            </View>
              : null
          }
          <View style={styles.timeLocationStyle}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.commentTextStyle}>{'赞'+(this.state.upCount ? (this.state.upCount>999?'999+' : this.state.upCount): 0)}</Text>
              <Text style={styles.commentTextStyle}>{'回复'+(this.props.comment.commentCount ? (this.props.comment.commentCount>999?'999+' : this.props.comment.commentCount): 0)}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.likeStyle} onPress={()=>this.onLikeCommentButton()}>
                <Image style={styles.likeImageStyle}
                       resizeMode='contain'
                       source={this.props.isLiked ?
                         require("../../assets/images/like_selected.png") :
                         require("../../assets/images/like_unselect.png")}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentStyle} onPress={()=> {
                this.props.onCommentButton(comment)
              }}>
                <Image style={styles.commentImageStyle} resizeMode='contain'
                       source={require("../../assets/images/comments_unselect.png")}/>
              </TouchableOpacity>
            </View>
          </View>
          {this.renderParentComment()}

        </View>

      </View>

    )
  }
}

ShopCommentForShop.defaultProps = {
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
  const isLiked = isCommentLiked(state, ownProps.comment.id)
  const isLogin = isUserLogined(state)
  return {
    isLiked: isLiked,
    isLogin: isLogin,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userUpShopComment
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopCommentForShop)

//export
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    // width: PAGE_WIDTH,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA,
  },
  commentUserStyle: {
    fontSize: em(12),
    color: "#5A5A5A"
  },
  avatarViewStyle: {
    // width: normalizeW(57),
  },
  avatarStyle: {
    height: normalizeH(32),
    width: normalizeW(32),
    borderRadius: normalizeW(16),
    borderWidth: normalizeBorder(1),
    borderColor: 'transparent',
    marginTop: normalizeH(10),
    marginRight: normalizeW(12),
  },

  parentCommentStyle: {
    // width: normalizeW(300),
    backgroundColor: '#f2f2f2',
    marginRight: 8,
    // marginTop: normalizeH(10),
    marginBottom: normalizeH(15),
  },

  parentCommentContentStyle: {
    marginBottom: normalizeH(8),
    marginTop: normalizeH(6),
    marginLeft: normalizeW(6),
    marginRight: normalizeW(4),
    fontSize: em(12),
  },
  commentContainerStyle: {
    // width: normalizeW(318),
    flex: 1
  },
  userNameStyle: {
    fontSize: em(17),
    marginTop: normalizeH(10),
    color: "#000000"
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
    // position: 'absolute',
    // left: normalizeW(189),
    backgroundColor: '#FFFFFF',
    height: normalizeH(16),
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: normalizeBorder(1),
    borderColor: '#F5F5F5',
    padding:normalizeH(5),
    paddingLeft:normalizeW(10),
    paddingRight: normalizeW(10),
  },
  likeImageStyle: {
    height: normalizeW(16),
    width: normalizeH(18),
    marginRight: 3,
    resizeMode: 'stretch'
  },
  commentImageStyle: {
    height: normalizeH(16),
    width: normalizeW(16),
    marginRight: 3,
    resizeMode: 'stretch'
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
    height: normalizeH(16),
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: normalizeBorder(1),
    borderColor: '#F5F5F5',
    padding:normalizeH(5),
    paddingLeft:normalizeW(10),
    paddingRight: normalizeW(10),

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
    justifyContent: 'space-between'
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