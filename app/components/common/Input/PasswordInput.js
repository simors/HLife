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
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData, getInputFormData} from '../../../selector/inputFormSelector'
import {removeSpace, formatPhone} from '../../../util/numberUtils'
import THEME from '../../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width

class PasswordInput extends Component {
	static defaultProps = {
		placeholder: '设置密码(6-16位数字或字母)',
		maxLength: 16, //6-16位数字或字母
		autoFocus: false
	}

	static phoneFormInfo = {}

	constructor(props) {
		super(props)
		phoneFormInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
	    type: "passwordInput",
		  initValue: ""
		}

		this.state = {showPwd: false}
	}

	componentDidMount() {
    this.props.initInputForm(phoneFormInfo)
  }

  inputChange(text) {
    phoneFormInfo.data = {text}
    this.props.inputFormUpdate(phoneFormInfo)
  }

  onShowPwdClicked = () => {
		this.setState({showPwd: !this.state.showPwd})
	}

	render() {
		const {
	    containerStyle,
	    inputStyle,
	    data,
	    autoCapitalize,
	    autoCorrect,
	    autoFocus,
	    blurOnSubmit,
	    defaultValue,
	    editable,
	    keyboardType,
	    maxLength,
	    multiline,
	    onBlur,
	    onChange,
	    onChangeText,
	    onContentSizeChange,
	    onEndEditing,
	    onFocus,
	    onLayout,
	    onSelectionChange,
	    onSubmitEditing,
	    placeholder,
	    placeholderTextColor,
	    returnKeyType,
	    secureTextEntry,
	    selectTextOnFocus,
	    selectionColor,
	    inlineImageLeft,
	    inlineImagePadding,
	    numberOfLines,
	    returnKeyLabel,
	    underlineColorAndroid,
	    clearButtonMode,
	    clearTextOnFocus,
	    dataDetectorTypes,
	    enablesReturnKeyAutomatically,
	    keyboardAppearance,
	    onKeyPress,
	    selectionState,
	    textInputRef,
	    containerRef,
	  } = this.props
		return (
      <View ref={containerRef} style={[styles.container, containerStyle && containerStyle]}>
	      <TextInput
	        ref={textInputRef}
	        autoCapitalize={autoCapitalize}
	        autoCorrect={autoCorrect}
	        autoFocus={autoFocus}
	        blurOnSubmit={blurOnSubmit}
	        defaultValue={defaultValue}
	        keyboardType={keyboardType}
	        maxLength={maxLength}
	        multiline={multiline}
	        onBlur={onBlur}
	        onChange={onChange}
	        onChangeText={(text) => this.inputChange(text)}
	        onContentSizeChange={onContentSizeChange}
	        onEndEditing={onEndEditing}
	        onFocus={onFocus}
	        onLayout={onLayout}
	        onSelectionChange={onSelectionChange}
	        onSubmitEditing={onSubmitEditing}
	        placeholder={placeholder}
	        placeholderTextColor={placeholderTextColor}
	        returnKeyType={returnKeyType}
	        secureTextEntry={!this.state.showPwd}
	        selectTextOnFocus={selectTextOnFocus}
	        inlineImageLeft={inlineImageLeft}
	        inlineImagePadding={inlineImagePadding}
	        numberOfLines={numberOfLines}
	        returnKeyLabel={returnKeyLabel}
	        underlineColorAndroid={underlineColorAndroid}
	        clearButtonMode={clearButtonMode}
	        clearTextOnFocus={clearTextOnFocus}
	        dataDetectorTypes={dataDetectorTypes}
	        enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
	        keyboardAppearance={keyboardAppearance}
	        onKeyPress={onKeyPress}
	        selectionState={selectionState}
	        editable={editable}
	        selectionColor={selectionColor}
	        value={data}
	        style={[styles.input, inputStyle && inputStyle]} />
        <TouchableWithoutFeedback onPress={this.onShowPwdClicked}>
					<View style={this.state.showPwd ? styles.eyeOpenIcon  : styles.eyeCloseIcon}>
						<Image source={this.state.showPwd ?
							require('../../../assets/images/code_open_eye.png') : require('../../../assets/images/code_close_eye.png')}
						/>
					</View>
				</TouchableWithoutFeedback>
	    </View>)
	}
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
  	top: 18
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

export default connect(mapStateToProps, mapDispatchToProps)(PasswordInput)
