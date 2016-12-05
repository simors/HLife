/**
 * Created by yangyang on 2016/12/3.
 */
import React, {Component} from 'react'
import {
  View,
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
      stateKey: this.props.stateKey
    }
    this.props.initInputForm(formInfo)
  }

  inputChange(text) {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      text: text
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
  editable: true
}

const mapStateToProps = (state, ownProps) => {
  let obj = getInputData(state, ownProps.formKey, ownProps.stateKey)
  console.log("obj", obj)
  return {obj}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CommonTextInput)