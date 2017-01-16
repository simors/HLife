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

class FollowUser extends Component {
  constructor(props) {
    super(props)
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

  render() {
    let userIsFollowedTheUser = this.userIsFollowedTheUser(this.props.userId)

    if(userIsFollowedTheUser) {
      return (
        <TouchableOpacity style={styles.userAttentioned} onPress={()=>{this.unFollowUser(this.props.userId)}}>
          <Text style={styles.userAttentionedTxt}>取消关注</Text>
        </TouchableOpacity>
      )
    }else {
      return (
        <TouchableOpacity onPress={()=>{this.followUser(this.props.userId)}}>
          <Image style={styles.commentAttention} source={require('../../assets/images/give_attention_head.png')}/>
        </TouchableOpacity>
      )
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
    backgroundColor: THEME.colors.green,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 5,
  },
  userAttentionedTxt: {
    color: '#fff',
    fontSize: 10,
  },

})