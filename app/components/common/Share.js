import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  NativeModules
} from 'react-native'

import {Actions} from 'react-native-router-flux'

const shareNative = NativeModules.shareComponent


let icons = [
  {icon: require('../../assets/images/share_qq.png')},
  {icon: require('../../assets/images/share_qqzome.png')},
  {icon: require('../../assets/images/share_weixin.png')},
  {icon: require('../../assets/images/share_friends.png')},
  {icon: require('../../assets/images/share_weibo.png')},
]
let texts = ['QQ', 'QQ空间', '微信好友', '朋友圈', '微博']

let shareMaps = []

export default class Share extends Component {

  constructor(props) {
    super(props)
  }

  shareUrl(plateform, url, title, description, thumbURL) {
    // shareNative.shareURLWithPlate(plateform, {title: title, thumbURL: thumbURL, URL: url, descr: description})
    shareNative.shareURLWithPlate(plateform, {title: title, URL: url, descr: description})
  }

  componentWillMount() {
    shareMaps = []
    for (var i = 0; i < 5; i++) {
      let data = {
        icon: icons[i].icon,
        text: texts[i]
      }
      shareMaps.push(data)
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.pop()
        }}
        style={styles.shareMain}>
        <TouchableOpacity
          onPress={() => {

          }}
          activeOpacity={1}
          style={styles.sharePop}>
          <View style={styles.shareTop}>
            <Text style={styles.shareDes}>分享至社交平台</Text>

            <View style={styles.shareLayout}>
              {this.renderShareCell()}
            </View>
          </View>
          <TouchableOpacity
            style={styles.cancelLayout}
            onPress={() => {
              Actions.pop()
            }}>
            <Text style={styles.cancel}>取消</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  renderShareCell = () => {
    return shareMaps.map((share, index) => {
      return (
        <TouchableOpacity
          style={styles.shareLayoutItem}
          key={index}
          onPress={() => {
            this.openShareChannel(index)
          }}>
          <Image style={styles.shareIcon} source={share.icon}/>
          <Text style={styles.shareText}>{share.text}</Text>
        </TouchableOpacity>
      )
    })
  }

  openShareChannel = (index) => {
    let title = this.props.title ? this.props.title : '汇邻优店'
    let targetUri = this.props.url || 'https://www.pgyer.com/F5Df'
    let content = this.props.abstract ? this.props.abstract : '汇邻优店'
    if (index == 4) {
      content = '\n作者：' + this.props.author + '（来自汇邻优店）'
    }
    let imgUri = this.props.cover ? this.props.cover : ''
    switch (index) {
      case 0://QQ
        Platform.OS == 'android' ?
          shareNative.share('QQ', targetUri, title, imgUri, content)
          :
          this.shareUrl(4, targetUri, title, content, imgUri)
        break
      case 1://QZone
        Platform.OS == 'android' ?
          shareNative.share('QZONE', targetUri, title, imgUri, content)
          :
          this.shareUrl(5, targetUri, title, content, imgUri)
        break
      case 2://WX
        Platform.OS == 'android' ?
          shareNative.share('WEIXIN', targetUri, title, imgUri, content)
          :
          this.shareUrl(1, targetUri, title, content, imgUri)
        break
      case 3://WX_Circle
        Platform.OS == 'android' ?
          shareNative.share('WEIXIN_CIRCLE', targetUri, title, imgUri, content)
          :
          this.shareUrl(2, targetUri, title, content, imgUri)
        break
      case 4://Weibo
        Platform.OS == 'android' ?
          shareNative.share('SINA', targetUri, title, imgUri, content)
          :
          this.shareUrl(0, targetUri, title, content, imgUri)
        break
    }
  }

}

const styles = StyleSheet.create({
  shareMain: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center'
  },
  sharePop: {
    backgroundColor: 'white',
    height: 200,
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shareTop: {
    position: 'absolute',
    top: 24,
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shareDes: {
    fontSize: 14,
    color: '#757575',
  },
  shareLayout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  shareLayoutItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    width: 48,
    height: 48,
  },
  shareText: {
    fontSize: 12,
    color: '#969696',
    marginTop: 8
  },
  cancelLayout: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E0E0E0'
  },
  cancel: {
    fontSize: 16,
    color: '#757575',
  },
})