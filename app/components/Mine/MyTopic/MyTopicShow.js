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
import {getLeancloudTimeToMonth} from '../../../util/numberUtils'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import FollowUser from '../../../components/common/FollowUser'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class MyTopicShow extends Component {
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
    if (this.props.topic) {
      return (
        <View style={[styles.containerStyle, this.props.containerStyle]}>

          <View style={styles.introWrapStyle}>
            <Text style={styles.dayStyle}>{this.props.topic.createdAt.getDate()}</Text>
            <Text style={styles.monthStyle}>{getLeancloudTimeToMonth(this.props.topic.createdAt)}</Text>
          </View>
          {this.renderContentImage()}
        </View>

      )
    }
  }
}

MyTopicShow.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MyTopicShow)


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
  //用户、时间、地点信息
  dayStyle: {
    fontSize: em(22),
    color: "#4a4a4a",
    opacity: 0.5,
    textDecorationLine: 'underline',//下划线和删除线的样式：['none' /*default*/, 'underline', 'line-through', 'underline line-through'
  },
  //用户、时间、地点信息
  monthStyle: {
    fontSize: em(12),
    color: "#9b9b9b"
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