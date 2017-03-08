/**
 * Created by wuxingyu on 2016/12/21.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  InteractionManager
} from 'react-native'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import ImageGroupViewer from '../../components/common/Input/ImageGroupViewer'
import {getConversationTime} from '../../util/numberUtils'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import FollowUser from '../../components/common/FollowUser'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TopicShow extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  commentButtonPress() {
    Actions.TOPIC_DETAIL({topic: this.props.topic})
  }

  renderContentImage() {

    //没有图片的显示规则
    if ((!this.props.topic.imgGroup) || ((this.props.topic.imgGroup.length == 0))) {
      return (
        <TouchableOpacity style={styles.contentWrapStyle} onPress={()=>this.commentButtonPress()}>
          <Text style={styles.contentTitleStyle} numberOfLines={1}>
            {this.props.topic.title}
          </Text>
          <Text style={styles.contentStyle} numberOfLines={2}>
            {this.props.topic.abstract}
          </Text>
        </TouchableOpacity>
      )
    }

    //一张到2张图片的显示规则
    else if (this.props.topic.imgGroup && (this.props.topic.imgGroup.length < 3)) {
      let image = []
      image.push(this.props.topic.imgGroup[0])
      return (
        <TouchableOpacity style={[styles.contentWrapStyle, {flexDirection: 'row'}]}
                          onPress={()=>this.commentButtonPress()}>
          <View style={{flex: 1}}>
            <Text style={styles.contentTitleStyle} numberOfLines={2}>
              {this.props.topic.title}
            </Text>
            <Text style={styles.contentStyle} numberOfLines={3}>
              {this.props.topic.abstract}
            </Text>
          </View>
          <ImageGroupViewer images={image}
                            imageLineCnt={1}
                            containerStyle={{width: PAGE_WIDTH * 2 / 7, marginRight: 0}}/>
        </TouchableOpacity>
      )
    }

    //3张以上图片的显示规则
    else if (this.props.topic.imgGroup && (this.props.topic.imgGroup.length >= 3)) {
      let image = []
      image.push(this.props.topic.imgGroup[0])
      image.push(this.props.topic.imgGroup[1])
      image.push(this.props.topic.imgGroup[2])
      return (
        <TouchableOpacity style={styles.contentWrapStyle} onPress={()=>this.commentButtonPress()}>
          <Text style={styles.contentTitleStyle} numberOfLines={1}>
            {this.props.topic.title}
          </Text>
          <Text style={styles.contentStyle} numberOfLines={2}>
            {this.props.topic.abstract}
          </Text>
          <ImageGroupViewer images={image}
                            imageLineCnt={3}
                            containerStyle={{flex: 1, marginLeft: 0, marginRight: 0}}/>
        </TouchableOpacity>
      )
    }
  }

  render() {
    if(this.props.topic) {
      return (
        <View style={[styles.containerStyle, this.props.containerStyle]}>

          <View style={styles.introWrapStyle}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: this.props.topic.userId})}>
                  <Image style={styles.avatarStyle}
                         source={this.props.topic.avatar ? {uri: this.props.topic.avatar} : require("../../assets/images/default_portrait.png")}/>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: this.props.topic.userId})}>
                    <Text style={styles.userNameStyle}>{this.props.topic.nickname}</Text>
                  </TouchableOpacity>
                  <View style={styles.timeLocationStyle}>
                    <Text style={styles.timeTextStyle}>
                      {getConversationTime(this.props.topic.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.attentionStyle}>
                <FollowUser
                  userId={this.props.topic.userId}
                />
              </View>
            </View>
          </View>

          {this.renderContentImage()}
          {/*{this.renderCommentAndLikeButton()}*/}
          <View style={styles.locationCommentStyle}>
            <Image style={styles.positionStyle} source={require("../../assets/images/writer_loaction.png")}/>
            <Text
              style={styles.timeTextStyle}>{this.props.topic.position ? this.props.topic.position.city + this.props.topic.position.district : "未知"}</Text>
            <Text
              style={styles.likeTextStyle}>{"点赞" + " " + (this.props.topic.likeCount > 999 ? '999+' : this.props.topic.likeCount)}</Text>
            <Text
              style={styles.commentTextStyle}>{"评论" + " " + (this.props.topic.commentNum > 999 ? '999+' : this.props.topic.commentNum)}</Text>
          </View>
        </View>

      )
    }
  }
}

TopicShow.defaultProps = {
  // style
  containerStyle: {},
  numberOfValues: 3,
  topic: {
    imgGroup: undefined,
    content: undefined,
    createAt: undefined,
  },
  showCommentAndLikeButton: true,
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TopicShow)


//export
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#fff'
  },

  //用户、时间、地点信息
  introWrapStyle: {
    marginTop: normalizeH(12),
    marginLeft: normalizeW(12)
  },
  userNameStyle: {
    fontSize: em(15),
    marginTop: 1,
    marginLeft: 10,
    color: "#4a4a4a"
  },
  attentionStyle: {
    paddingRight: normalizeW(15),
  },
  timeLocationStyle: {
    marginLeft: normalizeW(11),
    marginTop: normalizeH(9),
    flexDirection: 'row'
  },
  avatarStyle: {
    height: normalizeH(44),
    width: normalizeW(44),
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeTextStyle: {
    marginRight: normalizeW(26),
    fontSize: em(12),
    color: THEME.colors.lighter
  },
  positionStyle: {
    marginRight: normalizeW(4),
    width: normalizeW(8),
    height: normalizeH(12)
  },

  //文章和图片
  contentWrapStyle: {
    flex: 1,
    marginTop: normalizeH(13),
    marginLeft: normalizeW(35),
    marginRight: normalizeW(12)
  },
  contentTitleStyle: {
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 20,
    marginBottom: normalizeH(5),
    color: "#5A5A5A"
  },
  contentStyle: {
    marginBottom: normalizeH(13),
    fontSize: em(15),
    lineHeight: 20,
    color: "#9b9b9b"
  },

  //位置，点赞和评论
  locationCommentStyle: {
    marginLeft: normalizeW(35),
    marginBottom: normalizeH(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeTextStyle: {
    position: "absolute",
    left: normalizeW(199),
    fontSize: em(12),
    color: THEME.colors.lighter
  },
  commentTextStyle: {
    position: "absolute",
    left: normalizeW(268),
    fontSize: em(12),
    color: THEME.colors.lighter
  },
})