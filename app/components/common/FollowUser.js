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

import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees} from '../../action/authActions'
import * as authSelector from '../../selector/authSelector'
import * as Utils from '../../util/Utils'

class FollowUser extends Component {
  constructor(props) {
    super(props)
    this.isProcessing = false
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
    })
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    // console.log('nextProps==**********************==', nextProps)
  }

  followUser(userId) {
    if(this.isProcessing) {
      return
    }
    this.isProcessing = true
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      userId: userId,
      success: function(result) {
        that.isProcessing = false
        that.props.fetchUserFollowees()
        Toast.show(result.message, {duration: 1500})
      },
      error: function(error) {
        that.isProcessing = false
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.followUser(payload)
  }

  unFollowUser(userId) {if(this.isProcessing) {
    return
  }
    this.isProcessing = true
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    const that = this
    let payload = {
      userId: userId,
      success: function(result) {
        that.isProcessing = false
        that.props.fetchUserFollowees()
        Toast.show(result.message, {duration: 1500})
      },
      error: function(error) {
        that.isProcessing = false
        Toast.show(error.message, {duration: 1500})
      }
    }
    this.props.unFollowUser(payload)
  }

  render() {
    let userIsFollowedTheUser = Utils.userIsFollowedTheUser(this.props.userId, this.props.userFollowees)

    if(userIsFollowedTheUser) {
      return (
        <TouchableOpacity style={[styles.userAttentioned, this.props.attentionedContainerStyle]} onPress={()=>{this.unFollowUser(this.props.userId)}}>
          <Image style={styles.commentAttention} source={require('../../assets/images/followed.png')}/>
        </TouchableOpacity>
      )
    }else {
      if(this.props.renderNoFollow) {
        return (
          <TouchableOpacity onPress={()=>{this.followUser(this.props.userId)}}>
            {this.props.renderNoFollow()}
          </TouchableOpacity>
        )
      }else {
        return (
          <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={()=>{this.followUser(this.props.userId)}}>
            <Image style={styles.commentAttention} source={require('../../assets/images/add_follow.png')}/>
          </TouchableOpacity>
        )
      }
    }
  }
}

const mapStateToProps = (state, ownProps) => {

  const isUserLogined = authSelector.isUserLogined(state)
  const userFollowees = authSelector.selectUserFollowees(state)

  return {
    isUserLogined: isUserLogined,
    userFollowees: userFollowees,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserFollowees,
  followUser,
  unFollowUser
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(FollowUser)

const styles = StyleSheet.create({
  userAttentioned: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userAttentionedTxt: {
    color: '#fff',
    fontSize: 10,
  },
  commentAttention: {
    width: normalizeW(45),
    height: normalizeH(50),
  },

})