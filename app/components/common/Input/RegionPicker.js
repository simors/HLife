/**
 * Created by yangyang on 2016/12/18.
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
import Picker from 'react-native-picker'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import './region/province.json'
import './region/city.json'
import './region/area.json'

const PAGE_WIDTH=Dimensions.get('window').width

class RegionPicker extends Component {
  constructor(props) {
    super(props)
    this.pickerData = []
    this.generatePickerData()
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

  generatePickerData() {
    if (this.props.level) {
      let level = this.props.level
      if (level == 1) {
        province.map((value, key) => {
          this.pickerData.push(value.name)
        })
      } else if (level == 2) {
        province.map((value, key) => {
          let pData = {}
          let pName = value.name
          let pId = value.id
          pData[pName] = []
          let cityArray = city[pId]
          if (cityArray) {
            cityArray.map((value, key) => {
              let cName = value.name
              pData[pName].push(cName)
            })
          }
          this.pickerData.push(pData)
        })
      } else if (level == 3) {
        province.map((value, key) => {
          let pData = {}
          let pName = value.name
          let pId = value.id
          pData[pName] = []
          let cityArray = city[pId]
          if (cityArray) {
            cityArray.map((value, key) => {
              let cName = value.name
              let cId = value.id
              let cData = {}
              cData[cName] = []
              let areaArray = area[cId]
              if (areaArray) {
                areaArray.map((value, key) => {
                  cData[cName].push(value.name)
                })
              }
              pData[pName].push(cData)
            })
          }
          this.pickerData.push(pData)
        })
      }
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

  showPicker() {
    Picker.init({
      pickerTitleText: '请选择地区',
      pickerData: this.pickerData,
      wheelFlex: [1, 1, 1],
      onPickerConfirm: data => {
        console.log(data);
        let text = ""
        data.map((value, index) => {
          text += value
        })
        this.updateInput(text)
      },
      onPickerCancel: data => {
        console.log(data);
      },
      onPickerSelect: data => {
        console.log(data);
      }
    })
    Picker.show()
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this.showPicker()}>
          <View style={styles.container} pointerEvents='none'>
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
      </View>
    )
  }
}

RegionPicker.defaultProps = {
  placeholder: '请选择城市',
  placeholderTextColor: '#E1E1E1',
  level: 3,
  maxLength: 32,
  editable: false,
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
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RegionPicker)

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