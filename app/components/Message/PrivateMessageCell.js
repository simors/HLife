/**
 * Created by yangyang on 2017/1/20.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  InteractionManager,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import {fetchUsers} from '../../action/authActions'
import {activeUserId, userInfoByIds} from '../../selector/authSelector'
import MessageBoxCell from './MessageBoxCell'

class PrivateMessageCell extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let members = this.props.members
    let otherMem = members.filter((member) => {
      if (member === this.props.currentUser) {
        return false
      }
      return true
    })
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchUsers({userIds: otherMem})
    })
  }

  render() {
    let title = ""
    let usernames = []
    this.props.users.map((user) => {
      if (!user.nickname || user.nickname.length === 0) {
        usernames.push(user.phone)
      } else {
        usernames.push(user.nickname)
      }
    })
    title = usernames.join(',')
    return (
      <View>
        <MessageBoxCell members={this.props.members} conversation={this.props.conversation} type={PERSONAL_CONVERSATION} title={title} />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUser = activeUserId(state)
  let members = ownProps.members
  let otherMem = members.filter((member) => {
    if (member === currentUser) {
      return false
    }
    return true
  })
  let doctors = userInfoByIds(state, otherMem)
  return {
    currentUser: currentUser,
    users: doctors,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUsers,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PrivateMessageCell)