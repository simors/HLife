/**
 * Created by yangyang on 2016/12/22.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native'
import MultilineText from './MultilineText'
import ImageGroupInput from './ImageGroupInput'
import Symbol from 'es6-symbol'

let formKey = Symbol('multiForm')
const multiInput = {
  formKey: formKey,
  stateKey: Symbol('multiInput'),
  type: 'content'
}

const imageGroupInput = {
  formKey: formKey,
  stateKey: Symbol('imageGroupInput'),
  type: 'imgGroup'
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
        <View style={{marginTop: 30}}>
          <ImageGroupInput {...imageGroupInput} number={9} />
        </View>
      </View>
    )
  }
}