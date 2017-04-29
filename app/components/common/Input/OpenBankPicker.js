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
import './openBank.json'

class OpenBankPicker extends Component {
  constructor(props) {
    super(props)
    this.pickerData = openBank
  }

  componentDidMount() {
    let formInfo = {}
    if (this.props.initSelected && 0 != this.props.initSelected.length) {
      let initSelected = this.props.initSelected

      formInfo = {
        formKey: this.props.formKey,
        stateKey: this.props.stateKey,
        type: this.props.type,
        initValue: initSelected.label,
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
    let label = data[0]
    let index = this.pickerData.findIndex((value) => {
      return value.label === label
    })
    let text = {
      open_bank: this.pickerData[index].label,
      open_bank_code: this.pickerData[index].value
    }
    this.updateInput(text)
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <CascadePicker
          onSubmit={(data) => this.getPickerData(data)}
          level={1}
          title="请选择银行"
          data={this.pickerData}
          cascade={true}
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
  placeholder: '选择银行',
  placeholderTextColor: '#E1E1E1',
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
    data: text? text.open_bank: undefined,
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