/**
 * Created by zachary on 2017/01/10.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Platform
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { FormInput } from 'react-native-elements'
import Picker from 'react-native-picker'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

const PAGE_WIDTH=Dimensions.get('window').width

// const classify = [
//   ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
//   ['时'],
//   ['00', '10', '20', '30', '40', '50'],
//   ['分'],
//   ['--'],
//   ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
//   ['时'],
//   ['00', '10', '20', '30', '40', '50'],
//   ['分']
// ]

const classify = [
  ['00时', '01时', '02时', '03时', '04时', '05时', '06时', '07时', '08时', '09时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
  ['00分', '10分', '20分', '30分', '40分', '50分'],
  ['--'],
  ['00时', '01时', '02时', '03时', '04时', '05时', '06时', '07时', '08时', '09时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
  ['00分', '10分', '20分', '30分', '40分', '50分']
]

class ServiceTimePicker extends Component {
  constructor(props) {
    super(props)
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
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.initValue != nextProps.initValue) {
      this.updateInput(nextProps.initValue)
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
  }

  showPicker() {
    Picker.init({
      pickerTitleText: '营业时间选择',
      pickerData: classify,
      wheelFlex: [1, 1, 1, 1, 1],
      pickerFontSize: 10,
      selectedValue: ["08时", "30分", "--", "22时", "30分"],
      onPickerConfirm: data => {
        // console.log(data)
        let text = data[0].replace('时', ':') + data[1].replace('分', '') + data[2] + data[3].replace('时', ':') + data[4].replace('分', '')
        // console.log(text)
        this.updateInput(text)
      },
      onPickerCancel: data => {
        //console.log(data);
      },
      onPickerSelect: data => {
        //console.log(data);
      }
    })
    Picker.show()
  }

  render() {
    return (
      <TouchableOpacity
        style={{flex: 1}}
        onPress={() => this.showPicker()}
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
          />
        </View>
      </TouchableOpacity>
    )
  }
}

ServiceTimePicker.defaultProps = {
  placeholder: '点击选择营业时间',
  placeholderTextColor: '#B2B2B2',
  maxLength: 32,
  editable: false,
  initValue: "",
  containerStyle: {flex: 1},
  inputStyle: {flex: 1},
}

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  return {
    data: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ServiceTimePicker)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultContainerStyle: {
    flex: 1,
    height: normalizeH(40),
    borderBottomWidth: 0,
    marginLeft: 0,
    marginRight: 0,
    // width: PAGE_WIDTH,
  },
  defaultInputStyle: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderColor: '#E9E9E9',
    fontSize: em(16),
    color: '#030303',
    textAlignVertical: 'center'
  },
})