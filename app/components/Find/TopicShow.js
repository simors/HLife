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
} from 'react-native'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import TopicImageViewer from '../../components/common/TopicImageViewer'

export class TopicShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      numberOfLines: null,
      expandText: '全文',
      expanded: true,
      showExpandText: false,
      measureFlag: true,
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

  render() {
    return (
      <View style={[styles.containerStyle, this.props.containerStyle]}>

        <View style={styles.introWrapStyle}>
          <View style={{flexDirection: 'row'}} onPress={()=> {
          }}>
            <TouchableOpacity>
              <Image source={require("../../assets/images/local_write@2x.png")}/>
            </TouchableOpacity>
            <View>
              <TouchableOpacity>
                <Text style={styles.userNameStyle}>白天不懂夜的黑</Text>
              </TouchableOpacity>
              <View style={styles.timeLocationStyle}>
                <Text style={styles.timeTextStyle}>刚刚</Text>
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
              {this.props.content}
            </Text>
            {this.renderExpandText()}
          </View>
          <View style={styles.imagesWrapStyle}>
            <TopicImageViewer images={this.props.imgGroup}/>
          </View>
        </View>


        <View style={styles.commentContainerStyle}>
          <View>
            <TouchableOpacity style={styles.commentStyle} onPress={()=> {
            }}>
              <Image style={styles.commentImageStyle} source={require("../../assets/images/like_unselect.png")}/>
              <Text style={styles.commentTextStyle}>75000</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.commentStyle} onPress={()=> {
            }}>
              <Image style={styles.commentImageStyle} source={require("../../assets/images/comments_unselect.png")}/>
              <Text style={styles.commentTextStyle}>88888</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

TopicShow.defaultProps = {
  // style
  containerStyle: {},
  numberOfValues: 3,
  imgGroup: ["http://www.qq745.com/uploads/allimg/141106/1-141106153Q5.png",
    "http://img1.3lian.com/2015/a1/53/d/198.jpg",
    "http://img1.3lian.com/2015/a1/53/d/200.jpg",
    "http://img1.3lian.com/2015/a1/53/d/200.jpg",
    "http://img1.3lian.com/2015/a1/53/d/200.jpg"],
  content:"国家发展改革委新闻发言人赵辰昕说：“纲要提出了165项重大工程项目，这些项目都是供给侧结构性改革中‘补短板’的重要内容。抓好这些项目的实施，就是要坚持从满足需要出发，从解决好人民群众普遍关心的突出问题出发，坚持问题导向，增加有效供给。正像总书记讲话指出的，新的增长点就蕴含在解决好人民群众普遍关心的突出问题当中。”"
}

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
    lineHeight: em(21),
    color: "#4a4a4a"
  },
  imagesWrapStyle: {
    marginTop: normalizeH(9),
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
    marginTop: normalizeH(13),
    marginBottom: normalizeH(8),
    flexDirection: 'row',
    alignItems: 'center',
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