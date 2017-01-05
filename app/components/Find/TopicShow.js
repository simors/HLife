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

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TopicShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  commentButtonPress() {
    Actions.TOPIC_DETAIL({topic: this.props.topic})
  }

  renderContentImage() {

    //没有图片的显示规则
    if ((!this.props.topic.imgGroup) || ((this.props.topic.imgGroup.length == 0))) {
      return (
        <View style={styles.contentWrapStyle}>
          <Text style={styles.contentTitleStyle} numberOfLines={1}>
            {this.props.topic.title}
          </Text>
          <Text style={styles.contentStyle} numberOfLines={2}>
            {this.props.topic.abstract}
          </Text>
        </View>
      )
    }

    //一张到2张图片的显示规则
    else if (this.props.topic.imgGroup && (this.props.topic.imgGroup.length < 3)) {
      let image = []
      image.push(this.props.topic.imgGroup[0])
      return (
        <View style={[styles.contentWrapStyle, {flexDirection: 'row'}]}>
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
        </View>
      )
    }

    //3张以上图片的显示规则
    else if (this.props.topic.imgGroup && (this.props.topic.imgGroup.length >= 3)) {
      let image = []
      image.push(this.props.topic.imgGroup[0])
      image.push(this.props.topic.imgGroup[1])
      image.push(this.props.topic.imgGroup[2])
      return (
        <View style={styles.contentWrapStyle}>
          <Text style={styles.contentTitleStyle} numberOfLines={1}>
            {this.props.topic.title}
          </Text>
          <Text style={styles.contentStyle} numberOfLines={2}>
            {this.props.topic.abstract}
          </Text>
          <ImageGroupViewer images={image}
                            imageLineCnt={3}
                            containerStyle={{flex: 1, marginLeft: 0, marginRight: 0}}/>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={[styles.containerStyle, this.props.containerStyle]}>

        <View style={styles.introWrapStyle}>
          <View style={{flexDirection: 'row'}} onPress={()=> {
          }}>
            <TouchableOpacity>
              <Image style={styles.avatarStyle}
                     source={this.props.topic.avatar ? {uri: this.props.topic.avatar} : require("../../assets/images/default_portrait@2x.png")}/>
            </TouchableOpacity>
            <View>
              <TouchableOpacity>
                <Text style={styles.userNameStyle}>{this.props.topic.nickname}</Text>
              </TouchableOpacity>
              <View style={styles.timeLocationStyle}>
                <Text style={styles.timeTextStyle}>
                  {getConversationTime(this.props.topic.createdAt.valueOf())}
                </Text>
                <Image style={styles.positionStyle} source={require("../../assets/images/writer_loaction.png")}/>
                <Text style={styles.timeTextStyle}>长沙</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.attentionStyle}>
              <Image source={require("../../assets/images/give_attention_shop.png")}/>
            </TouchableOpacity>
          </View>
        </View>

        {this.renderContentImage()}
        {/*{this.renderCommentAndLikeButton()}*/}

      </View>

    )
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
    position: "absolute",
    right: normalizeW(10),
    top: normalizeH(6),
    width: normalizeW(56),
    height: normalizeH(25)
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
    fontSize: em(17),
    lineHeight: 20,
    marginBottom: normalizeH(5),
    color: "#4a4a4a"
  },
  contentStyle: {
    marginBottom: normalizeH(13),
    fontSize: em(15),
    lineHeight: 20,
    color: "#9b9b9b"
  },
})