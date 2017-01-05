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
  InteractionManager,
  WebView,
} from 'react-native'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import THEME,{INNER_CSS} from '../../constants/themes/theme1'
import {getConversationTime} from '../../util/numberUtils'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import WebHtmlView from 'react-native-webhtmlview'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TopicContent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View style={[styles.containerStyle, this.props.containerStyle]}>
        <View style={styles.titleContainerStyle}>
          <Text style={styles.titleStyle}>
            {this.props.topic.title}
          </Text>
        </View>
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
        <WebHtmlView
          source={{html: this.props.topic.content}}
          innerCSS={INNER_CSS}
        />
      </View>

    )
  }
}

TopicContent.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(TopicContent)


//export
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#fff'
  },
  titleContainerStyle: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'center',
    width: PAGE_WIDTH,
  },
  titleStyle: {
    fontSize: em(20),
    flex: 1,
    paddingTop: normalizeW(10),
    paddingBottom: normalizeH(10),
    backgroundColor: '#FFFFFF',
    color: '#4a4a4a',
    alignItems: 'center'
  },
  //用户、时间、地点信息
  introWrapStyle: {
    flex:1,
    marginTop: normalizeH(12),
    marginLeft: normalizeW(12),
    marginBottom: normalizeH(15),
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
})