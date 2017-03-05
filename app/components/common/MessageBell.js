/**
 * Created by yangyang on 2017/1/23.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {hasNewMessage} from '../../selector/messageSelector'
import {hasNewNotice} from '../../selector/notifySelector'
import {isUserLogined} from '../../selector/authSelector'

class MessageBell extends Component {
  constructor(props) {
    super(props)
  }

  jumpToMessageBox() {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else {
      Actions.MESSAGE_BOX()
    }
  }

  renderTip() {
    if (this.props.hasNotice) {
      return <View style={styles.noticeTip}></View>
    }
    return <View/>
  }

  render() {
    return (
      <View>
        <TouchableOpacity style={[styles.container, this.props.bellStyle]}
                          onPress={() => this.jumpToMessageBox()}>
          <View>
            <Image source={require("../../assets/images/notice.png")} />
            {this.renderTip()}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let newMsg = hasNewMessage(state)
  let newNotice = hasNewNotice(state)
  newProps.hasNotice = newMsg || newNotice
  newProps.isLogin = isUserLogined(state)
  return newProps
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MessageBell)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 12
  },
  noticeTip: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
})