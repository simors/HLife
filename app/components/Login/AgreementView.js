/**
 * Created by yangyang on 2017/3/4.
 */
/**
 * Created by yangyang on 2017/3/4.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Platform,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Symbol from 'es6-symbol'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Header from '../common/Header'
import THEME from '../../constants/themes/theme1'

export default class AgreementView extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="服务协议"
        />
        <View style={styles.body}>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  body: {
    marginTop: normalizeH(65),
    flex: 1,
  },
})