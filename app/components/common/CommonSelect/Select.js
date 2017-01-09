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
import Triangle from '../Triangle'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'

const window = Dimensions.get('window')
const SELECT = 'SELECT'

export default class Select extends Component {

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
      value: defaultValue,
      text: defaultText,
      show: false,
    }
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

  reset() {
    const { defaultText } = this.props
    this.setState({
      ...this.state,
      text: defaultText
    })
  }

  _onPress() {
    if(this.props.onPress) {
      this.props.onPress()
    }
  }

  _toggle(userTouching) {
    const {show, hasOverlay, optionListRef, children, onSelect, width, height, overlayPageX, optionListHeight } = this.props
    if (!children.length) {
      return false
    }
    this.overlayPageX = overlayPageX
    optionListRef()._toggle(this.state.show, hasOverlay, userTouching, children, this.state.text, this.state.value, this.positionX, this.positionY, width, height, optionListHeight, overlayPageX, (text, value=text) => {
      onSelect(value, text)
      if(value !== null) {
        this.state.text = text
        this.state.value = value
        this.setState({
          text: this.state.text,
          value: this.state.value
        })
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
    let selectingTriangleStatus = {}
    if(this.state.show){
      selectingTxtStatus = {
        color: THEME.colors.green
      }
      selectingTriangleStatus = {
        borderBottomColor: THEME.colors.green
      }
    }
    // console.log(`this.state.value1=${this.state.value},this.state.text1=${this.state.text}`)
    return (
      <TouchableWithoutFeedback style={{flex: 1}} onPress={this._onPress.bind(this)}>
        <View ref={this.props.selectRef || SELECT} style={[styles.container, style ]}>
          <Option hideSelectedIcon={true} value={this.state.value} style={ [styleOption] } styleText={ [styleText, selectingTxtStatus] }>{this.state.text}</Option>
          <Triangle style={[styles.triangle, selectingTriangleStatus]} direction="right-down"/>
        </View>
      </TouchableWithoutFeedback>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: THEME.colors.lighterA,
    backgroundColor: THEME.colors.lessWhite,
  },
  triangle: {
    position: 'absolute',
    right: 2,
    bottom: 2
  },
})