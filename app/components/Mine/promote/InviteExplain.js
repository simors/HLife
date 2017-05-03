/**
 * Created by yangyang on 2017/3/27.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import THEME from '../../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

export default class InviteExplain extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header leftType="icon"
                leftIconName="ios-arrow-back"
                leftPress={() => Actions.pop()}
                title="邀请说明"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})