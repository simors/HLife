/**
 * Created by lilu on 2016/12/30.
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
  InteractionManager,
} from 'react-native'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {connect} from 'react-redux'
import TopicImageViewer from '../../components/common/TopicImageViewer'
import {getConversationTime} from '../../util/numberUtils'
import {Actions} from 'react-native-router-flux'
import {getArticleItem,getIsUp,getcommentCount,getUpCount} from '../../selector/articleSelector'
import {fetchIsUP,upArticle,unUpArticle,fetchCommentsCount,fetchUpCount} from '../../action/articleAction'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class articleComment extends Component {
  constructor(props) {
    console.log('didmount======>')
    super(props)
    this.state = {}
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchIsUP({articleId: this.props.comment.articleId, upType:'articleComment'})
      this.props.fetchUpCount({articleId: this.props.comment.articleId, upType:'topicComment'})
    })
  }
  renderParentComment() {
    if (this.props.hasParentComment) {
      return (
        <View style={styles.parentCommentStyle}>
          <Text style={styles.parentCommentContentStyle}>
            <Text style={styles.commentUserStyle}>
              {this.props.topic.nickname}:
            </Text>
            <Text style={styles.parentCommentTextStyle}>
              {this.props.topic.content}
            </Text>
          </Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={[styles.containerStyle, this.props.containerStyle]}>

        <View style={styles.avatarViewStyle}>
          <TouchableOpacity>
            <Image style={styles.avatarStyle}
                   source={this.props.comment.avatar ? {uri: this.props.comment.avatar} : require("../../assets/images/default_portrait@2x.png")}/>
          </TouchableOpacity>
        </View>

        <View style={styles.commentContainerStyle}>

          <TouchableOpacity>
            <Text style={styles.userNameStyle}>{this.props.comment.nickname}</Text>
          </TouchableOpacity>
          {this.renderParentComment()}
          <Text style={styles.contentStyle}>
            {this.props.comment.content}
          </Text>

          <View style={styles.timeLocationStyle}>
            <Text style={styles.timeTextStyle}>刚刚</Text>
            <Image style={styles.positionStyle} source={require("../../assets/images/writer_loaction.png")}/>
            <Text style={styles.timeTextStyle}>长沙</Text>
            <TouchableOpacity style={styles.likeStyle} onPress={()=> {
            }}>
              <Image style={styles.likeImageStyle} source={require("../../assets/images/like_unselect.png")}/>
              <Text style={styles.commentTextStyle}>25</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commentStyle} onPress={()=> {
            }}>
              <Image style={styles.commentImageStyle} source={require("../../assets/images/comments_unselect.png")}/>
              <Text style={styles.commentTextStyle}>回复</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>

    )
  }
}

const mapStateToProps = (state, ownProps) => {
 // let articleItem = getArticleItem(state,ownProps.articleId,ownProps.categoryId)
  console.log('ownProps=======>',ownProps.comment)

  let upCount = getUpCount(state,ownProps.comment.articleId)
  let isUp = getIsUp(state,ownProps.comment.articleId)

  return{
    upCount: upCount,
    isUP: isUp
  //  articleItem : articleItem
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchIsUP,
  fetchUpCount
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(articleComment)


articleComment.defaultProps = {
  // style
  containerStyle: {},
  numberOfValues: 3,
  topic: {
    nickname: "鱼爱上猫",
    imgGroup: undefined,
    content: "一起去农村盖豪宅",
    createAt: undefined,
    topic: undefined,
  },
  hasParentComment: false,
}

//export
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: PAGE_WIDTH,
    marginBottom: normalizeH(10)
  },
  commentUserStyle: {
    fontSize: em(15),
    color: "#50e3c2"
  },
  avatarViewStyle: {
    width: normalizeW(57),
  },
  avatarStyle: {
    height: normalizeH(35),
    width: normalizeW(35),
    borderRadius: 17.5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    marginTop: normalizeH(10),
    marginLeft: normalizeW(12),
  },

  parentCommentStyle: {
    width: normalizeW(300),
    backgroundColor: '#f2f2f2',
    marginRight: 8,
    marginTop: normalizeH(10),
  },

  parentCommentContentStyle: {
    marginBottom: normalizeH(8),
    marginTop: normalizeH(7),
    marginLeft: normalizeW(5),
    marginRight: normalizeW(4),
  },
  commentContainerStyle: {
    width: normalizeW(318),
  },
  userNameStyle: {
    fontSize: em(15),
    marginTop: normalizeH(10),
    color: "#50e3c2"
  },
  parentCommentTextStyle: {
    color: '#000000',
    letterSpacing: 0.15,
    lineHeight: 20
  },
  contentStyle: {
    fontSize: em(17),
    lineHeight: 20,
    paddingTop: normalizeH(10),
    paddingRight: normalizeW(8),
    color: "#4a4a4a"
  },
  likeStyle: {
    position: 'absolute',
    left: 189,
    backgroundColor: '#FFFFFF',
    height: normalizeH(16),
    alignItems: 'center',
    flexDirection: 'row',
  },
  likeImageStyle: {
    height: normalizeW(16),
    width: normalizeH(18),
    marginRight: 3
  },
  commentImageStyle: {
    height: normalizeW(19),
    width: normalizeH(18),
    marginRight: 3
  },
  commentTextStyle: {
    fontSize: em(12),
    letterSpacing: 0.14,
    color: THEME.colors.lighter
  },
  commentStyle: {
    position: 'absolute',
    left: 259,
    backgroundColor: '#FFFFFF',
    height: normalizeH(16),
    alignItems: 'center',
    flexDirection: 'row',
  },
  attentionStyle: {
    position: "absolute",
    right: normalizeW(10),
    top: normalizeH(6),
    width: normalizeW(56),
    height: normalizeH(25)
  },
  timeLocationStyle: {
    marginTop: normalizeH(14),
    marginBottom: normalizeH(15),
    flexDirection: 'row'
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
})