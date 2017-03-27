/**
 * Created by yangyang on 2017/3/27.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import QRCode from 'react-native-qrcode'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import THEME from '../../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

class InviteCodeViewer extends Component {
  constructor(props) {
    super(props)
  }

  renderInviteDeclareBtn() {
    return (
      <TouchableOpacity style={{paddingRight: normalizeW(15)}} onPress={()=>{Actions.INVITE_EXPLAIN()}}>
        <Image style={{width: normalizeW(18), height: normalizeH(18)}}
               source={require('../../../assets/images/explain_revernue.png')}/>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header leftType="icon"
                leftStyle={{color: THEME.base.mainColor}}
                leftIconName="ios-arrow-back"
                leftPress={() => Actions.pop()}
                title="邀请码"
                rightComponent={()=>this.renderInviteDeclareBtn()}
        />
        <View style={styles.body}>
          <View style={{marginTop: normalizeH(30), width: normalizeW(247)}}>
            <Text style={styles.tipText} numberOfLines={2}>扫一扫下面的二维码，获取邀请码或者直接输入以下邀请码</Text>
          </View>
          <View style={{marginTop: normalizeH(43)}}>
            <QRCode value='abcdef'
                    size={normalizeW(160)}
                    bgColor='#030303'
                    fgColor='#FFF'/>
          </View>
          <View style={{flexDirection: 'row', marginTop: normalizeH(42), alignItems: 'center'}}>
            <Text style={{fontSize: em(17), color: '#4A4A4A', paddingRight: normalizeW(20)}}>邀请码</Text>
            <View style={{borderWidth: 1, borderColor: THEME.base.lightColor}}>
              <Text style={styles.inviteText}>AS883P</Text>
            </View>
          </View>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(InviteCodeViewer)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
    flex: 1,
    alignItems: 'center',
  },
  tipText: {
    fontSize: em(15),
    color: '#AAAAAA',
    lineHeight: em(22),
    textAlign: 'center',
  },
  inviteText: {
    color: THEME.base.mainColor,
    fontSize: em(17),
    fontWeight: 'bold',
    letterSpacing: em(3),
    padding: normalizeW(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
})