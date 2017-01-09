/**
 * Created by zachary on 2016/12/13.
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
  TextInput
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

class Comment extends Component {
  static propTypes = {
    showModules: React.PropTypes.array
  }

  static defaultProps = {
    showModules: ['score', 'content', 'blueprint']
  }

  constructor(props) {
    super(props)
    this.state = {
      score: 0,
      content: '',
      blueprints: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      score: nextProps.score,
      content: nextProps.content,
      blueprints: nextProps.blueprints
    })
  }

  submitComment() {
    this.props.submitComment(this.state)
  }

  renderScore() {
    if(this.props.showModules.indexOf('score') >= 0) {
      return (
        <View style={[styles.modalRow, styles.modalScoreWrap]}>
          <View style={[styles.modalCol, styles.modalColScore]}>
            <Text style={[styles.modalLabel]}>{this.props.scoreLabel || '请打分:'}</Text>
          </View>
          <View style={[styles.modalCol3, styles.modalScoreCol3]}>
            <ScoreInput
              {...scoreInput}
            />
          </View>
        </View>
      )
    }
  }

  renderComment() {
    if(this.props.showModules.indexOf('content') >= 0) {
      return (
        <View style={[styles.modalRow]}>
          <View style={[styles.modalCol]}>
            <Text style={[styles.modalLabel]}>{this.props.contentLabel || '点评:'}</Text>
          </View>
          <View style={[styles.modalCol3]}>
            <TextAreaInput
              {...commentInput}
              placeholder={this.props.textAreaPlaceholder || "请填写评论"}
              clearBtnStyle={{right: 10,top: 40}}
            />

          </View>
        </View>
      )
    }
  }

  renderBlueprint() {
    if(this.props.showModules.indexOf('blueprint') >= 0) {
      return (
        <View>
          <View style={[styles.modalRow]}>
            <View style={[styles.modalCol, {alignItems:'center'}]}>
              <Text style={[styles.modalLabel]}>{this.props.blueprintLabel || '晒图'}</Text>
            </View>
          </View>

          <View style={{flex: 1}}>
            <View style={[styles.modalCol3]}>
              <ImageGroupInput {...imageGroupInput} number={9} imageLineCnt={3}/>
            </View>
          </View>
        </View>
      )
    }
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.modalVisible}
        modalTitle={this.props.modalTitle}
        closeModal={() => this.props.closeModal()}
        containerStyle={styles.containerStyle}
      >
        <ScrollView>
          <View style={styles.modalCommentWrap}>
            {this.renderScore()}
            {this.renderComment()}
            {this.renderBlueprint()}
          </View>
        </ScrollView>
        <TouchableOpacity style={{}} onPress={this.submitComment.bind(this)}>
          <View style={[styles.modalRow, styles.submitBtnWrap]}>
            <Text style={styles.submitBtn}>发表评论</Text>
          </View>
        </TouchableOpacity>
      </CommonModal>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const formData = getInputFormData(state, commonForm)
  let score = 0
  let content = ''
  let imgGroup = []
  if(formData) {
    if(formData.score) {
      score = formData.score.text
    }
    if(formData.content) {
      content = formData.content.text
    }
    if(formData.imgGroup) {
      imgGroup = formData.imgGroup.text
    }
  }
  return {
    score: score,
    content: content,
    blueprints: imgGroup
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Comment)

const styles = StyleSheet.create({
  modalCommentWrap: {
    paddingTop: 20,
    paddingBottom: 20,

  },
  containerStyle: {
    ...Platform.select({
      android: {
        position:'absolute'
      }
    }),
  },
  modalRow: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingLeft:20,
    paddingRight:20
  },
  modalCol: {
    flex: 1,
    paddingRight: 10,
    alignItems: 'flex-end'
  },
  modalColScore: {
    justifyContent: 'center'
  },
  modalCol3: {
    flex: 3,
    justifyContent: 'center'
  },
  modalScoreCol3: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  modalLabel: {
    fontSize: em(17),
    color: '#8f8e94'
  },
  scoreImage: {
    width: 20,
    height:20,
    marginRight:10
  },
  textInputContainer: {
    height: 100,
    padding:8,
    borderColor: THEME.colors.lighter,
    borderWidth: normalizeBorder()
  },
  submitBtnWrap: {
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.green
  },
  submitBtn: {
    fontSize: em(17),
    color: '#fff'
  }
})