/**
 * Created by yangyang on 2017/1/16.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  InteractionManager,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {INQUIRY_CONVERSATION, PERSONAL_CONVERSATION, WUAI_SYSTEM_DOCTOR} from '../../constants/messageActionTypes'
import {fetchDoctorGroup} from '../../action/doctorAction'
import {activeUserId} from '../../selector/authSelector'
import {getDoctorByGroupUserId} from '../../selector/doctorSelector'
import {updateConversationStatus} from '../../action/messageAction'
import MessageBoxCell from './MessageBoxCell'

class InquiryMessageCell extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let members = this.props.members
    let otherMem = members.filter((member) => {
      if (member === WUAI_SYSTEM_DOCTOR) {
        return false
      }
      if (member === this.props.currentUser) {
        return false
      }
      return true
    })
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchDoctorGroup({id: otherMem})
    })
    this.props.updateConversationStatus({conversationId: this.props.conversation})
  }

  render() {
    let title = ""
    let doctorName = []
    this.props.doctors.map((doctor) => {
      doctorName.push(doctor.username)
    })
    title = doctorName.join(',')
    return (
      <View>
        <MessageBoxCell members={this.props.members} conversation={this.props.conversation} type={INQUIRY_CONVERSATION} title={title} />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUser = activeUserId(state)
  let members = ownProps.members
  let otherMem = members.filter((member) => {
    if (member === WUAI_SYSTEM_DOCTOR) {
      return false
    }
    if (member === currentUser) {
      return false
    }
    return true
  })
  let doctors = getDoctorByGroupUserId(state, otherMem)
  return {
    currentUser: currentUser,
    doctors: doctors,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchDoctorGroup,
  updateConversationStatus,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InquiryMessageCell)