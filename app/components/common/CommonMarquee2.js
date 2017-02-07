/**
 * Created by zachary on 2017/2/7.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Platform
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import Marquee from './Marquee'
import Marquee2 from './Marquee2'
import THEME from '../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

export default class CommonMarquee2 extends Component {

  static defaultProps = {
    height: normalizeH(40),
    titleFontSize: em(14)
  }

  constructor(props) {
    super(props)
    
    this.state = {
      marginTop: (this.props.height - this.props.titleFontSize) / 2
    }
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
  
  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout
    this.setState({
      marginTop: (layout.height - this.props.titleFontSize) / 2
    })
  }

  render() {
    return(
      <View style={styles.container} onLayout={this._onLayoutDidChange}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>吾爱公告</Text>
        </View>
        {Platform.OS === 'android'
          ? <View style={[styles.marqueeWrap, {marginTop: this.state.marginTop -2}]}>
              <Marquee
                data={this.props.data}
                intent={this.clickListener.bind(this)}
                titleStyle={{fontSize: this.props.titleFontSize}}
              />
            </View>
          : <View style={[styles.marqueeWrap, {marginTop: this.state.marginTop}]}>
              <Marquee
                data={this.props.data}
                intent={this.clickListener.bind(this)}
                titleStyle={{fontSize: this.props.titleFontSize}}
              />
            </View>
        }
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
    paddingRight: 10,
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