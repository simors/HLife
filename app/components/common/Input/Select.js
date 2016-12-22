import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ListView,
  StyleSheet,
  Dimensions,
} from 'react-native'
import Triangle from '../Triangle'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import * as PublicStyle from '../../../util/PublicStyle'
import THEME from '../../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width

export default class Select extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{backgroundColor:'green'}}>
          <Text>美食特色</Text>
          <View style={styles.rightBottomAngle}></View>
          <Triangle color="red" width={40} height={40} direction="right-down"/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightBottomAngle: {
    ...PublicStyle.triAngle({direction: 'right-down'}),
    marginTop: 20
  }

})