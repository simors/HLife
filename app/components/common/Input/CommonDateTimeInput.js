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
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import DatePicker from 'react-native-datepicker'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import THEME from '../../../constants/themes/theme1'

const PAGE_WIDTH=Dimensions.get('window').width

export class CommonDateTimeInput extends Component {
  constructor(props) {
    super(props)
  }

  dateChange(date) {

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

CommonDateTimeInput.defaultProps = {
  mode: 'date',
  date: "2016-12-08",
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
  return {
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CommonDateTimeInput)

const styles = StyleSheet.create({
  container: {
    ...THEME.base.inputContainer,
    justifyContent: 'space-between',
  },
  defaultPickerStyle: {
    width: PAGE_WIDTH,
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(10),
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#E9E9E9',
  },
})