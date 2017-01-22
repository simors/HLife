/**
 * Created by zachary on 2016/12/16.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import Marquee from './Marquee'
import THEME from '../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

export default class CommonMarquee extends Component {

  constructor(props) {
    super(props)
    this.defaultIndex = 0
  }

  clickListener(index, data) {
    let item = data[index]
    let url = item.url
    let title = item.title
    let payload = {
      url: url,
      showHeader: !!title,
      headerTitle: title
    }
    return (
      Actions.COMMON_WEB_VIEW(payload)
    )
  }

  onMomentumScrollEnd(event, state) {
    this.defaultIndex = state.index
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>吾爱公告</Text>
        </View>
        <View style={[styles.marqueeWrap, {marginTop: (this.props.height-14)/2}]}>
          <Marquee
            data={this.props.data}
            hideTitle={true}
            defaultIndex={this.defaultIndex}
            onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
            intent={this.clickListener.bind(this)}
          />
        </View>
        <View style={styles.rightIconWrap}>
          <Icon
            name='ios-arrow-forward'
            style={styles.rightIcon} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: '#fff'
  },
  titleWrap: {
    marginLeft: normalizeW(10),
    paddingRight: normalizeW(10),
    borderRightWidth: normalizeBorder(),
    borderRightColor: THEME.colors.gray
  },
  title: {
    fontSize: em(16),
    color: THEME.colors.green
  },
  marqueeWrap: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  rightIconWrap: {
    width: 24,
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  rightIcon: {
    fontSize: em(24),
    color: THEME.colors.lighter
  }
})