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
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import ImageGroupViewer from '../../../components/common/Input/ImageGroupViewer'
import {getLeancloudTimeToMonth, getLeancloudTimeToDay} from '../../../util/numberUtils'
import {Actions} from 'react-native-router-flux'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class MyTopicShow extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  commentButtonPress() {
    Actions.TOPIC_DETAIL({topic: this.props.topic})
  }

  renderContentImage() {

    //没有图片的显示规则
    if (this.props.topic) {
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
            <ImageGroupViewer browse={false}
                              images={image}
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
            <ImageGroupViewer browse={false}
                              images={image}
                              imageLineCnt={3}
                              containerStyle={{flex: 1, marginLeft: 0, marginRight: 0}}/>
          </TouchableOpacity>
        )
      }
    }
  }

  render() {
    if (this.props.topic) {
      let createDate = new Date(this.props.topic.createdAt)
      let updateDate = new Date(this.props.topic.updatedAt)
      return (
        <View style={[styles.containerStyle, this.props.containerStyle]}>
          <View style={styles.timeWrapStyle}>
            <View style={{backgroundColor: THEME.base.mainColor, borderRadius: 5, padding: 5}}>
              <Text style={styles.dayStyle}>{getLeancloudTimeToDay(updateDate)}</Text>
              <Text style={styles.monthStyle}>{getLeancloudTimeToMonth(updateDate)}</Text>
            </View>
          </View>
          <View style={{flex: 1, paddingLeft: normalizeW(10)}}>
            {this.renderContentImage()}
            <View style={styles.locationCommentStyle}>
              <Image style={styles.positionPicStyle} resizeMode="contain"
                     source={require("../../../assets/images/writer_loaction.png")}/>
              <Text style={styles.positionTextStyle}>长沙</Text>
              <Text style={styles.likeTextStyle}>
                {"点赞" + " " + (this.props.topic.likeCount > 999 ? '999+' : this.props.topic.likeCount)}
              </Text>
              <Text style={styles.commentTextStyle}>
                {"评论" + " " + (this.props.topic.commentNum > 999 ? '999+' : this.props.topic.commentNum)}
              </Text>
            </View>
          </View>
        </View>
      )
    }
  }
}

MyTopicShow.defaultProps = {
  containerStyle: {},
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingTop: normalizeH(20),
  },

  //时间信息
  timeWrapStyle: {
    paddingLeft: normalizeW(12),
  },
  //时间日期信息
  dayStyle: {
    fontSize: em(22),
    color: '#fff',
    textDecorationLine: 'underline',//下划线和删除线的样式：['none' /*default*/, 'underline', 'line-through', 'underline line-through'
  },
  //时间月份信息
  monthStyle: {
    fontSize: em(12),
    color: '#fff',
  },

  //文章和图片
  contentWrapStyle: {
    flex: 1,
    paddingRight: normalizeW(12)
  },
  contentTitleStyle: {
    fontSize: em(17),
    fontWeight: 'bold',
    marginBottom: normalizeH(10),
    color: "#5a5a5a"
  },
  contentStyle: {
    marginBottom: normalizeH(13),
    fontSize: em(15),
    lineHeight: em(20),
    color: "#aaaaaa"
  },

  //位置，点赞和评论
  locationCommentStyle: {
    marginBottom: normalizeH(10),
    alignItems: 'center',
    flexDirection: 'row'
  },
  positionTextStyle: {
    marginRight: normalizeW(26),
    fontSize: em(12),
    color: THEME.colors.lighter
  },
  positionPicStyle: {
    marginRight: normalizeW(4),
    width: normalizeW(8),
    height: normalizeH(12)
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