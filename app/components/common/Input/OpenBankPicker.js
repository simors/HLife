/**
 * Created by wanpeng on 2017/4/12.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { FormInput } from 'react-native-elements'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import CascadePicker from './CascadePicker'

const PAGE_WIDTH=Dimensions.get('window').width

class OpenBankPicker extends Component {
  constructor(props) {
    super(props)
    this.pickerData = [['长沙银行', '中国银行', '招商银行']]
  }

  componentDidMount() {
    let formInfo = {}
    if (this.props.initSelected && 0 != this.props.initSelected.length) {
      let initValue = {}
      let initSelected = this.props.initSelected
      if (this.props.level == 1) {
        initValue.text = {province: initSelected[0]}
      } else if (this.props.level == 2) {
        initValue.text = {province: initSelected[0], city: initSelected[1]}
      } else {
        initValue.text = undefined
      }
      formInfo = {
        formKey: this.props.formKey,
        stateKey: this.props.stateKey,
        type: this.props.type,
        initValue: initValue,
        checkValid: this.props.checkValid || this.validInput
      }
    } else {
      formInfo = {
        formKey: this.props.formKey,
        stateKey: this.props.stateKey,
        type: this.props.type,
        checkValid: this.props.checkValid || this.validInput
      }
    }

    this.props.initInputForm(formInfo)

    if (formInfo.initValue && formInfo.initValue.text.length > 0) {
      this.setState({showClear: true})
    }
  }

  validInput(data) {
    return {isVal: true, errMsg: '验证通过'}
  }

  updateInput(text) {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text}
    }
    this.props.inputFormUpdate(inputForm)
  }

  inputChange(text) {
    this.updateInput(text)

    if (text.length > 0) {
      this.setState({showClear: true})
    } else {
      this.setState({showClear: false})
    }
  }

  getPickerData(data) {
    console.log("getPickerData data", data)
    if (!this.props.level) {
      return
    }
    let text = {}
    if (this.props.level == 1) {
      text = {
        bank: data[0],
      }
    } else if (this.props.level == 2) {
      text = {
        bank: data[0],
        bankType: data[1],
      }
    }
    this.updateInput(text)
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <CascadePicker
          onSubmit={(data) => this.getPickerData(data)}
          level={this.props.level}
          title="请选择银行"
          data={this.pickerData}
          initSelected={this.props.initSelected}
          cascade={false}
        >
          <View style={styles.container} pointerEvents="none">
            <FormInput
              onChangeText={(text) => this.inputChange(text)}
              editable={this.props.editable}
              placeholder={this.props.placeholder}
              placeholderTextColor={this.props.placeholderTextColor}
              maxLength={this.props.maxLength}
              underlineColorAndroid="transparent"
              value={this.props.data}
              containerStyle={[styles.defaultContainerStyle, this.props.containerStyle]}
              inputStyle={[styles.defaultInputStyle, this.props.inputStyle]}
              mode={this.props.mode}
            />
          </View>
        </CascadePicker>
      </View>
    )
  }
}

OpenBankPicker.defaultProps = {
  placeholder: '请选择银行',
  placeholderTextColor: '#E1E1E1',
  level: 1,
  maxLength: 32,
  editable: false,
  containerStyle: {flex: 1},
  inputStyle: {flex: 1},
  clearBtnStyle: {},
}

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  let text = inputData.text
  return {
    data: text? text.bank: undefined,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OpenBankPicker)

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    // width: PAGE_WIDTH,
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
})