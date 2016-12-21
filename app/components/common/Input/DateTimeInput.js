/**
 * Created by wanpeng on 2016/12/8.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import DatePicker from 'react-native-datepicker'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import THEME from '../../../constants/themes/theme1'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'

const PAGE_WIDTH=Dimensions.get('window').width

class DateTimeInput extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
      initValue: {text: this.props.value},
      checkValid: this.validDate
    }
    this.props.initInputForm(formInfo)
  }

  validDate() {
    return {isVal:true, errMsg:"验证通过"}
  }

  dateChange(date) {
    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text: date}
    }
    this.props.inputFormUpdate(formInfo)
  }

  render() {
    return (
      <View style={styles.container}>
        <DatePicker
          style = {[styles.defaultPickerStyle, this.props.PickerStyle]}
          mode = {this.props.mode}
          date = {this.props.date}
          placeholder = '选择日期'
          format = {this.props.format}
          minDate = {this.props.minDate}
          maxDate = {this.props.maxDate}
          confirmBtnText = "确定"
          cancelBtnText = "取消"
          showIcon = {this.props.showIcon}
          onDateChange = {(date) => {this.dateChange(date)}}
          customStyles = {this.props.customStyles}
        />
      </View>

    )
  }
}

DateTimeInput.defaultProps = {
  mode: 'date',
  // date: "2016-12-08",
  format: "YYYY-MM-DD",
  minDate: "2001-01-01",
  maxDate: "2020-12-31",
  showIcon: false,
  customStyles: {
    dateTouchBody: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
    dateInput: {
      marginLeft: 0,
      borderWidth: 0,
    },
    dateText: {
      fontSize: em(18),

    }
  }
}

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  return {
    date: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DateTimeInput)

const styles = StyleSheet.create({
  container: {
    ...THEME.base.inputContainer,
    justifyContent: 'center',
  },
  defaultPickerStyle: {
    width: PAGE_WIDTH - normalizeW(34),
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(10),
    backgroundColor: '#F3F3F3',
    borderWidth: normalizeBorder(),
    borderColor: '#E9E9E9',
  },
})