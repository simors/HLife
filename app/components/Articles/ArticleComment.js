/**
 * Created by lilu on 2016/12/30.
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
} from 'react-native'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import TopicImageViewer from '../../components/common/TopicImageViewer'
import {getConversationTime} from '../../util/numberUtils'
import {Actions} from 'react-native-router-flux'
import {getArticleItem, getIsUp, getcommentCount, getUpCount} from '../../selector/articleSelector'
import {fetchIsUP, upArticle, unUpArticle, fetchCommentsCount, fetchUpCount} from '../../action/articleAction'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ArticleComment extends Component {
  constructor(props) {
    //  console.log('didmount======>')
    super(props)
    this.state = {}
  }

  componentDidMount() {
    // InteractionManager.runAfterInteractions(() => {
    //   this.props.fetchUpCount({articleId: this.props.comment.commentId, upType: 'articleComment'})
    //   if (this.props.isLogin) {
    //     this.props.fetchIsUP({articleId: this.props.comment.commentId, upType: 'articleComment'})
    //     //console.log('here is th e  code by fetch is Up')
    //   }
    // })
  }

  successCallback() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchIsUP({articleId: this.props.comment.commentId, upType: 'articleComment'})
      this.props.fetchUpCount({articleId: this.props.comment.commentId, upType: 'articleComment'})
    })
  }

  onUpCommentButton() {
    this.props.onUpCommentButton({
      comment: this.props.comment,
      isUp: this.props.isUp,
      success: this.successCallback.bind(this)
    })
  }

  renderParentComment() {
    // console.log('ceshiyixia===>',this.props.comment)
    if (this.props.comment.replyAuthor) {
      return (
        <View style={styles.parentCommentStyle}>
          <Text style={styles.parentCommentContentStyle}>
            <Text style={styles.commentUserStyle}>
              {this.props.comment.replyAuthor}:
            </Text>
            <Text style={styles.parentCommentTextStyle}>
              {this.props.comment.replyContent}
            </Text>
          </Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={[styles.containerStyle, this.props.containerStyle]}>

        <View style={styles.avatarViewStyle}>
          <TouchableOpacity onPress={()=> {
            Actions.PERSONAL_HOMEPAGE({userId: this.props.comment.author})
          }}>
            <Image style={styles.avatarStyle}
                   source={this.props.comment.avatar ? {uri: this.props.comment.avatar} : require("../../assets/images/default_portrait.png")}/>
          </TouchableOpacity>
        </View>

        <View style={styles.commentContainerStyle}>

          <TouchableOpacity onPress={()=> {
            Actions.PERSONAL_HOMEPAGE({userId: this.props.comment.author})
          }}>
            <Text style={styles.userNameStyle}>{this.props.comment.nickname}</Text>
          </TouchableOpacity>
          {this.renderParentComment()}
          <Text style={styles.contentStyle}>
            {this.props.comment.content}
          </Text>

          <View style={styles.timeLocationStyle}>
            <Text style={styles.timeTextStyle}>{getConversationTime(this.props.comment.createAt)}</Text>
            <Image style={styles.positionStyle} source={require("../../assets/images/writer_loaction.png")}/>
            <Text style={styles.timeTextStyle}>长沙</Text>
            <TouchableOpacity style={styles.likeStyle} onPress={()=>this.onUpCommentButton()}>
              <Image style={styles.likeImageStyle} source={((this.props.isUp==true||this.props.isUp==false)?this.props.isUp:this.props.comment.isUp) ?
                require("../../assets/images/like_select.png") :
                require("../../assets/images/like_unselect.png")}/>
              <Text style={styles.commentTextStyle}>{(this.props.upCount||(this.props.upCount==0))?this.props.upCount:this.props.comment.count}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commentStyle} onPress={()=> {
              this.props.onCommentButton(this.props.comment)
            }}>
              <Image style={styles.commentImageStyle} source={require("../../assets/images/comments_unselect.png")}/>
              <Text style={styles.commentTextStyle}>回复</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>

    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // let articleItem = getArticleItem(state,ownProps.articleId,ownProps.categoryId)
  // console.log('ownProps=======>',ownProps.comment)

  let upCount = getUpCount(state, ownProps.comment.commentId)
  let isUp = getIsUp(state, ownProps.comment.commentId)
  const isLogin = isUserLogined(state)
  //console.log('isUp',(isUp==true||isUp==false)?isUp:ownProps.comment.isUp)
  // console.log('Upconut====>',upCount)
  return {
    upCount: upCount,
    isUp: (isUp==true||isUp==false)?isUp:ownProps.comment.isUp,
    isLogin: isLogin
    //  articleItem : articleItem
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchIsUP,
  fetchUpCount
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ArticleComment)


ArticleComment.defaultProps = {
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
  hasParentComment: false,
}

//export
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: PAGE_WIDTH,
    marginBottom: normalizeH(10)
  },
  commentUserStyle: {
    fontSize: em(15),
    color: "#50e3c2"
  },
  avatarViewStyle: {
    width: normalizeW(57),
  },
  avatarStyle: {
    height: normalizeH(35),
    width: normalizeW(35),
    borderRadius: 17.5,
    borderWidth: 1,
    // borderStyle: 'solid',
    borderColor: 'transparent',
    marginTop: normalizeH(10),
    marginLeft: normalizeW(12),
  },

  parentCommentStyle: {
    width: normalizeW(300),
    backgroundColor: '#f2f2f2',
    marginRight: normalizeW(8),
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
    color: "#50e3c2"
  },
  parentCommentTextStyle: {
    color: '#000000',
    letterSpacing: normalizeW(0.15),
    lineHeight: normalizeH(20)
  },
  contentStyle: {
    fontSize: em(17),
    lineHeight: normalizeH(20),
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
    width: normalizeH(16),
    marginRight: 3
  },
  commentImageStyle: {
    height: normalizeW(16),
    width: normalizeH(16),
    marginRight: normalizeW(3),
    resizeMode: 'contain'
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
    height: normalizeH(17),
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
    alignItems: 'center'
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