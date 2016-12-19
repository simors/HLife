/**
 * Created by yangyang on 2016/12/17.
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

const PAGE_WIDTH=Dimensions.get('window').width

const classfy = [
  {
    '妇科': ['全部妇科']
  },
  {
    '儿科': ['全部儿科', '小儿科', '新生儿科']
  },
  {
    '皮肤性病科': ['全部皮肤性病科', '皮肤科', '性病科']
  },
  {
    '内科': ['全部内科', '呼吸内科', '消化内科', '神经内科', '心血管内科', '肾内科', '血液内科', '风湿免疫科', '内分泌科']
  },
  {
    '男科': ['全部男科']
  },
  {
    '产科': ['全部产科']
  },
  {
    '外科': ['全部外科', '普通外科', '神经外科', '心胸外科', '泌尿外科', '心血管外科', '乳腺外科', '肝胆外科', '器官移植',
      '肛肠外科', '烧伤科', '骨外科', '甲状腺乳腺外科']
  },
  {
    '中医科': ['全部中医科']
  },
  {
    '骨伤科': ['全部骨伤科', '脊柱科', '关节科', '创伤科']
  },
  {
    '精神心理科': ['全部精神心理科', '精神科', '心理科']
  },
  {
    '口腔颌面科': ['全部口腔颌面科']
  },
  {
    '眼科': ['全部眼科']
  },
  {
    '耳鼻咽喉科': ['全部耳鼻咽喉科', '耳科', '鼻科', '咽喉科']
  },
  {
    '肿瘤及防治科': ['全部肿瘤及防治科', '肿瘤内科', '肿瘤外科', '介入与放疗科', '肿瘤中医科']
  },
  {
    '整形美容科': ['全部整形美容科']
  },
  {
    '报告解读科': ['全部报告解读科', '检验科', '放射科', '内镜科', '病理科', '心电图科', '超声科', '麻醉科', '体检中心', '预防保健科']
  },
  {
    '营养科': ['全部营养科']
  }
]

class MedicalLabPicker extends Component {
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
    return true
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

  clearInput() {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text: ''}
    }
    this.props.inputFormUpdate(inputForm)
    this.setState({showClear: false})
  }

  showPicker() {
    Picker.init({
      pickerTitleText: '请选择科室',
      pickerData: classfy,
      wheelFlex: [1, 2],
      onPickerConfirm: data => {
        console.log(data);
        let text = ""
        data.map((value, index) => {
          if (index == 0) {
            text = value.toString()
          } else {
            text = text + "->" +value
          }
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

  renderClearBtn() {
    if (this.state.showClear) {
      return (
        <View style={[styles.defaultClearBtnStyle, this.props.clearBtnStyle]}>
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

  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this.showPicker()}>
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
            />
            {this.renderClearBtn()}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

MedicalLabPicker.defaultProps = {
  placeholder: '请选择科室',
  placeholderTextColor: '#B2B2B2',
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
  inputFormUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MedicalLabPicker)

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