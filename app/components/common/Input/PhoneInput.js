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
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {removeSpace, formatPhone} from '../../../util/numberUtils'
import THEME from '../../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width

class  PhoneInput extends Component {

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
		  initValue: {text: this.props.initValue},
      checkValid: this.props.checkValid || this.validInput
		}
    this.props.initInputForm(formInfo)
    if (formInfo.initValue.text && formInfo.initValue.text.length > 0) {
      this.setState({showClear: true})
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if(this.props.initValue != nextProps.initValue) {
      this.inputChange(nextProps.initValue)
    }
  }

  validInput(data) {
    if(!data || !data.text){
      return {isVal:false, errMsg:"手机号不能为空"}
    }

    let phoneNum = data.text
    if (!(/^1[34578]\d{9}$/.test(phoneNum))
      && !/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(phoneNum)) {
      return {isVal:false, errMsg:"手机号码格式有误，请重填"}
    }
    return {isVal:true, errMsg:"ok"}
  }

  inputChange(text) {
  	let _text = removeSpace(text)
  	let formInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
	    data: {text: _text}
		}
    this.props.inputFormUpdate(formInfo)

    if (text && text.length > 0) {
      this.setState({showClear: true})
    } else {
      this.setState({showClear: false})
    }
  }

  renderClearBtn() {
    if (this.state.showClear && this.props.editable) {
      return (
        <View style={[styles.defaultClearBtnStyle, this.props.clearBtnStyle]}>
          <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => this.clearInput()}>
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
      <View style={[styles.containerWrap, this.props.outContainerWrap]}>
        <FormInput
          onChangeText={(text) => this.inputChange(text)}
          autoFocus={this.props.autoFocus}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          maxLength={this.props.maxLength}
          underlineColorAndroid="transparent"
          value={
            this.props.noFormatPhone
              ? this.props.data
              : formatPhone(this.props.data)
          }
          keyboardType={this.props.keyboardType}
          containerStyle={[styles.container, this.props.containerStyle && this.props.containerStyle]}
          inputStyle={[styles.input, this.props.inputStyle && this.props.inputStyle]}
          editable={this.props.editable}
        /> 
        {this.props.showClearBtn ? this.renderClearBtn() : <View/>}
      </View>
    )
	}
}

PhoneInput.defaultProps = {
	placeholder: '请输入手机号',
	maxLength: 13, //11位手机号+2位空格
	autoFocus: false,
	keyboardType: "phone-pad",
  placeholderTextColor: '#E1E1E1',
  editable: true,
  showClearBtn: true,
}

const styles = StyleSheet.create({
  containerWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: normalizeBorder(),
    borderColor: '#E9E9E9',
  },
  defaultClearBtnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: normalizeW(15),
  },
  container: {
    flex: 1,
    paddingLeft: normalizeW(17),
    paddingRight: normalizeW(10),
    borderBottomWidth: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  input: {
    height: normalizeH(50),
    padding: 0,
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(10),
    backgroundColor: '#F3F3F3',
    fontSize: em(17),
    color: '#B2B2B2',
    textAlignVertical: 'center',
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

export default connect(mapStateToProps, mapDispatchToProps)(PhoneInput)
