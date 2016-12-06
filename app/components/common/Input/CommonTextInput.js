/**
 * Created by yangyang on 2016/12/3.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'
import { FormInput } from 'react-native-elements'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'

class CommonTextInput extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
      initValue: {text: this.props.initValue},
      checkValid: this.validInput
    }
    this.props.initInputForm(formInfo)
  }

  validInput(data) {
    if (data.text && data.text.length > 0) {
      return true
    }
    return false
  }

  inputChange(text) {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text}
    }
    this.props.inputFormUpdate(inputForm)
  }

  render() {
    return (
      <View>
        <FormInput
          onChangeText={(text) => this.inputChange(text)}
          autoFocus={this.props.autoFocus}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          maxLength={this.props.maxLength}
          underlineColorAndroid="transparent"
          value={this.props.data}
        />
      </View>
    )
  }
}

CommonTextInput.defaultProps = {
  placeholder: '请输入文字',
  placeholderTextColor: '#c8c8c8',
  maxLength: 16,
  autoFocus: false,
  editable: true,
  initValue: "",
}

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  return {
    data: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CommonTextInput)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
})