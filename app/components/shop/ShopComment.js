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
import Triangle from '../common/Triangle'
import ImageGroupViewer from '../common/Input/ImageGroupViewer'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import {fetchShopCommentList} from '../../action/shopAction'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees} from '../../action/authActions'
import {selectUserIsFollowShop, selectShopComments} from '../../selector/shopSelector'

import * as ShopDetailTestData from './ShopDetailTestData'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopComment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showExpander: false,
      expander: true,
      numberOfLines: 5,
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentWillReceiveProps(nextProps) {

  }

  followUser(userId) {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      userId: userId,
      success: function(result) {
        that.props.fetchUserFollowees()
        Toast.show(result.message, {duration: 1500})
      },
      error: function(error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.followUser(payload)

  }

  unFollowUser(userId) {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      userId: userId,
      success: function(result) {
        that.props.fetchUserFollowees()
        Toast.show(result.message, {duration: 1500})
      },
      error: function(error) {
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.unFollowUser(payload)

  }

  userIsFollowedTheUser(userId) {
    let userFollowees = this.props.userFollowees
    if(userFollowees && userFollowees.length) {
      for(let i = 0; i < userFollowees.length; i++) {
        if(userFollowees[i].id == userId) {
          return true
        }
      }
      return false
    }
  }

  _onCommentTextLayout(event) {
    const evtHeight = event.nativeEvent.layout.height
    if(evtHeight > 100) {
      this.setState({
        showExpander: true,
      })
    }
  }

  _toggleExpander() {
    this.setState({
      numberOfLines: this.state.expander ? undefined : 5,
      expander: !this.state.expander,
    })
  }

  render() {
    const scoreWidth = this.props.score / 5.0 * 62
    let userIsFollowedTheUser = this.userIsFollowedTheUser(this.props.userId)
    return (
      <View key={"shop_comment_" + this.props.userId} style={styles.commentContainer}>
        <View style={styles.commentAvatarBox}>
          <Image style={styles.commentAvatar} source={{uri: this.props.avatar}}/>

          {userIsFollowedTheUser
            ? <TouchableOpacity style={styles.userAttentioned} onPress={()=>{this.unFollowUser(this.props.userId)}}>
            <Text style={styles.userAttentionedTxt}>取消关注</Text>
          </TouchableOpacity>
            : <TouchableOpacity onPress={()=>{this.followUser(this.props.userId)}}>
            <Image style={styles.commentAttention} source={require('../../assets/images/give_attention_head.png')}/>
          </TouchableOpacity>
          }

        </View>
        <View style={styles.commentRight}>
          <View style={[styles.commentLine, styles.commentHeadLine]}>
            <Text style={styles.commentTitle}>{this.props.userNickname}</Text>
          </View>
          <View style={[styles.commentLine, {marginBottom: 10}]}>
            <View style={styles.scoresWrap}>
              <View style={styles.scoreIconGroup}>
                <View style={[styles.scoreBackDrop, {width: scoreWidth}]}></View>
                <Image style={styles.scoreIcon} source={require('../../assets/images/star_empty.png')}/>
              </View>
              <Text style={styles.score}>{this.props.score}</Text>
            </View>
          </View>
          <View style={[styles.commentLine, {marginBottom: 10}]}>
            <Text numberOfLines={this.state.numberOfLines} style={[styles.commentContent]}>{this.props.content}</Text>
            <Text onLayout={this._onCommentTextLayout.bind(this)} style={[styles.commentContent, {position:'absolute', left:-9999}]}>{this.props.content}</Text>
            {this.state.showExpander
              ? <TouchableWithoutFeedback onPress={this._toggleExpander.bind(this)}>
                  <View>
                    <Text style={styles.expanderTxt}>{this.state.expander ? '全文' : '收起'}</Text>
                  </View>
                </TouchableWithoutFeedback>
              : null
            }
          </View>

          {
            this.props.blueprints && this.props.blueprints.length
              ? <View style={[styles.commentLine, {marginBottom: 10}]}>
                  <ImageGroupViewer
                    images={this.props.blueprints}
                    containerStyle={{marginLeft:0,marginRight:0}}
                    imageStyle={{margin:0,marginRight:2}}
                  />
                </View>
              : null
          }

          <View style={[styles.commentLine, styles.commentFootLine]}>
            <Text style={[styles.commentTime]}>刚刚</Text>
            <View style={styles.upReplyWrap}>
              <TouchableOpacity style={styles.commentUpWrap}>
                <Image source={require('../../assets/images/artical_like_unselect.png')}/>
                <Text style={styles.up}>赞</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentReplyWrap}>
                <Image source={require('../../assets/images/comments_unselect.png')}/>
                <Text style={styles.reply}>回复</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.replyWrap}>
            <Triangle width={8} height={5} color="rgba(0,0,0,0.05)" style={[styles.triangle]} direction="up"/>
            <View style={styles.upReplyContainer}>
              <View style={styles.upUsersContainer}>
                <Image style={{width:10,height:10,marginRight:5}} source={require('../../assets/images/artical_like_unselect.png')}/>
                <TouchableOpacity style={styles.upUserBox}>
                  <Text style={styles.upUser}>左凯</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.upUserBox}>
                  <Image style={{width:12,height:12}} source={require('../../assets/images/artical_like_unselect.png')}/>
                </TouchableOpacity>
              </View>

              <View style={styles.replyContainer}>
                <View style={styles.replyInnerContainer}>
                  <View style={styles.replyTitleWrap}>
                    <TouchableOpacity style={styles.replyUserBox}>
                      <Text style={styles.replyUser}>左凯</Text>
                    </TouchableOpacity>
                    <Text style={styles.replyWord}>回复</Text>
                    <TouchableOpacity style={styles.replyUserBox}>
                      <Text style={styles.replyUser}>杨阳</Text>
                    </TouchableOpacity>
                    <Text style={styles.replyWord}>:</Text>

                    <View style={styles.replyContentWrap}>
                      <Text style={styles.replyContent}>回复哈师大发生大火发哈收到回复哈佛哈多喝水</Text>
                    </View>
                  </View>

                </View>
              </View>
            </View>
          </View>
          
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isUserLogined: false,
    userFollowees: [],
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopComment)

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
  commentContainer: {
    flexDirection: 'row',
    paddingLeft: normalizeW(10),
    paddingTop: normalizeH(16),
    paddingBottom: normalizeH(16),
    marginBottom: normalizeH(10),
    backgroundColor: '#fff'
  },
  commentAvatarBox: {
    alignItems: 'center'
  },
  commentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10
  },
  commentTitle: {
    fontSize: em(17),
    color: "#8f8e94"
  },
  commentAttention: {

  },
  commentRight: {
    flex: 1,
    paddingLeft: normalizeW(12),
    paddingRight: normalizeW(12)
  },
  commentLine: {
    flex: 1,
  },
  commentHeadLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalizeH(10)
  },
  commentFootLine: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  upReplyWrap: {
    flex:1,
    flexDirection:'row',
    justifyContent: 'flex-end'
  },
  commentUpWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  commentReplyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  up: {
    marginLeft: 5,
    fontSize: em(12),
    color: '#8f8e94'
  },
  reply: {
    marginLeft: 5,
    fontSize: em(12),
    color: '#8f8e94'
  },
  score: {
    marginLeft: 5,
    color: '#f5a623',
    fontSize: em(12)
  },
  scoresWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalizeW(36)
  },
  scoreIconGroup: {
    width: 62,
    height: 11,
    backgroundColor: '#d8d8d8'
  },
  scoreBackDrop: {
    height: 11,
    backgroundColor: '#f5a623'
  },
  scoreIcon: {
    position: 'absolute',
    left: 0,
    top: 0
  },
  commentTime: {
    fontSize: em(12),
    color: '#8f8e94'
  },
  commentContent: {
    fontSize: em(15),
    color: '#8f8e94',
  },
  expanderTxt: {
    color: THEME.colors.green,
    lineHeight: 20,
    fontSize: em(12)
  },
  replyWrap: {
    backgroundColor: '#fff'
  },
  upReplyContainer: {
    height:100,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  triangle: {
    marginLeft:6
  },
  upUsersContainer: {
    flexDirection: 'row',
    padding:10,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA
  },
  upUserBox: {
    marginRight:8
  },
  upUser: {
    fontSize: em(10),
    color: '#8f8e94',
  },
  replyTitleWrap: {
    flex:1,
    flexDirection: 'row',
  },
  replyContainer: {
    flexDirection: 'row',
    padding:10,
  },
  replyInnerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  replyUserBox: {

  },
  replyUser: {
    fontSize: em(10),
    color: THEME.colors.green,
  },
  replyWord: {
    fontSize: em(10),
    color: '#8f8e94',
  },
  replyContentWrap: {
    flex: 1,
  },
  replyContent: {
    fontSize: em(12),
    color: '#8f8e94',
  }

})