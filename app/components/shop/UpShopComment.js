/**
 * Created by zachary on 2017/1/3.
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
import {fetchShopCommentUpedUserList, userUpShopComment, userUnUpShopComment} from '../../action/shopAction'
import * as authSelector from '../../selector/authSelector'
import * as shopSelector from '../../selector/shopSelector'
import * as Toast from '../common/Toast'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class UpShopComment extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentWillReceiveProps(nextProps) {

  }

  upShopComment() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    this.props.userUpShopComment({
      shopCommentUpId : this.props.shopCommentUpId,
      shopCommentId : this.props.shopCommentId,
      success: (result) => {
        // Toast.show('点赞成功', {duration: 1500})
        that.props.fetchShopCommentUpedUserList({
          shopId: that.props.shopId,
          shopCommentId: that.props.shopCommentId
        })
      },
      error: (err) => {
        Toast.show(err.message, {duration: 1500})
      }
    })
  }
  
  unUpShopComment() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    this.props.userUnUpShopComment({
      shopCommentUpId : this.props.shopCommentUpId,
      shopCommentId : this.props.shopCommentId,
      success: (result) => {
        // Toast.show('取消点赞成功', {duration: 1500})
        that.props.fetchShopCommentUpedUserList({
          shopId: that.props.shopId,
          shopCommentId: that.props.shopCommentId
        })
      },
      error: (err) => {
        Toast.show(err.message, {duration: 1500})
      }
    })
  }

  render() {
    
    if(this.props.isUped) {
      return (
        <TouchableOpacity style={styles.commentUpWrap} onPress={this.unUpShopComment.bind(this)}>
          <Image style={styles.image} resizeMode="contain" source={require('../../assets/images/artical_like_unselect.png')}/>
          <Text style={styles.up}>取消</Text>
        </TouchableOpacity>
      )
    }else {
      return (
        <TouchableOpacity style={styles.commentUpWrap} onPress={this.upShopComment.bind(this)}>
          <Image style={styles.image} resizeMode="contain" source={require('../../assets/images/artical_like_unselect.png')}/>
          <Text style={styles.up}>赞</Text>
        </TouchableOpacity>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)
  const activeUserId = authSelector.activeUserId(state)
  const isUped = shopSelector.selectActiveUserIsUpedShopComment(state, ownProps.shopId, ownProps.shopCommentId, activeUserId)
  const shopCommentUpId = shopSelector.selectShopCommentUpId(state, ownProps.shopId, ownProps.shopCommentId, activeUserId)
  return {
    isUserLogined: isUserLogined,
    isUped: isUped,
    shopCommentUpId: shopCommentUpId
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopCommentUpedUserList,
  userUpShopComment,
  userUnUpShopComment
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UpShopComment)

const styles = StyleSheet.create({
  commentUpWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  image: {
    width:17,
    height:16,
  },
  up: {
    marginLeft: 5,
    fontSize: em(12),
    color: '#8f8e94'
  },
})