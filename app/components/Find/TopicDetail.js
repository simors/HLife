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
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {TopicShow} from './TopicShow'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {TopicComment} from './TopicComment'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TopicDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onButtonPress() {
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="详情"
          rightType="text"
          rightText="..."
          rightPress={() => this.onButtonPress()}
        />

        <KeyboardAwareScrollView style={styles.body}>
          <TopicShow topic={this.props.topic}
                     numberOfValues={null}
                     showCommentAndLikeButton={false}/>
          <View style={styles.likeStyle}>
            <View style={styles.zanStyle}>
              <Text style={styles.zanTextStyle}>
                赞
              </Text>
            </View>
          </View>
          <TopicComment />
          <TopicComment hasParentComment={true}/>
          <TopicComment />
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

TopicDetail.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TopicDetail)

//export
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    justifyContent: 'flex-start',
  },

  body: {
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
    flex: 1,
    backgroundColor: '#E5E5E5',
    width: PAGE_WIDTH
  },

  likeStyle: {
    backgroundColor: '#E5E5E5',
    height: normalizeH(59),
    alignItems: 'flex-start',
    flexDirection: 'row',
  },

  zanStyle: {
    backgroundColor: THEME.colors.green,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    height: normalizeH(35),
    alignSelf: 'center',
    borderRadius: 100,
    marginLeft:normalizeW(12),
    width: normalizeW(35),
  },
  zanTextStyle: {
    fontSize: em(17),
    color: "#ffffff",
    marginTop: normalizeH(7),
    alignSelf: 'center',
  },
})