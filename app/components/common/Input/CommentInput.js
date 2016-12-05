/**
 * Created by wuxingyu on 2016/12/4.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Keyboard,
  TextInput,
  Dimensions,
} from 'react-native'
import { FormInput } from 'react-native-elements'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'

class CommentInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputHeight: 28,
      currentText: ''
    }
  }

  componentDidMount() {
    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey
    }
    this.props.initInputForm(formInfo)
  }

  measure = (event) => {
    let minHeight = 28
    let maxHeight = 57

    if (event.nativeEvent.contentSize.height > 23) {
      if (event.nativeEvent.contentSize.height > maxHeight) {
        this.setState({
          inputHeight: maxHeight
        })
      } else {
        this.setState({
          inputHeight: event.nativeEvent.contentSize.height
        })
      }
    } else {
      this.setState({
        inputHeight: minHeight
      })
    }
  }

  processText = (text) => {
    return text
  }

  inputChange(text) {
    this.setState({currentText: text})
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      text: text
    }
    this.props.inputFormUpdate(inputForm)
  }

  send = () => {}

  renderSubmitButtonEnabled = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.send()
        }}
      >
        <View style={styles.submitButton}>
          <Text style={styles.submitButtonTextEnabled}>发送</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderSubmitButtonDisabled = () => {
    return (
      <View style={styles.submitButton}>
        <Text style={styles.submitButtonTextDisable}>发送</Text>
      </View>
    )
  }

  render() {
    return (
      <View
        style={[styles.mainContainerFocused, {bottom: this.props.keyboardPadding}]}>
        <View style={{backgroundColor: '#d2d2d2', height: 0.5}}/>
        <View style={styles.inputBar}>
          <FormInput containerStyle={styles.inputContainer}
              inputStyle={[styles.inputField, {height: this.state.inputHeight}]}
              multiline={true}
              autoFocus={this.props.autoFocus}
              placeholder={this.props.placeholder}
              placeholderTextColor='#b4b4b4'
              underlineColorAndroid="transparent"
              onChangeText={(text) => {
                this.inputChange(this.processText(text))
              }}
              value={this.state.currentText}
              onChange={this.measure}
            />
          {this.state.currentText ? this.renderSubmitButtonEnabled() : this.renderSubmitButtonDisabled()}
        </View>
      </View>
    )
  }
}

CommentInput.defaultProps = {
  placeholder: '请输入文字...',
  autoFocus: false,
}

const styles = StyleSheet.create({
  mainContainerFocused: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff'
  },
  inputBar: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  inputContainer: {
    flex: 1,
    minHeight: 36,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 12,
    paddingTop: 6,
    paddingBottom: 6,
    borderWidth: 0.5,
    borderColor: '#d2d2d2',
    paddingLeft: 12,
    paddingRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: '#384548',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  sendBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderColor: 'steelblue',
    borderWidth: 0.5,
    borderRadius: 4,
    marginLeft: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  sendBtnText: {
    fontSize: 16,
  },
  submitButton: {
    width: 35,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButtonTextEnabled: {
    fontSize: 15,
    color: '#0081f0',
  },
  submitButtonTextDisable: {
    fontSize: 15,
    color: '#969696',
  },
})

const mapStateToProps = (state, ownProps) => {
  let obj = getInputData(state, ownProps.formKey, ownProps.stateKey)
  console.log("obj", obj)
  return {obj}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CommentInput)