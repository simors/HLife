/**
 * Created by yangyang on 2016/12/3.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { FormInput } from 'react-native-elements'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

const PAGE_WIDTH=Dimensions.get('window').width

class CommonTextInput extends Component {

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
      checkValid: this.validInput
    }
    this.props.initInputForm(formInfo)

    if (formInfo.initValue.text.length > 0) {
      this.setState({showClear: true})
    }
  }

  validInput(data) {
    if (data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '输入有误'}
  }

  inputChange(text) {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text}
    }
    this.props.inputFormUpdate(inputForm)

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
      <View style={styles.container}>
        <FormInput
          onChangeText={(text) => this.inputChange(text)}
          autoFocus={this.props.autoFocus}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          maxLength={this.props.maxLength}
          underlineColorAndroid="transparent"
          value={this.props.data}
          containerStyle={[styles.defaultContainerStyle, this.props.containerStyle]}
          inputStyle={[styles.defaultInputStyle, this.props.inputStyle]}
        />
        {this.renderClearBtn()}
      </View>
    )
  }
}

CommonTextInput.defaultProps = {
  placeholder: '请输入文字',
  placeholderTextColor: '#B2B2B2',
  maxLength: 16,
  autoFocus: false,
  editable: true,
  initValue: "",
  containerStyle: {flex: 1},
  inputStyle: {flex: 1},
  clearBtnStyle: {},
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultContainerStyle: {
    flex: 1,
    paddingLeft: normalizeW(17),
    paddingRight: normalizeW(17),
    height: normalizeH(50),
    borderBottomWidth: 0,
    marginLeft: 0,
    marginRight: 0,
    width: PAGE_WIDTH,
  },
  defaultInputStyle: {
    flex: 1,
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(10),
    backgroundColor: '#F3F3F3',
    borderWidth: normalizeBorder(),
    borderColor: '#E9E9E9',
    fontSize: em(16),
    color: '#B2B2B2'
  },
  defaultClearBtnStyle: {
    position: 'absolute',
    right: normalizeW(25),
    top: normalizeH(12)
  },
})