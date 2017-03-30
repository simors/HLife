/**
 * Created by yangyang on 2017/3/8.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  StyleSheet,
  StatusBar,
  NativeModules,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../constants/themes/theme1'
import * as authSelector from '../../selector/authSelector'
import {createPingppPayment} from '../../action/paymentActions'
import uuid from 'react-native-uuid'
import * as Toast from '../common/Toast'

// const LIFEPingPP = NativeModules.LIFEPingPP
const PingPPModule = NativeModules.PingPPModule

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class Publish extends Component {
  constructor(props) {
    super(props)
    this.state = {
      order_no: undefined,
    }
  }

  submitSuccessCallback = (charge) => {
    Toast.show('Ping++ 获取 charge对象成功！')
    console.log("get charge:", JSON.stringify(charge))
    // LIFEPingPP.setDebugMode(true, () => {console.log("LIFEPingPP.setDebugMode success!")})
    // LIFEPingPP.createPayment(charge, 'simorsLjyd', () => {console.log("LIFEPingPP.createPayment callback!")})
    PingPPModule.createPayment(JSON.stringify(charge), 'simorsLjyd', () => {console.log("PingPPModule.createPayment callback!")})

  }

  submitErrorCallback = (error) => {
    Toast.show(error.message)
  }

  onPaymentTest() {
    let order_no = uuid.v4().replace(/-/g, '').substr(0, 16)
    this.setState({
      order_no: order_no
    })
    let paymentPayload = {
      order_no: order_no,
      amount: 10,
      channel: 'alipay',
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback,
    }
    this.props.createPingppPayment(paymentPayload)
  }

  render() {
    return (
      <View style={styles.container} >
        <StatusBar barStyle="dark-content"/>
        <View style={styles.body}>
          <View style={styles.logo}>
            <Image
              resizeMode="contain"
              style={{width: normalizeW(181), height: normalizeH(181), paddingBottom: normalizeH(20)}}
              source={require('../../assets/images/icon_add.png')}/>
            <Image source={require('../../assets/images/font_faxian.png')}/>
          </View>
          <View>
            <View style={styles.services}>
              <TouchableOpacity style={styles.item} onPress={() => {this.props.isUserLogined? Actions.PUBLISH_TOPIC() : Actions.LOGIN()}}>
                <Image
                  resizeMode="contain"
                  style={{width: normalizeW(60), height: normalizeH(60)}}
                  source={require('../../assets/images/publish_topic.png')}
                />
                <Text style={styles.serviceText}>发布话题</Text>
              </TouchableOpacity >
              <TouchableOpacity style={styles.item} onPress={() => {this.props.isUserLogined? Actions.PUBLISH_SHOP_PROMOTION() : Actions.LOGIN()}}>
                <Image
                  resizeMode="contain"
                  style={{width: normalizeW(60), height: normalizeH(60)}}
                  source={require('../../assets/images/publish_activity.png')}
                />
                <Text style={styles.serviceText}>店铺活动</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => {this.onPaymentTest()}}>
              <Text style={{fontSize:24, color: 'red'}}>打赏</Text>
            </TouchableOpacity>
            <View style={styles.closeView}>
              <TouchableOpacity style={styles.close} onPress={() => Actions.pop()}>
                <Image
                  source={require('../../assets/images/add_close.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)
  return {
    isUserLogined: isUserLogined
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createPingppPayment
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Publish)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        marginTop: normalizeH(20),
      },
      android: {
        marginTop: normalizeH(0)
      }
    }),
  },
  logo: {
    marginTop: normalizeH(85),
  },
  services: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(170,170,170,0.2)',
    borderBottomColor: 'rgba(250,250,250,1)',
    width: PAGE_WIDTH,
  },
  serviceText: {
    paddingTop: normalizeH(15),
    paddingBottom: normalizeH(66),
    fontSize: em(17),
    color: '#5A5A5A'
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingTop: normalizeH(34)
  },
  close: {
    flex: 1,
    alignSelf: 'center',
    padding: normalizeH(12),
  },
  closeView: {
    ...Platform.select({
      ios: {
        height: normalizeH(60),
      },
      android: {
        height: normalizeH(80),
      }
    }),
  },
})