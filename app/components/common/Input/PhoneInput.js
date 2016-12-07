import React, {Component} from 'react'
import {
	StyleSheet,
	Dimensions,
	Platform
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { FormInput } from 'react-native-elements'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData, getInputFormData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import {removeSpace, formatPhone} from '../../../util/numberUtils'
import THEME from '../../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width

class PhoneInput extends Component {

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		let formInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
	    type: "phoneInput",
		  initValue: ""
		}
    this.props.initInputForm(formInfo)
  }

  inputChange(text) {
  	let _text = removeSpace(text)
  	let formInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
	    data: {text: _text}
		}
    this.props.inputFormUpdate(formInfo)
  }

	render() {
		return (
      <FormInput
        onChangeText={(text) => this.inputChange(text)}
        autoFocus={this.props.autoFocus}
        placeholder={this.props.placeholder}
        placeholderTextColor={this.props.placeholderTextColor}
        maxLength={this.props.maxLength}
        underlineColorAndroid="transparent"
        value={formatPhone(this.props.data)}
        containerStyle={[styles.container, this.props.containerStyle && this.props.containerStyle]}
        inputStyle={[styles.input, this.props.inputStyle && this.props.inputStyle]}
      />)
	}
}

PhoneInput.defaultProps = {
	placeholder: '请输入手机号',
	maxLength: 13, //11位手机号+2位空格
	autoFocus: false,
	keyboardType: "phone-pad",
  placeholderTextColor: '#B2B2B2',
  editable: true
}

const styles = StyleSheet.create({
  container: {
    ...THEME.base.inputContainer
  },
  input: {
    ...THEME.base.input
  }
})

const mapStateToProps = (state, ownProps) => {
	let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  //let formData = getInputFormData(state, ownProps.formKey)
  return {
    data: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
	initInputForm,
  inputFormUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PhoneInput)
