/**
 * Created by yangyang on 2016/12/21.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Platform,
  TextInput
} from 'react-native'
import CustomSend from './CustomSend'
import CustomComposer from './CustomComposer'

export default class CustomInputToolbar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={[styles.primary, this.props.primaryStyle]}>
          <CustomComposer {...this.props} />
          <CustomSend {...this.props} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
    backgroundColor: '#FFFFFF',
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 5,
    paddingRight: 5,
  },
})

CustomInputToolbar.defaultProps = {
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
}