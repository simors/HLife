import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Text,
  ScrollView,
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

  renderOptions() {
    return (
      <View style={styles.optionsWrap}>
        <View style={styles.option}>
          <Text style={styles.optionTxt}>fjahdkfa</Text>
        </View>
        <View style={styles.option}>
          <Text style={styles.optionTxt}>fjahdkfa</Text>
        </View>
        <View style={styles.option}>
          <Text style={styles.optionTxt}>fjahdkfa</Text>
        </View>
        <View style={styles.option}>
          <Text style={styles.optionTxt}>fjahdkfa</Text>
        </View>
        <View style={styles.option}>
          <Text style={styles.optionTxt}>fjahdkfa</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback>
          <View style={styles.selectInput}>
            <Text style={styles.selectInputTxt}>美食特色</Text>
            <Triangle style={styles.triangle} direction="right-down"/>
          </View>
        </TouchableWithoutFeedback>
        <View style={[styles.optionsContainer, styles.hide]}>
          <ScrollView contentContainerStyle={styles.contentContainerStyle}>
            {this.renderOptions()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hide: {
    width: 0,
    height: 0
  },
  selectInput: {
    height: 60,
    borderWidth: normalizeBorder(),
    backgroundColor: THEME.colors.lessWhite,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectInputTxt: {
    fontSize: em(17),
    color: THEME.colors.lessDark
  },
  triangle: {
    position: 'absolute',
    right: 2,
    bottom: 2
  },
  optionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 60,
    height: 350,
  },
  contentContainerStyle: {
    flex: 1,
  },
  optionsWrap: {

  },
  option: {
    justifyContent: 'center',
    height: normalizeH(60),
    paddingLeft: normalizeW(20),
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA

  }


})