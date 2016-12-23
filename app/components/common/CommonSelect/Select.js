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
    optionListHeight: 150,
    onSelect: () => { }
  }

  constructor(props) {
    super(props)

    this.positionX = 0
    this.positionY = 0

    let defaultValue = props.defaultValue

    if (!defaultValue) {
      if (Array.isArray(props.children)) {
        defaultValue = props.children[0].props.children
      } else {
        defaultValue = props.children.props.children
      }
    }

    this.state = {
      value: defaultValue
    }
  }

  reset() {
    const { defaultValue } = this.props
    this.setState({ value: defaultValue })
  }

  _onPress() {
    const {show, optionListRef, children, onSelect, width, height, overlayPageX, optionListHeight } = this.props
    if (!children.length) {
      return false
    }

    this.overlayPageX = overlayPageX
    optionListRef()._toggle(show, children, this.positionX, this.positionY, width, height, optionListHeight, overlayPageX, (item, value=item) => {
      if (item) {
        onSelect(value);
        this.setState({
          value: item
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

    return (
      <TouchableWithoutFeedback onPress={this._onPress.bind(this)}>
        <View ref={this.props.selectRef || SELECT} style={[styles.container, style ]}>
          <Option style={ styleOption } styleText={ styleText }>{this.state.value}</Option>
          <Triangle style={styles.triangle} direction="right-down"/>
        </View>
      </TouchableWithoutFeedback>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    height: 40,
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