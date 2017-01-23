import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Platform,
  Modal,
  ScrollView,
  TouchableHighlight,
  WebView,
  InteractionManager,
} from 'react-native'
import Header from '../common/Header'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME, {INNER_CSS} from '../../constants/themes/theme1'
import {getColumn} from '../../selector/configSelector'
import {Actions} from 'react-native-router-flux'
import {CommonWebView} from '../common/CommonWebView'
import CommentPublic from './CommentPublic'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import {
  fetchIsUP,
  upArticle,
  fetchUps,
  unUpArticle,
  fetchCommentsArticle,
  fetchCommentsCount,
  fetchUpCount,
  submitArticleComment,
  fetchIsFavorite,
  unFavoriteArticle,
  favoriteArticle,
} from '../../action/articleAction'
import {
  getIsUp,
  getIsFavorite,
  getcommentList,
  getcommentCount,
  getUpCount,
  getLikerList
} from '../../selector/articleSelector'
import CommentV2 from '../common/CommentV2'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import ArticleComment from './ArticleComment'
import * as Toast from '../common/Toast'
import WebHtmlView from 'react-native-webhtmlview'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import ToolBarContent from '../shop/ShopCommentReply/ToolBarContent'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Article extends Component {
  constructor(props) {
    super(props)
    this.replyInput = null

    this.state = {
      modalVisible: false,
      commentY: 0,
      comment: undefined
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchCommentsArticle({articleId: this.props.articleId})
      this.props.fetchCommentsCount(this.props.articleId)
      this.props.fetchUps({articleId: this.props.articleId, upType: 'article'})
      this.props.fetchUpCount({articleId: this.props.articleId, upType: 'article'})
      if (this.props.isLogin) {
        this.props.fetchIsUP({articleId: this.props.articleId, upType: 'article'})
        this.props.fetchIsFavorite({articleId: this.props.articleId})
      }
    })
  }

  onReplyClick() {
    // console.log('onReplyClick.this.replyInput==', this.replyInput)
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else {
      if (this.replyInput) {
        this.replyInput.focus()
      }
    }
  }

  measureMyComponent(event) {
    this.setState({commentY: (event.nativeEvent.layout.height + event.nativeEvent.layout.y)})
    //console.log('commentY',this.state.commentY)
  }


  onUpCommentButton(payload) {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else {
      if (payload.isUp) {
        this.props.unUpArticle({
          articleId: payload.comment.commentId,
          upType: 'articleComment',
          success: payload.success,
          error: this.likeErrorCallback
        })
      }
      else {
        this.props.upArticle({
          articleId: payload.comment.commentId,
          upType: 'articleComment',
          success: payload.success,
          error: this.likeErrorCallback
        })
      }
    }
  }

  likeErrorCallback(error) {
    Toast.show(error.message)
  }

  upSuccessCallback() {

    InteractionManager.runAfterInteractions(() => {
      // this.props.fetchUpCount({articleId: this.props.articleId, upType: 'article'})
      // this.props.fetchCommentsArticle(this.props.articleId,this.props.categoryId)
      //  this.props.fetchCommentsCount(this.props.articleId, this.props.categoryId)
      this.props.fetchUps(this.props.articleId)
      this.props.fetchUpCount({articleId: this.props.articleId, upType: 'article'})
      this.props.fetchIsUP({articleId: this.props.articleId, upType: 'article'})
      this.props.fetchIsFavorite({articleId: this.props.articleId})
      this.props.fetchUps({articleId: this.props.articleId, upType: 'article'})
    })
  }

  onLikeButton() {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else {
      if (this.props.isUp) {
        //  console.log('hereiscode')
        this.props.unUpArticle({
          articleId: this.props.articleId,
          upType: 'article',
          success: this.upSuccessCallback.bind(this),
          error: this.likeErrorCallback
        })
      }
      else {
        // console.log('hereiscode')
        this.props.upArticle({
          articleId: this.props.articleId,
          upType: 'article',
          success: this.upSuccessCallback.bind(this),
          error: this.likeErrorCallback
        })
      }
    }
  }

  onFavoriteButton() {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else {

      if (this.props.isFavorite) {
        // console.log('hereiscode')
        this.props.unFavoriteArticle({
          articleId: this.props.articleId,
          //  upType: 'article',
          success: this.upSuccessCallback.bind(this),
          error: this.likeErrorCallback
        })
      }
      else {
        // console.log('hereiscode')
        this.props.favoriteArticle({
          articleId: this.props.articleId,
          //  upType: 'article',
          success: this.upSuccessCallback.bind(this),
          error: this.likeErrorCallback
        })
      }
    }
  }

  renderTopicLikeOneUser(value, key) {
    //console.log('value====>', value)

    return (
      <TouchableOpacity key={key} style={{alignSelf: 'center'}}>
        <Image style={styles.zanAvatarStyle}
               source={value.avatar ? {uri: value.avatar} : require("../../assets/images/default_portrait@2x.png")}/>
      </TouchableOpacity>
    )
  }

  renderTopicLikeUsers() {
    if (this.props.upUserList) {
      return (
        this.props.upUserList.map((value, key)=> {
          if (key < 6) {
            return (
              this.renderTopicLikeOneUser(value, key)
            )
          }
        })
      )
    }
  }

  onCommentArticle() {
    this.setState({
      comment: undefined
    })
    this.onReplyClick()
  }

  onCommentButton(comment) {
    this.setState({
      comment: comment
    })
    this.onReplyClick()
  }

  renderCommentPage() {
    if (this.props.articleComments) {
      // console.log('articlecomments------->',this.props.articleComments)
      return (
        this.props.articleComments.map((value, key)=> {
          return (
            this.renderCommentItem(value, key)
          )
        })
      )
    }
  }

  renderCommentItem(value, key) {
    //  console.log('value=========', value)
    // console.log('key=========', key)
    return (
      <ArticleComment key={key}
                      comment={value}
                      onCommentButton={this.onCommentButton.bind(this)}
                      onUpCommentButton={(payload)=>this.onUpCommentButton(payload)}
      />
    )
  }

  renderNoComment() {
    if (this.props.articleComments.length == 0) {
      return (
        <Text style={{alignSelf: 'center', paddingTop: 20}}>
          目前没有评论，快来抢沙发吧！~~~
        </Text>
      )
    }
  }

  submitComment(commentData) {
    //console.log('commentData====',commentData)
    if (!this.props.isLogin) {
      Actions.LOGIN()
    }
    else {
      this.props.submitArticleComment({
        content: commentData,
        articleId: this.props.articleId,
        replyId: (this.state.comment) ? this.state.comment.commentId : undefined,
        success: this.submitSuccessCallback.bind(this),
        error: this.submitErrorCallback(this)
      })
    }
  }

  submitErrorCallback(error) {
    // Toast.show(error.message)
  }

  submitSuccessCallback() {
    InteractionManager.runAfterInteractions(()=> {
      this.props.fetchCommentsArticle({articleId: this.props.articleId})
    })
    this.closeModal(()=> {
      dismissKeyboard()
      Toast.show('回复成功', {duration: 1000})
    })
  }

  scrollToComment() {
    this.refs.scrollView.scrollTo(this.state.commentY)
  }

  openModel(callback) {
    this.setState({
      modalVisible: true
    })
    if (callback && typeof callback == 'function') {
      callback()
    }
  }

  closeModal(callback) {
    this.setState({
      modalVisible: false,
      comment: undefined
    })
    if (callback && typeof callback == 'function') {
      callback()
    }
  }

  rightPress(){

  }
  render() {
    return (
      <View style={styles.containerStyle}>
        <Header leftType='icon'
                leftPress={() => Actions.pop()}
                rightType='image'
                rightImageSource={require("../../assets/images/artical_share.png")}
                rightPress={()=>{this.rightPress()}}>

        </Header>
        <View style={styles.body}>
          <ScrollView style={{}} ref={"scrollView"}>
            <View style={styles.titleView}>
              <Text style={{
                marginTop: normalizeH(12),
                marginBottom: normalizeH(10),
                fontSize: em(22),
                color: '#636363',
                marginLeft: normalizeW(12),
                fontWeight: 'bold'
              }}>{this.props.title}</Text>
            </View>
            <View style={styles.authorView}>
              <Image style={{
                height: normalizeH(30),
                width: normalizeW(30),
                overflow: 'hidden',
                borderRadius: normalizeW(15),
                marginLeft: normalizeW(12)
              }}
                     source={this.props.avatar ? {uri: this.props.avatar} : require("../../assets/images/default_portrait.png")}></Image>
              <Text style={{
                fontSize: em(18),
                color: '#929292',
                marginLeft: normalizeW(12)
              }}>{this.props.nickname}</Text>
            </View>
            <WebHtmlView
              source={{html: this.props.content}}
              innerCSS={INNER_CSS}
            />
            <TouchableOpacity style={styles.upList}
                              onLayout={this.measureMyComponent.bind(this)}
                              onPress={()=>Actions.LIKE_USER_LIST({topicLikeUsers: this.props.upUserList})}>
              <View style={styles.zanStyle}>
                <Text style={styles.zanTextStyle}>
                  赞
                </Text>
              </View>
              {this.renderTopicLikeUsers()}
              <View style={styles.zanStyle}>
                <Text style={styles.zanTextStyle}>
                  {this.props.upCount}
                </Text>
              </View>
            </TouchableOpacity>
            {this.renderCommentPage()}
            {this.renderNoComment()}
          </ScrollView>
          <View style={styles.shopCommentWrap}>
            <TouchableOpacity style={styles.shopCommentInputBox} onPress={this.onCommentArticle.bind(this)}>
              <Text style={styles.shopCommentInput}>写回复...</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commentBtnWrap} onPress={this.scrollToComment.bind(this)}>
              <Image style={{}} source={require('../../assets/images/artical_comments_unselect.png')}/>
              <View style={styles.commentBtnBadge}>
                <Text
                  style={styles.commentBtnBadgeTxt}>{this.props.commentsTotalCount > 99 ? '99+' : this.props.commentsTotalCount}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shopUpWrap} onPress={()=>this.onLikeButton()}>
              <Image style={{}} source={this.props.isUp ?
                require("../../assets/images/like_select.png") :
                require("../../assets/images/like_unselect.png")}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shopUpWrap} onPress={()=> this.onFavoriteButton()}>
              <Image style={{}} source={this.props.isFavorite ?
                require("../../assets/images/artical_favorite_select.png") :
                require("../../assets/images/artical_favorite_unselect.png")}/>
            </TouchableOpacity>
          </View>
          <KeyboardAwareToolBar
            initKeyboardHeight={-normalizeH(100)}
          >
            {/*<CommentV2*/}
            {/*replyInputRefCallBack={(input)=>{this.replyInput = input}}*/}
            {/*showModules={["content"]}*/}
            {/*modalVisible={this.state.modalVisible}*/}
            {/*textAreaPlaceholder={(this.state.comment) ? "回复 " + this.state.comment.nickname + ": " : "回复 楼主: "}*/}
            {/*closeModal={() => this.closeModal()}*/}
            {/*submitComment={this.submitComment.bind(this)}*/}
            {/*/>*/}
            <ToolBarContent
              replyInputRefCallBack={(input)=> {
                this.replyInput = input
              }}
              onSend={(content)=> {
                this.submitComment(content)
              }}
              placeholder={(this.state.comment) ? "回复 " + this.state.comment.nickname + ": " : "回复 楼主: "}
              label={'回复'}
            />
          </KeyboardAwareToolBar>
        </View>
      </View>

    )
  }

}


const mapStateToProps = (state, ownProps) => {
  const isLogin = isUserLogined(state)
  const userInfo = activeUserInfo(state)
  const articleComments = getcommentList(state, ownProps.articleId)
  const isUp = getIsUp(state, ownProps.articleId)
  const upCount = getUpCount(state, ownProps.articleId)
  const commentsTotalCount = getcommentCount(state, ownProps.articleId)
  const isFavorite = getIsFavorite(state, ownProps.articleId)
  const upUser = getLikerList(state, ownProps.articleId)
  //console.log('articleComment===>', upUser)

  return {
    articleComments: articleComments,
    isLogin: isLogin,
    isUp: isUp,
    userInfo: userInfo,
    upCount: upCount,
    commentsTotalCount: commentsTotalCount,
    isFavorite: isFavorite,
    upUserList: upUser
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchIsUP,
  upArticle,
  favoriteArticle,
  unUpArticle,
  fetchCommentsArticle,
  fetchCommentsCount,
  fetchUpCount,
  submitArticleComment,
  fetchIsFavorite,
  unFavoriteArticle,
  fetchUps,
  fetch
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Article)

const styles = StyleSheet.create(
  {
    containerStyle: {
      flex: 1,
      backgroundColor: '#E5E5E5',
      justifyContent: 'flex-start',
      // alignItems: 'center'
    },
    titleView: {
      // height: normalizeH(39),
      width: PAGE_WIDTH,
      // marginTop: normalizeH(64),
      borderBottomWidth: normalizeBorder(1),
      borderColor: '#E6E6E6',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    },
    authorView: {
      height: normalizeH(50),
      width: PAGE_WIDTH,
      marginTop: normalizeH(1),
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
    },
    articleView: {
      // height: normalizeH(452),
      width: PAGE_WIDTH,
      // paddingLeft:normalizeW(12),
      //paddingRight:normalizeW(12),

    },
    commentView: {
      height: normalizeH(50),
      width: PAGE_WIDTH,
      backgroundColor: '#FAFAFA'
    },
    shopCommentWrap: {
      height: normalizeH(50),
      paddingLeft: 10,
      borderTopWidth: normalizeBorder(),
      borderTopColor: THEME.colors.lighterA,
      backgroundColor: 'rgba(0,0,0,0.005)',
      flexDirection: 'row',
      alignItems: 'center'
    },
    shopCommentInputBox: {
      flex: 1,
      marginRight: 10,
      padding: 6,
      borderWidth: normalizeBorder(),
      borderColor: THEME.colors.lighterA,
      borderRadius: 10,
      backgroundColor: '#fff'
    },
    shopCommentInput: {
      fontSize: em(17),
      color: '#8f8e94'
    },
    commentBtnWrap: {
      width: 60,
      height: 38,
      justifyContent: 'center',
      alignItems: 'center'
    },
    commentBtnBadge: {
      alignItems: 'center',
      width: 30,
      backgroundColor: '#f5a623',
      position: 'absolute',
      right: 0,
      top: 0,
      borderRadius: 10,
      borderWidth: normalizeBorder(),
      borderColor: '#f5a623'
    },
    commentBtnBadgeTxt: {
      fontSize: 9,
      color: '#fff'
    },
    shopUpWrap: {
      width: 60,
      alignItems: 'center'
    },
    body: {
      ...Platform.select({
        ios: {
          marginTop: normalizeH(65),
        },
        android: {
          marginTop: normalizeH(45),
          // paddingBottom: normalizeH(100)
        }
      }),
      flex: 1,
    },
    zanStyle: {
      backgroundColor: THEME.colors.green,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'transparent',
      height: normalizeH(35),
      alignSelf: 'center',
      borderRadius: 100,
      marginLeft: normalizeW(12),
      width: normalizeW(35),
    },
    zanAvatarStyle: {
      borderColor: 'transparent',
      height: normalizeH(35),
      alignSelf: 'center',
      borderRadius: 17.5,
      marginLeft: normalizeW(10),
      width: normalizeW(35),
    },
    zanTextStyle: {
      fontSize: em(17),
      color: "#ffffff",
      marginTop: normalizeH(7),
      alignSelf: 'center',
    },
    upList: {
      backgroundColor: '#E5E5E5',
      height: normalizeH(59),
      alignItems: 'flex-start',
      flexDirection: 'row',
    },

  })