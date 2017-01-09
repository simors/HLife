/**
 * Created by zachary on 2016/12/23.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'

export default class Option extends Component {

  static propTypes = {
    children: React.PropTypes.string.isRequired
  }

  static defaultProps = {
    children: ''
  }

  constructor(props) {
    super(props)
  }

  renderSelectedIcon() {
    // console.log('renderSelectedIcon.selectedValue=', this.props.selectedValue)
    // console.log('renderSelectedIcon.value=', this.props.value)
    if(this.props.selectedValue == this.props.value && !this.props.hideSelectedIcon) {
      return (
        <View style={{flex: 1,flexDirection: 'row'}}>
          <View style={{flex: 1}}/>
          <View style={[styles.selectedIcon]}/>
        </View>
      )
    }
  }
  
  render() {
    const { style, styleText } = this.props

    return (
      <View style={[ styles.container, style ]}>
        <Text style={ [styles.textStyle, styleText] }>{this.props.children}</Text>
        {this.renderSelectedIcon()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: 40,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA
  },
  textStyle: {
    fontSize: em(16)
  },
  selectedIcon: {
    width: 20,
    height: 10,
    backgroundColor: 'transparent',
    borderLeftWidth: normalizeBorder(),
    borderLeftColor: THEME.colors.green,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.green,
    transform: [{rotate: '-45deg'}]
  }
})