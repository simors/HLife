/**
 * Created by yangyang on 2017/1/10.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  InteractionManager,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {getUserInfoById} from '../../action/authActions'
import {userInfoById} from '../../selector/authSelector'

class MessageBoxCell extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getUserInfoById({userId: this.props.memberId})
    })
  }

  renderNoticeTip() {
    return (
      <View></View>
    )
  }

  render() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={{uri: this.props.userInfo.avatar}}></Image>
              {this.renderNoticeTip()}
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>{this.props.userInfo.nickname}</Text>
                <View style={{flex: 1}}></View>
                <Text style={styles.timeTip}>sfsdfsdfs</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>fsdfgalfasflkasdflafa</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let userInfoRecord = userInfoById(state, ownProps.memberId)
  let userInfo
  if (userInfoRecord) {
    userInfo = userInfoRecord.toJS()
  }
  newProps.userInfo = userInfo
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getUserInfoById,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MessageBoxCell)

const styles = StyleSheet.create({
  itemView: {
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
  },
  selectItem: {
    flexDirection: 'row',
    height: normalizeH(63),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  titleStyle: {
    fontSize: 17,
    color: '#4A4A4A',
    letterSpacing: 0.43,
  },
  msgTip: {
    fontSize: 14,
    color: '#9B9B9B',
    letterSpacing: 0.43,
  },
  timeTip: {
    fontSize: 14,
    color: '#9B9B9B',
    letterSpacing: 0.43,
    marginRight: normalizeW(15)
  },
  noticeIconView: {
    marginLeft: normalizeW(15),
    marginRight: normalizeW(19)
  },
  noticeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  noticeTip: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    right: 0,
  },
})