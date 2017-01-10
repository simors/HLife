/**
 * Created by zachary on 2016/12/23.
 */
import React, {Component} from 'react'
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import Option from './Option'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'

const window = Dimensions.get('window')
const SELECT = 'SELECT'

class SelectInput extends Component {

  static propTypes = {
    height: React.PropTypes.number,
    optionListHeight: React.PropTypes.number,
    optionListRef: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func
  }

  static defaultProps = {
    height: 40,
    optionListHeight: 120,
    onSelect: () => { }
  }

  constructor(props) {
    super(props)

    this.positionX = 0
    this.positionY = 0

    let defaultText = props.defaultText
    let defaultValue = props.defaultValue

    if (!defaultText) {
      if (Array.isArray(props.children)) {
        defaultText = props.children[0].props.children
      } else {
        defaultText = props.children.props.children
      }
    }
    this.state = {
      value: defaultValue ? defaultValue : defaultText,
      text: defaultText,
      show: false,
      userSelected: false,
      optionListPos: 0
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
  }

  componentWillReceiveProps(nextProps) {
    // console.log(this.props.selectRef + '.componentWillReceiveProps.nextProps.show=' + nextProps.show)
    // console.log(this.props.selectRef + '.componentWillReceiveProps.this.props.show=' + this.props.show)
    if(this.props.show != nextProps.show) {
      this.state.show = nextProps.show
      this.setState({
        ...this.state,
        show: this.state.show
      })
      // console.log(this.props.selectRef + '.componentWillReceiveProps.state.show=' + this.state.show)
      this._toggle(true)
    }
  }

  _onPress(e) {
    if(this.props.onPress) {
      this.props.onPress(e)
    }

  }

  _toggle(userTouching) {
    const {show, hasOverlay, optionListRef, children, onSelect, width, height, overlayPageX, overlayPageY, optionListHeight } = this.props
    if (!children.length) {
      return false
    }
    this.overlayPageX = overlayPageX

    optionListRef()._toggle(this.state.show, hasOverlay, userTouching, children, this.state.text, this.state.value, this.positionX, this.positionY, width, height, optionListHeight, overlayPageX, overlayPageY, (text, value=text) => {
      onSelect(value, text)
      if(value !== null) {
        this.state.text = text
        this.state.value = value
        this.state.userSelected = true
        this.setState({
          text: this.state.text,
          value: this.state.value,
          userSelected: this.state.userSelected
        })
        this.inputChange(value)
      }
    })
  }

  blur() {
    this.props.optionListRef()._blur()
  }

  render() {
    const { width, height, style, styleOption, styleText } = this.props
    const dimensions = { height }

    let selectingTxtStatus = {}
    if(this.state.show){
      selectingTxtStatus = {
        color: '#333'
      }
    }
    // console.log(`this.state.value1=${this.state.value},this.state.text1=${this.state.text}`)
    return (
      <TouchableWithoutFeedback style={{flex: 1}} onPress={this._onPress.bind(this)}>
        <View ref={this.props.selectRef || SELECT} style={[styles.container, style ]}>
          <Option hideSelectedIcon={true} value={this.state.value} style={ [styles.styleOption, styleOption] } styleText={ [this.state.userSelected ? styles.selectedStyleText : styles.styleText, styleText, selectingTxtStatus] }>{this.state.text}</Option>
        </View>
      </TouchableWithoutFeedback>
    )
  }

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

export default connect(mapStateToProps, mapDispatchToProps)(SelectInput)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  styleOption: {
    paddingLeft: 14,
    borderBottomWidth: 0
  },
  styleText: {
    color: '#b2b2b2'
  },
  selectedStyleText: {
    color: '#333'
  }
})