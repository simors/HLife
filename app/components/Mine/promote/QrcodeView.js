/**
 * Created by wanpeng on 2017/6/28.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  InteractionManager,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import QRCode from 'react-native-qrcode'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import THEME from '../../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {getInviteCode} from '../../../action/promoterAction'
import {inviteCode} from '../../../selector/promoterSelector'
import * as Toast from '../../common/Toast'
import ActionSheet from 'react-native-actionsheet'
import {DEFAULT_SHARE_DOMAIN} from '../../../util/global'
import {fetchShareDomain} from '../../../action/configAction'
import {getShareDomain} from '../../../selector/configSelector'
import {CachedImage} from 'react-native-img-cache'



class QrcodeView extends Component {
  constructor(props) {
    super(props)
  }

  _handleActionSheetPress(index) {
    if(0 == index) { //分享

      Actions.SHARE({
        shareType: 'image',
        imageUrl: this.props.qrcodeUrl,
      })
    } else if(1 == index) { //说明
      Actions.INVITE_EXPLAIN()
    }
  }

  renderActionSheet() {
    return (
      <ActionSheet
        ref={(o) => this.ActionSheet = o}
        title=""
        options={['分享', '说明', '取消']}
        cancelButtonIndex={2}
        onPress={this._handleActionSheetPress.bind(this)}
      />
    )
  }

  render() {
    console.log("qrcodeUrl:", this.props.qrcodeUrl)
    return (
      <View style={styles.container}>
        <Header leftType="icon"
                leftIconName="ios-arrow-back"
                leftPress={() => {
                  Actions.pop()
                }}
                title="我的二维码"
                rightType="icon"
                rightIconName="ios-more"
                rightPress={() => {
                  this.ActionSheet.show()
                }}
        />
        <View style={styles.body}>
          <View style={{marginTop: normalizeH(10), width: normalizeW(247)}}>
            <Text style={styles.tipText} numberOfLines={2}>扫一扫下方二维码或者分享到微信自动添加推广好友</Text>
          </View>
          <View style={{marginTop: normalizeH(10)}}>
            <CachedImage mutable style={{width: normalizeW(280), height: normalizeH(499)}} source={{uri: this.props.qrcodeUrl}}></CachedImage>
          </View>
        </View>
        {this.renderActionSheet()}
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(QrcodeView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    alignItems: 'center',
  },
  tipText: {
    fontSize: em(15),
    color: '#AAAAAA',
    lineHeight: em(22),
    textAlign: 'center',
  },
  inviteTextView: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.base.lightColor,
    paddingTop: normalizeH(5),
    paddingBottom: normalizeH(5),
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(10),
  },
  inviteText: {
    color: THEME.base.mainColor,
    fontSize: em(17),
    fontWeight: 'bold',
    letterSpacing: em(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
})