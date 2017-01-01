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
import TopicImageViewer from '../../components/common/TopicImageViewer'
import {getConversationTime} from '../../util/numberUtils'
import {Actions} from 'react-native-router-flux'
import {getTopicLikedTotalCount, isTopicLiked} from '../../selector/topicSelector'
import {fetchTopicLikesCount, fetchTopicIsLiked} from '../../action/topicActions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

export class TopicShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      numberOfLines: null,
      expandText: '全文',
      expanded: true,
      showExpandText: false,
      measureFlag: true,
      liked: false,
      likedChange: false
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicLikesCount({topicId: this.props.topic.objectId, upType:'topic'})
      this.props.fetchTopicIsLiked({topicId: this.props.topic.objectId, upType:'topic'})
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.topic.content != nextProps.topic.content) {
      this.setState({measureFlag: true})
      this.setState({expanded: true})
      this.setState({expandText: '全文'})
      this.setState({showExpandText: false})
      this.setState({numberOfLines: null})
    }
  }

  _onTextLayout(event) {
    if (this.state.measureFlag) {
      if (this.state.expanded) {
        this.maxHeight = event.nativeEvent.layout.height;
        this.setState({expanded: false, numberOfLines: this.props.numberOfValues});
      }
      else {
        this.mixHeight = event.nativeEvent.layout.height;
        if (this.mixHeight != this.maxHeight) {
          this.setState({showExpandText: true})
        }
        this.setState({measureFlag: false})
      }
    }
  }

  _onPressExpand() {
    if (!this.state.expanded) {
      this.setState({numberOfLines: null, expandText: '收起', expanded: true})
    } else {
      this.setState({numberOfLines: this.props.numberOfValues, expandText: '全文', expanded: false})
    }
  }

  renderExpandText() {
    if (this.state.showExpandText) {
      return (
        <Text style={styles.showExpandTextStyle}
              onPress={this._onPressExpand.bind(this)}>
          {this.state.expandText}
        </Text>
      )
    }

  }

  successCallback() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicLikesCount({topicId: this.props.topic.objectId, upType:'topic'})
      this.props.fetchTopicIsLiked({topicId: this.props.topic.objectId, upType:'topic'})
    })
  }

  onLikeButton() {
    this.props.onLikeButton({
      topic: this.props.topic,
      isLiked: this.props.isLiked,
      success: this.successCallback.bind(this)
    })
  }

  commentButtonPress() {
    Actions.TOPIC_DETAIL({topic: this.props.topic})
  }

  renderCommentAndLikeButton() {
    if (this.props.showCommentAndLikeButton) {
      return (
        <View style={styles.commentContainerStyle}>
          <View>
            <TouchableOpacity style={styles.commentStyle} onPress={()=>this.onLikeButton()}>
              <Image style={styles.commentImageStyle}
                     source={this.props.isLiked ?
                       require("../../assets/images/like_select.png") :
                       require("../../assets/images/like_unselect.png")}/>
              <Text style={styles.commentTextStyle}>{this.props.likesCount?this.props.likesCount:0}</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.commentStyle} onPress={()=> this.commentButtonPress()}>
              <Image style={styles.commentImageStyle} source={require("../../assets/images/comments_unselect.png")}/>
              <Text style={styles.commentTextStyle}>{this.props.topic.commentNum}</Text>
            </TouchableOpacity>
          </View>
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


        <View>
          <View style={styles.contentWrapStyle}>
            <Text style={styles.contentStyle}
                  numberOfLines={this.state.numberOfLines}
                  onLayout={this._onTextLayout.bind(this)}>
              {this.props.topic.content}
            </Text>
            {this.renderExpandText()}
          </View>
          <View style={styles.imagesWrapStyle}>
            <TopicImageViewer images={this.props.topic.imgGroup}/>
          </View>
        </View>

        {this.renderCommentAndLikeButton()}

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
  const likesCount = getTopicLikedTotalCount(state, ownProps.topic.objectId)
  const isLiked = isTopicLiked(state, ownProps.topic.objectId)
  return {
    likesCount: likesCount,
    isLiked: isLiked
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopicLikesCount,
  fetchTopicIsLiked
}, dispatch)

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
    marginTop: normalizeH(13),
    marginLeft: normalizeW(12)
  },
  contentStyle: {
    fontSize: em(17),
    lineHeight: 20,
    color: "#4a4a4a"
  },
  imagesWrapStyle: {
    marginTop: normalizeH(9),
    marginBottom: normalizeH(13),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  showExpandTextStyle: {
    fontSize: em(12),
    marginTop: normalizeH(10),
    color: THEME.colors.green
  },

  //评论和点赞按钮
  commentContainerStyle: {
    flex: 1,
    marginBottom: normalizeH(8),
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  commentStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E9E9E9',
    height: normalizeH(32),
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 100,
    flexDirection: 'row',
  },
  commentImageStyle: {
    marginLeft: normalizeW(20),
    marginRight: normalizeW(20),
  },
  commentTextStyle: {
    fontSize: em(15),
    marginRight: normalizeW(20),
    color: THEME.colors.lighter
  }
})