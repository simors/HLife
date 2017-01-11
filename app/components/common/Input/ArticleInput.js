/**
 * Created by yangyang on 2017/1/11.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Keyboard,
  Platform,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ArticleInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyboardPadding: 0,
    }
    this.comp = []
    this.comp.push(this.renderTextInput())
  }

  componentDidMount() {
    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }

    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
      initValue: {text: this.props.initValue},
      checkValid: this.validInput
    }
    this.props.initInputForm(formInfo)
  }

  componentWillUnmount() {
    if (Platform.OS == 'ios') {
      Keyboard.removeListener('keyboardWillShow', this.keyboardWillShow)
      Keyboard.removeListener('keyboardWillHide', this.keyboardWillHide)
    } else {
      Keyboard.removeListener('keyboardDidShow', this.keyboardWillShow)
      Keyboard.removeListener('keyboardDidHide', this.keyboardWillHide)
    }
  }

  keyboardWillShow = (e) => {
    this.setState({
      keyboardPadding: e.endCoordinates.height,
    })
  }

  keyboardWillHide = (e) => {
    this.setState({
      keyboardPadding: 0,
    })
  }

  validInput(data) {
    return {isVal: true, errMsg: '验证通过'}
  }

  inputChange(text) {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text}
    }
    this.props.inputFormUpdate(inputForm)
  }

  renderTextInput() {
    return (
      <AutoGrowingTextInput
        style={styles.InputStyle}
        placeholder={this.props.placeholder}
        editable={this.props.editable}
        underlineColorAndroid="transparent"
      />
    )
  }

  renderComponents() {
    return (
      this.comp.map((component, key) => {
        return (
          <View key={key}>
            {component}
          </View>
        )
      })
    )
  }

  renderEditToolView() {
    return (
      <View style={[styles.editToolView,
        {
          position: 'absolute',
          right: 50,
          bottom: this.state.keyboardPadding + this.props.wrapHeight + 50,
        }]}
      >
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => {this.simplifyInsertImage()}}
                            style={{alignItems: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: 25, backgroundColor: '#eeeeee'}}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../../../assets/images/insert_picture.png')}>
            </Image>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          keyboardDismissMode="on-drag"
          automaticallyAdjustContentInsets={false}
        >
          {this.renderComponents()}
        </KeyboardAwareScrollView>
        {this.renderEditToolView()}
      </View>
    )
  }
}

ArticleInput.defaultProps = {
  editable: true,
  placeholder: '输入文字...',
  wrapHeight: 0,
}

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  return {
    data: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ArticleInput)

const styles = StyleSheet.create({
  container: {
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  },
  InputStyle: {
    width: PAGE_WIDTH,
    fontSize: em(16),
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E6E6E6',
    textAlign: "left",
    textAlignVertical: "top"
  },
  editToolView: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
})