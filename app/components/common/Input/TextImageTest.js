/**
 * Created by yangyang on 2016/12/22.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import MultilineText from './MultilineText'
import Symbol from 'es6-symbol'

let formKey = Symbol('multiForm')
const multiInput = {
  formKey: formKey,
  stateKey: Symbol('multiInput'),
  type: 'content'
}

export default class TextImageTest extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View>
        <View style={{marginTop: 30}}>
          <MultilineText {...multiInput} initValue='yangyang'/>
        </View>
      </View>
    )
  }
}