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
import dismissKeyboard from 'react-native-dismiss-keyboard'

import Header from '../common/Header'
import CommonListView from '../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import {fetchShopCommentList, reply, fetchShopCommentReplyList} from '../../action/shopAction'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees} from '../../action/authActions'
import {selectShopDetail, selectShopComments} from '../../selector/shopSelector'
import * as authSelector from '../../selector/authSelector'
import ShopComment from './ShopComment'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import ToolBarContent from './ShopCommentReply/ToolBarContent'
import * as ShopDetailTestData from './ShopDetailTestData'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopCommentList extends Component {
  constructor(props) {
    super(props)

    this.replyInput = null
    
    this.state = {
      replyId : '',
      replyUserId: '',
      replyUserNickName : '',
      replyShopCommentId: '',
      replyShopCommentUserId: '',
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.refreshData()
    })
  }

  componentWillReceiveProps(nextProps) {

  }

  renderRow(rowData, rowId) {
    return (
      <ShopComment
        shopId={this.props.shopId}
        shopCommentId={rowData.id}
        userId={rowData.user.id}
        userNickname={rowData.user.nickname}
        avatar={rowData.user.avatar}
        score={rowData.score}
        content={rowData.content}
        shopCommentTime={rowData.shopCommentTime}
        createdDate={rowData.createdDate}
        blueprints={rowData.blueprints}
        containedReply={rowData.containedReply}
        containedUps={rowData.containedUps}
        onReplyClick={this.onReplyClick.bind(this)}
      />
    )
  }

  refreshData() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    let payload = {
      id: this.props.shopId,
      lastCreatedAt: this.props.lastCreatedAt,
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
    this.props.fetchShopCommentList(payload)
  }
  
  onReplyClick(replyShopCommentId, replyShopCommentUserId, replyId, replyUserNickName, replyUserId) {
    if(this.replyInput) {
      this.replyInput.focus()
    }
    this.setState({
      ...this.state,
      replyShopCommentId: replyShopCommentId,
      replyShopCommentUserId: replyShopCommentUserId,
      replyUserNickName: replyUserNickName,
      replyUserId: replyUserId,
      replyId: replyId
    })
  }

  sendReply(content) {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    this.props.reply({
      shopId: this.props.shopId,
      replyShopCommentId : this.state.replyShopCommentId,
      replyId : this.state.replyId,
      replyUserId : this.state.replyUserId,
      replyShopCommentUserId : this.state.replyShopCommentUserId,
      replyContent : content,
      success: (result) => {
        dismissKeyboard()
        // Toast.show('回复成功', {duration: 1500})
        that.props.fetchShopCommentReplyList({
          shopId: that.props.shopId,
          replyShopCommentId: this.state.replyShopCommentId
        })
      },
      error: (err) => {
        Toast.show(err.message, {duration: 1500})
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="全部评价"
          rightType="none"
        />
        <View style={styles.body}>
          {this.props.lastCreatedAt
            ?  <CommonListView
                contentContainerStyle={{backgroundColor: 'rgba(0,0,0,0.05)'}}
                dataSource={this.props.ds}
                renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
                loadNewData={()=>{this.refreshData()}}
                loadMoreData={()=>{this.loadMoreData()}}
                ref={(listView) => this.listView = listView}
              />
            : <TouchableOpacity style={styles.noCommentContainer} onPress={()=>{Actions.PUBLISH_SHOP_COMMENT({id: this.props.shopId, shopOwnerId: this.props.shopDetail.owner.id})}}>
                <Text style={styles.noCommentTxt}>目前没有评论,快来抢沙发吧! ~~~</Text>
              </TouchableOpacity>
          }

        </View>
        <KeyboardAwareToolBar
          initKeyboardHeight={-50}
        >
          <ToolBarContent
            replyInputRefCallBack={(input)=>{this.replyInput = input}}
            onSend={(content) => {this.sendReply(content)}}
            placeholder={this.state.replyUserNickName ? '回复' + this.state.replyUserNickName + ':' : '回复:'}
          />
        </KeyboardAwareToolBar>
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

  // const shopCommentList = ShopDetailTestData.shopComments
  // let shopId = '5858e68a8e450a006cba3cff'
  // const shopCommentList = selectShopComments(state, shopId)
  const shopCommentList = selectShopComments(state, ownProps.shopId)
  const isUserLogined = authSelector.isUserLogined(state)
  const shopDetail = selectShopDetail(state, ownProps.id)

  let lastCreatedAt = ''
  if(shopCommentList && shopCommentList.length) {
    lastCreatedAt = shopCommentList[shopCommentList.length-1].createdAt
  }

  return {
    ds: ds.cloneWithRows(shopCommentList),
    isUserLogined: isUserLogined,
    lastCreatedAt: lastCreatedAt,
    shopDetail: shopDetail,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopCommentList,
  reply,
  fetchShopCommentReplyList
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopCommentList)

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
  noCommentContainer: {
    padding: 10,
    paddingTop: 20,
    alignItems: 'center'
  },
  noCommentTxt: {
    fontSize: em(17),
    color: "#8f8e94"
  }

})