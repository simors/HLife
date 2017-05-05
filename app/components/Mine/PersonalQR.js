/**
 * Created by yangyang on 2017/3/22.
 */
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Platform,
  Image,
  Dimensions,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import THEME from '../../constants/themes/theme1'
import QRCode from 'react-native-qrcode'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

const PAGE_WIDTH = Dimensions.get('window').width

export default class PersonalQR extends Component {
  constructor(props) {
    super(props)
  }

  renderAvatar() {
    if (!this.props.avatar) {
      return <View/>
    }
    return (
      <View style={styles.avatarView}>
        <Image style={{width: normalizeW(50), height: normalizeH(50)}} source={{uri: this.props.avatar}}/>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header leftType="icon"
                leftPress={()=> {
                  Actions.pop()
                }}
                title="我的二维码"
        />
        <View style={styles.qrView}>
          <QRCode value={JSON.stringify(this.props.data)}
                  size={normalizeW(200)}
                  bgColor={THEME.base.mainColor}
                  fgColor='white'/>
          {this.renderAvatar()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: THEME.base.mainColor,
  },
  qrView: {
    alignItems: 'center',
    marginTop: normalizeH(140),
  },
  avatarView: {
    position: 'absolute',
    left: Math.floor((PAGE_WIDTH - normalizeW(50)) / 2),
    top: normalizeH(75),
  },
})
