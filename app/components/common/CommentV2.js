/**
 * Created by lilu on 2017/1/19.
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager,
  TextInput,
  Modal,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import Symbol from 'es6-symbol'
import * as Toast from './Toast'
import CommonModal from './CommonModal'
import ImageGroupInput from './Input/ImageGroupInput'
import TextAreaInput from './Input/TextAreaInput'
import ScoreInput from './Input/ScoreInput'
import {getInputFormData, isInputFormValid, getInputData, isInputValid} from '../../selector/inputFormSelector'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')
const scoreInput = {
  formKey: commonForm,
  stateKey: Symbol('scoreInput'),
  type: 'score'
}
const commentInput = {
  formKey: commonForm,
  stateKey: Symbol('contentInput'),
  type: 'content'
}
const imageGroupInput = {
  formKey: commonForm,
  stateKey: Symbol('imageGroupInput'),
  type: 'imgGroup'
}

class CommentV2 extends Component {
  static propTypes = {
    showModules: React.PropTypes.array
  }

  static defaultProps = {
    showModules: ['score', 'content', 'blueprint']
  }

  constructor(props) {
    super(props)
    this.state = {
      content: '',
      animationType: this.props.animationType ? this.props.animationType : 'none',
      transparent: true,
      visible: false
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.modalVisible != newProps.modalVisible) {
      this.setState({
        visible: newProps.modalVisible,
        content: newProps.content,
      })
    }
  }

  componentDidMount() {
    this.setState({visible: !!this.props.modalVisible})
  }


  submitComment() {
    this.props.submitComment(this.state)
  }

  renderComment() {
    if (this.props.showModules.indexOf('content') >= 0) {
      return (
        <View style={[styles.modalRow]}>
            <TextAreaInput
              replyInputRefCallBack={(input) =>{this.props.replyInputRefCallBack(input)}}
              {...commentInput}
              placeholder={this.props.textAreaPlaceholder || "回复"}
              clearBtnStyle={{right: normalizeW(10), top: normalizeH(60)}}
            />
        </View>
      )
    }
  }


  render() {

    return (

            <View style={styles.modalCommentWrap}>
               {this.renderComment()}
              <TouchableOpacity style={{}} onPress={this.submitComment.bind(this)}>
                <View style={styles.submitBtnWrap}>
                  <Text style={styles.submitBtn}>发表</Text>
                </View>
              </TouchableOpacity>
            </View>



    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const formData = getInputFormData(state, commonForm)
  let content = ''
  if (formData) {
    if (formData.content) {
      content = formData.content.text
    }
  }
  return {
    content: content,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CommentV2)

const styles = StyleSheet.create({
  modalCommentWrap: {
    width:PAGE_WIDTH,
    backgroundColor:'#F9F9F9',
   // height:normalizeH(129)
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  closeTop: {
    // height:normalizeH(507)
    ...Platform.select({
      ios: {
        height: normalizeH(507),
      },
      android: {
        height: normalizeH(487)
      }
    }),
  },

    modalRow: {
      // flexDirection: 'row',
      marginTop: normalizeH(10),
      marginLeft: normalizeW(10),
      width:normalizeW(345),
        height:normalizeH(100),
      marginRight:normalizeW(10),
      backgroundColor:'#FFFFFF',
      borderRadius:normalizeBorder(5)
    },
    submitBtnWrap: {
      height: normalizeH(30),
      width:normalizeW(60),
      marginLeft: normalizeW(300),

      backgroundColor: '#50E3C2',
      borderRadius:normalizeH(5),
      alignItems:'center',
      flexDirection:'row',
      justifyContent:'center',
      marginTop:normalizeH(10),
      marginBottom:normalizeH(10),
    },
    submitBtn: {
      fontSize: em(17),
      color: '#fff'
    }
  })