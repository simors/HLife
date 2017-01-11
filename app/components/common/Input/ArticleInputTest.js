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
import ArticleInput from './ArticleInput'

export default class ArticleInputTest extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View>
        <ArticleInput/>
      </View>
    )
  }
}