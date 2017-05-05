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
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import CascadePicker from './CascadePicker'

const PAGE_WIDTH=Dimensions.get('window').width

const classify = [
  ['00时', '01时', '02时', '03时', '04时', '05时', '06时', '07时', '08时', '09时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
  ['00分', '10分', '20分', '30分', '40分', '50分']
]

class ServiceTimePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      beginHour: '',
      beginMin: '',
      endHour: '',
      endMin: '',
    }
  }

  componentDidMount() {
    let initTime = this.props.initValue
    if (!initTime) {
      initTime = '08:30-21:30'
    }
    let beginTime = this.getBeginTime(initTime)
    let endTime = this.getEndTime(initTime)
    this.setState({
      beginHour: this.getHour(beginTime),
      beginMin: this.getMin(beginTime),
      endHour: this.getHour(endTime),
      endMin: this.getMin(endTime)
    })

    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
      initValue: {text: initTime},
      checkValid: this.validInput
    }
    this.props.initInputForm(formInfo)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.initValue != nextProps.initValue) {
      this.updateInput(nextProps.initValue)
    }
  }

  getBeginTime(text) {
    if (!text) {
      return ""
    }
    let begin = text.substring(0, text.indexOf('-'))
    return begin
  }

  getEndTime(text) {
    if (!text) {
      return ""
    }
    let end = text.substring(text.indexOf('-')+1)
    return end
  }

  getHour(time) {
    let hour = time.substring(0, time.indexOf(':'))
    if (hour.length == 1) {
      hour = '0' + hour
    }
    return hour
  }

  getMin(time) {
    let min = time.substring(time.indexOf(':')+1)
    if (min.length == 1) {
      min = '0' + min
    }
    return min
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

  getPickerData(data, isBegin) {
    let text = ''
    if (isBegin) {
      text = data[0].replace('时', ':') + data[1].replace('分', '') + '-' + this.state.endHour + ':' + this.state.endMin
      this.setState({
        beginHour: data[0].substring(0, data[0].indexOf('时')),
        beginMin: data[1].substring(0, data[1].indexOf('分')),
      })
    } else {
      text = this.state.beginHour + ':' + this.state.beginMin + '-' + data[0].replace('时', ':') + data[1].replace('分', '')
      this.setState({
        endHour: data[0].substring(0, data[0].indexOf('时')),
        endMin: data[1].substring(0, data[1].indexOf('分')),
      })
    }
    this.updateInput(text)
  }

  getBeginSelected() {
    if (!this.props.data) {
      return []
    }
    let beginTime = this.getBeginTime(this.props.data)
    return [this.getHour(beginTime) + '时', this.getMin(beginTime) + '分']
  }

  getEndSelected() {
    if (!this.props.data) {
      return []
    }
    let endTime = this.getEndTime(this.props.data)
    return [this.getHour(endTime) + '时', this.getMin(endTime) + '分']
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <View style={{justifyContent: 'center'}}>
          <CascadePicker
            onSubmit={(data) => this.getPickerData(data, true)}
            level={2}
            title="选择上班时间"
            data={classify}
            initSelected={this.getBeginSelected()}
            cascade={false}
          >
            <View style={styles.container} pointerEvents="none">
              <FormInput
                editable={this.props.editable}
                placeholder="上班时间"
                placeholderTextColor={this.props.placeholderTextColor}
                maxLength={this.props.maxLength}
                underlineColorAndroid="transparent"
                value={this.getBeginTime(this.props.data)}
                containerStyle={[styles.defaultContainerStyle, this.props.containerStyle]}
                inputStyle={[styles.defaultInputStyle, this.props.inputStyle]}
              />
            </View>
          </CascadePicker>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', paddingLeft: normalizeW(20), paddingRight: normalizeW(20)}}>
          <Text style={{fontSize: em(17), color: '#5A5A5A'}}>--</Text>
        </View>
        <View style={{justifyContent: 'center'}}>
          <CascadePicker
            onSubmit={(data) => this.getPickerData(data, false)}
            level={2}
            title="选择打烊时间"
            data={classify}
            initSelected={this.getEndSelected()}
            cascade={false}
          >
            <View style={styles.container} pointerEvents="none">
              <FormInput
                editable={this.props.editable}
                placeholder="打烊时间"
                placeholderTextColor={this.props.placeholderTextColor}
                maxLength={this.props.maxLength}
                underlineColorAndroid="transparent"
                value={this.getEndTime(this.props.data)}
                containerStyle={[styles.defaultContainerStyle, this.props.containerStyle]}
                inputStyle={[styles.defaultInputStyle, this.props.inputStyle]}
              />
            </View>
          </CascadePicker>
        </View>
      </View>
    )
  }
}

ServiceTimePicker.defaultProps = {
  placeholderTextColor: '#E1E1E1',
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
    flex: 1,
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
    width: normalizeW(80),
  },
  defaultInputStyle: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderColor: '#E9E9E9',
    fontSize: em(16),
    color: '#030303',
    textAlignVertical: 'center',
  },
})