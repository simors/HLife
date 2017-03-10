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
import Triangle from '../Triangle'

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
  
  renderTriangle() {
    if(this.props.showTriangle) {
      let selectingTriangleStatus = {}
      if(this.props.isSelected) {
        selectingTriangleStatus = {
          borderTopColor: THEME.colors.green
        }
      }
      return (
        <Triangle height={8} color='#aaa' style={[styles.triangle, selectingTriangleStatus]} direction="down"/>
      )
    }
    return null
  }
  
  render() {
    const { style, styleText } = this.props

    let selectContainer = {}
    let selectTextStyle = {}
    if(this.props.selectedValue == this.props.value) {
      selectContainer = {backgroundColor: '#fff'}
      selectTextStyle = {color: THEME.colors.green}
    }

    return (
      <View style={[ styles.container, selectContainer, style ]}>
        <Text style={ [styles.textStyle, styleText, selectTextStyle] }>{this.props.children}</Text>
        {this.renderSelectedIcon()}
        {this.renderTriangle()}
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
    borderBottomColor: THEME.colors.lighter,
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
  },
  triangle: {
    marginLeft: 5
  }
})