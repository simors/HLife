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

import Expander from '../common/Expander'
import ScoreShow from '../common/ScoreShow'
import FollowUser from '../common/FollowUser'
import ReplyList from './ShopCommentReply/ReplyList'
import Reply from './ShopCommentReply/Reply'
import UpShopComment from './UpShopComment'

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
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <View key={"shop_comment_" + this.props.userId} style={styles.commentContainer}>
        <View style={styles.commentAvatarBox}>
          {this.props.avatar
            ? <Image style={styles.commentAvatar} source={{uri: this.props.avatar}}/>
            : <Image style={styles.commentAvatar} source={require('../../assets/images/default_portrait.png')}/>
          }

          <FollowUser
            userId={this.props.userId}
          />

        </View>
        <View style={styles.commentRight}>
          <View style={[styles.commentLine, styles.commentHeadLine]}>
            <Text style={styles.commentTitle}>{this.props.userNickname}</Text>
          </View>
          <View style={[styles.commentLine, {marginBottom: 10}]}>
            <ScoreShow
              score={this.props.score}
            />
          </View>
          <View style={[styles.commentLine, {marginBottom: 10}]}>
            <Expander
              content={this.props.content}
            />
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
            <Text style={[styles.commentTime]}>{this.props.shopCommentTime}</Text>
            <View style={styles.upReplyWrap}>
              <UpShopComment
                shopId={this.props.shopId}
                shopCommentId={this.props.shopCommentId}
                upCallback={this.props.upCallback}
              />
              <Reply
                onReplyClick={this.props.onReplyClick}
                shopCommentId={this.props.shopCommentId}
              />
            </View>
          </View>

          <ReplyList
            onReplyClick={this.props.onReplyClick}
            replys={this.props.containedReply}
            ups={this.props.containedUps}
            shopCommentId={this.props.shopCommentId}
          />
          
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

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
  commentTime: {
    fontSize: em(12),
    color: '#8f8e94'
  },

})