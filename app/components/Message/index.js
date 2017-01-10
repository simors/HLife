/**
 * Created by yangyang on 2016/12/22.
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
  ScrollView,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import * as msgTypes from '../../constants/messageActionTypes'
import {hasNewMessageByType, getNewestMessageTips} from '../../selector/messageSelector'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height
const INQUIRY = 'INQUIRY'
const PERSONAL = 'PERSONAL'

class MessageBox extends Component {
  constructor(props) {
    super(props)
  }

  renderNoticeTip(type) {
    switch (type) {
      case INQUIRY:
        if (this.props.newInquiry) {
          return (
            <View style={styles.noticeTip}></View>
          )
        }
        break
      case PERSONAL:
        if (this.props.newPersonalLetter) {
          return (
            <View style={styles.noticeTip}></View>
          )
        }
      default:
        return <View/>
    }
  }

  renderInquiryMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.INQUIRY_MESSAGE_BOX()}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={require('../../assets/images/notice_question.png')}></Image>
              {this.renderNoticeTip(INQUIRY)}
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>问诊</Text>
                <View style={{flex: 1}}></View>
                <Text style={styles.timeTip}>{this.props.lastInquiryMsg.lastMessageAt}</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>{this.props.lastInquiryMsg.lastMessage}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderPersonalMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={require('../../assets/images/notice_message.png')}></Image>
              {this.renderNoticeTip(PERSONAL)}
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>私信</Text>
                <View style={{flex: 1}}></View>
                <Text style={styles.timeTip}>{this.props.lastPersonalMsg.lastMessageAt}</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>{this.props.lastPersonalMsg.lastMessage}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="消息通知"
        />
        <View style={styles.itemContainer}>
          <ScrollView style={{height: PAGE_HEIGHT}}>
            {this.renderInquiryMessage()}
            {this.renderPersonalMessage()}
            <View style={styles.itemView}>
              <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={styles.noticeIconView}>
                    <Image style={styles.noticeIcon} source={require('../../assets/images/notice_topic.png')}></Image>
                    <View style={styles.noticeTip}></View>
                  </View>
                  <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.titleStyle}>话题评论</Text>
                      <View style={{flex: 1}}></View>
                      <Text style={styles.timeTip}>2017-01-02</Text>
                    </View>
                    <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                      <Text numberOfLines={1} style={styles.msgTip}>郝依依医生给您提供的咨询服务对您是否有用，期待您的反馈！</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.itemView}>
              <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={styles.noticeIconView}>
                    <Image style={styles.noticeIcon} source={require('../../assets/images/like_topic.png')}></Image>
                    <View style={styles.noticeTip}></View>
                  </View>
                  <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.titleStyle}>话题点赞</Text>
                      <View style={{flex: 1}}></View>
                      <Text style={styles.timeTip}>2017-01-02</Text>
                    </View>
                    <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                      <Text numberOfLines={1} style={styles.msgTip}>郝依依医生给您提供的咨询服务对您是否有用，期待您的反馈！</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.itemView}>
              <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={styles.noticeIconView}>
                    <Image style={styles.noticeIcon} source={require('../../assets/images/notice_shop_comments.png')}></Image>
                    <View style={styles.noticeTip}></View>
                  </View>
                  <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.titleStyle}>店铺评论</Text>
                      <View style={{flex: 1}}></View>
                      <Text style={styles.timeTip}>2017-01-02</Text>
                    </View>
                    <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                      <Text numberOfLines={1} style={styles.msgTip}>郝依依医生给您提供的咨询服务对您是否有用，期待您的反馈！</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.itemView}>
              <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={styles.noticeIconView}>
                    <Image style={styles.noticeIcon} source={require('../../assets/images/notice_love_shop.png')}></Image>
                    <View style={styles.noticeTip}></View>
                  </View>
                  <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.titleStyle}>店铺点赞</Text>
                      <View style={{flex: 1}}></View>
                      <Text style={styles.timeTip}>2017-01-02</Text>
                    </View>
                    <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                      <Text numberOfLines={1} style={styles.msgTip}>郝依依医生给您提供的咨询服务对您是否有用，期待您的反馈！</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.itemView}>
              <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={styles.noticeIconView}>
                    <Image style={styles.noticeIcon} source={require('../../assets/images/notice_follow_shop.png')}></Image>
                    <View style={styles.noticeTip}></View>
                  </View>
                  <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.titleStyle}>店铺关注</Text>
                      <View style={{flex: 1}}></View>
                      <Text style={styles.timeTip}>2017-01-02</Text>
                    </View>
                    <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                      <Text numberOfLines={1} style={styles.msgTip}>郝依依医生给您提供的咨询服务对您是否有用，期待您的反馈！</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let newInquiry = hasNewMessageByType(state, msgTypes.INQUIRY_CONVERSATION)
  let lastInquiryMsg = getNewestMessageTips(state, msgTypes.INQUIRY_CONVERSATION)
  let newPersonalLetter = hasNewMessageByType(state, msgTypes.PERSONAL_CONVERSATION)
  let lastPersonalMsg = getNewestMessageTips(state, msgTypes.PERSONAL_CONVERSATION)

  newProps.newInquiry = newInquiry
  newProps.lastInquiryMsg = lastInquiryMsg
  newProps.newPersonalLetter = newPersonalLetter
  newProps.lastPersonalMsg = lastPersonalMsg
  console.log('newProps:', newProps)
  return newProps
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
  },
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
    width: 35,
    height: 35,
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