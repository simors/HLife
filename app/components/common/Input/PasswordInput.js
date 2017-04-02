import React, {Component} from 'react'
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Dimensions,
	Platform,
	TextInput,
	TouchableWithoutFeedback
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { FormInput } from 'react-native-elements'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData, getInputFormData} from '../../../selector/inputFormSelector'
import {removeSpace, formatPhone} from '../../../util/numberUtils'
import THEME from '../../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width

class PasswordInput extends Component {

	constructor(props) {
		super(props)
		this.state = {showPwd: false}
	}

	componentDidMount() {
		let formInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
	    type: "passwordInput",
		  initValue: "",
			checkValid: this.validInput
		}
    this.props.initInputForm(formInfo)
  }

	validInput(data) {
		if(!data.text){
			return {isVal:false, errMsg:"未填写密码"}
		}
		if (!(/^([0-9a-zA-Z]){6,16}$/.test(data.text))) {
			return {isVal:false, errMsg:"密码须为6-16位大小写和数字字符"}
		}
		return {isVal:true, errMsg:"ok"}
	}

  inputChange(text) {
  	let formInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
		  data: {text}
		}
    this.props.inputFormUpdate(formInfo)
  }

  onShowPwdClicked = () => {
		this.setState({showPwd: !this.state.showPwd})
	}

	render() {
		return (
      <View style={[styles.container, this.props.containerStyle && this.props.containerStyle]}>
	      <FormInput
		      onChangeText={(text) => this.inputChange(text)}
		      autoFocus={this.props.autoFocus}
		      placeholder={this.props.placeholder}
		      placeholderTextColor={this.props.placeholderTextColor}
		      maxLength={this.props.maxLength}
		      secureTextEntry={!this.state.showPwd}
		      underlineColorAndroid="transparent"
		      containerStyle={{marginLeft:0, marginRight: 0,borderBottomWidth:0}}
		      value={this.props.data}
		      inputStyle={[styles.input, this.props.inputStyle && this.props.inputStyle]}
	      />
	      <View style={[this.state.showPwd ? styles.eyeOpenIcon  : styles.eyeCloseIcon,
	              {right:
	               (this.props.containerStyle && this.props.containerStyle.paddingRight)
	               ? (this.props.inputStyle && this.props.inputStyle.marginRight)
	                  ? this.props.containerStyle.paddingRight + this.props.inputStyle.marginRight + 15
	                  : this.props.containerStyle.paddingRight + 15
	               : (this.props.inputStyle && this.props.inputStyle.marginRight)
	                  ? THEME.base.inputContainer.paddingRight + this.props.inputStyle.marginRight + 15
	                  : THEME.base.inputContainer.paddingRight + 15}]}>
		      <TouchableWithoutFeedback onPress={this.onShowPwdClicked}>
			      <Image width={35} height={35} source={this.state.showPwd ?
								require('../../../assets/images/code_open_eye.png') : require('../../../assets/images/code_close_eye.png')}
			      />
		      </TouchableWithoutFeedback>
	      </View>
	    </View>
		)
	}
}

PasswordInput.defaultProps = {
	placeholder: '设置密码(6-16位数字或字母)',
	maxLength: 16, //6-16位数字或字母
	autoFocus: false,
  placeholderTextColor: '#E1E1E1',
  editable: true
}

const styles = StyleSheet.create({
  container: {
    ...THEME.base.inputContainer
  },
  input: {
    ...THEME.base.input
  },
  eyeOpenIcon: {
  	position: 'absolute',
  	right: 15,
  	top: 10
  },
  eyeCloseIcon: {
  	position: 'absolute',
  	right: 15,
  	top: 12
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
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PasswordInput)
