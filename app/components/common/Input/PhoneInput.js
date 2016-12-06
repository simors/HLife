import React, {Component} from 'react'
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
	Platform,
	TextInput
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData, getInputFormData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import {removeSpace, formatPhone} from '../../../util/numberUtils'
import THEME from '../../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width

class PhoneInput extends Component {
	static defaultProps = {
		placeholder: '请输入手机号',
		maxLength: 13, //11位手机号+2位空格
		autoFocus: false,
		keyboardType: "phone-pad"
	}

	static phoneFormInfo = {}

	constructor(props) {
		super(props)
		phoneFormInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
	    type: "phoneInput",
		  initValue: ""
		}
	}

	componentDidMount() {
    this.props.initInputForm(phoneFormInfo)
  }

  inputChange(text) {
  	let _text = removeSpace(text)
    phoneFormInfo.data = {text}
    this.props.inputFormUpdate(phoneFormInfo)
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
	        secureTextEntry={secureTextEntry}
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
	    </View>)
	}
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
    data: formatPhone(inputData.text)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
	initInputForm,
  inputFormUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PhoneInput)
