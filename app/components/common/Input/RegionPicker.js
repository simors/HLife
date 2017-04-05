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
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import CascadePicker from './CascadePicker'
import {selectProvincesAndCities} from '../../../selector/configSelector'

const PAGE_WIDTH=Dimensions.get('window').width

class RegionPicker extends Component {
  constructor(props) {
    super(props)
    this.pickerData = []
    this.generateArea()
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

    if (formInfo.initValue.text.length > 0) {
      this.setState({showClear: true})
    }
  }

  generateArea() {
    let data = this.props.area
    if (this.props.level == 1) {
      data.forEach((province) => {
        let area = {}
        area.label = province.area_name
        area.value = province.area_name
        this.pickerData.push(area)
      })
    } else if (this.props.level == 2) {
      data.forEach((province) => {
        let area = {}
        area.label = province.area_name
        let cities = []
        province.sub.forEach((city) => {
          let cityObj = {}
          cityObj.label = city.area_name
          cityObj.value = city.area_name
          cities.push(cityObj)
        })
        area.value = cities
        this.pickerData.push(area)
      })
    } else if (this.props.level == 3) {
      data.forEach((province) => {
        let area = {}
        area.label = province.area_name
        let cities = []
        province.sub.forEach((city) => {
          let cityObj = {}
          cityObj.label = city.area_name
          let districts = []
          // 有某些城市不存在区
          if (city.sub && Array.isArray(city.sub)) {
            city.sub.forEach((district) => {
              let districtObj = {}
              districtObj.label = district.area_name
              districtObj.value = district.area_name
              districts.push(districtObj)
            })
            cityObj.value = districts
          } else {
            cityObj.value = city.area_name
          }
          cities.push(cityObj)
        })
        area.value = cities
        this.pickerData.push(area)
      })
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
    if (!this.props.level) {
      return
    }
    let text = {}
    if (this.props.level == 1) {
      text = {
        province: data[0],
      }
    } else if (this.props.level == 2) {
      text = {
        province: data[0],
        city: data[1],
      }
    } else if (this.props.level == 3) {
      text = {
        province: data[0],
        city: data[1],
        district: data[2],
      }
    }
    this.updateInput(text)
  }

  render() {
    return (
      <View>
        <CascadePicker onSubmit={(data) => this.getPickerData(data)} level={this.props.level} title="请选择地区" data={this.pickerData}>
          <View style={styles.container}>
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
  mode: 'join', // 模式选项，join模式表示组织数据时，选择的地址连接起来作为一个字段；segment表示地址分字段保存，即省、市、区三个字段分别保存数据
}

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  let data = ""
  let text = inputData.text
  let area = selectProvincesAndCities(state)
  if (ownProps.mode == 'join') {
    data = text
  } else {
    if (text) {
      data = text.province + text.city + text.district
    }
  }
  return {
    data,
    area,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RegionPicker)

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