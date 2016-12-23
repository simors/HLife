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
  
  render() {
    const { style, styleText } = this.props

    return (
      <View style={[ styles.container, style ]}>
        <Text style={ styleText }>{this.props.children}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA
  }
})