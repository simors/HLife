import React, {Component} from 'react'
import {
	StyleSheet,
	Dimensions,
  View,
  Image,
  TouchableOpacity,
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
    this.state = {
      showClear: false,
    }
	}

	componentDidMount() {
		let formInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
	    type: this.props.type,
		  initValue: {text: this.props.initValue}
		}
    this.props.initInputForm(formInfo)
    if (formInfo.initValue.text && formInfo.initValue.text.length > 0) {
      this.setState({showClear: true})
    }
  }

  inputChange(text) {
  	let _text = removeSpace(text)
  	let formInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
	    data: {text: _text}
		}
    this.props.inputFormUpdate(formInfo)

    if (text.length > 0) {
      this.setState({showClear: true})
    } else {
      this.setState({showClear: false})
    }
  }

  renderClearBtn() {
    if (this.state.showClear) {
      return (
        <View style={[styles.defaultClearBtnStyle,
            {right:
               (this.props.containerStyle && this.props.containerStyle.paddingRight)
               ? (this.props.inputStyle && this.props.inputStyle.marginRight)
                  ? this.props.containerStyle.paddingRight + this.props.inputStyle.marginRight + 12
                  : this.props.containerStyle.paddingRight + 12
               : (this.props.inputStyle && this.props.inputStyle.marginRight)
                  ? THEME.base.inputContainer.paddingRight + this.props.inputStyle.marginRight + 12
                  : THEME.base.inputContainer.paddingRight + 12},
            this.props.clearBtnStyle]}>
          <TouchableOpacity onPress={() => this.clearInput()}>
            <Image style={{width: 25, height: 25}} source={require('../../../assets/images/delete.png')} />
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  clearInput() {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text: ''}
    }
    this.props.inputFormUpdate(inputForm)
    this.setState({showClear: false})
  }

	render() {
		return (
      <View style={styles.containerWrap}>
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
        /> 
        {this.renderClearBtn()}
      </View>
      )
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
  containerWrap: {
    
  },
  defaultClearBtnStyle: {
    position: 'absolute',
    right: normalizeW(12),
    top: normalizeH(12)
  },
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
