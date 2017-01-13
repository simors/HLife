/**
 * Created by yangyang on 2017/1/11.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native'
import Symbol from 'es6-symbol'
import ArticleEditor from './ArticleEditor'

let formKey = Symbol('articleForm')
const articleEditor = {
  formKey: formKey,
  stateKey: Symbol('articleEditor'),
  type: 'articleEditor',
}

export default class ArticleInputTest extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View>
        <ArticleEditor {...articleEditor}/>
      </View>
    )
  }
}