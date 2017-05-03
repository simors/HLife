/**
 * Created by wanpeng on 2017/4/5.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as appConfig from '../../constants/appConfig'
import Header from '../common/Header'
import CommonButton from '../common/CommonButton'
import * as authSelector from '../../selector/authSelector'

class PaymentSuccess extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {

  }

  completeShopInfo() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
    }else {
      Actions.COMPLETE_SHOP_INFO({popNum: 3})
    }
  }

  goShopManage() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
    }else {
      Actions.MY_SHOP_INDEX({popNum: 3})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="none"
          title="注册店铺"
        />
        <View style={styles.body}>
          <ScrollView>
            <View style={{flexDirection: 'row'}}>
              <Image style={styles.image} source={require('../../assets/images/payment_success.png')}/>
              <View>
                <Text style={styles.success}>支付成功</Text>
                <Text style={styles.successTrip}>恭喜您已成功入驻邻家优店</Text>
              </View>
            </View>
            <View style={styles.trips}>
              <Text style={{fontSize: 12, color: '#FF7819', marginBottom: 5}}>线上推广和互动将给您的线下店铺带来更多的生意</Text>
              <Text style={{fontSize: 12, color: '#5A5A5A', textAlign: 'center', }}>请确保店铺信息的真实合法性，平台将不定期对店铺信息进行排查，杜绝非法欺骗的行为</Text>
            </View>

            <CommonButton
              buttonStyle={{marginTop:normalizeH(20)}}
              title="完善店铺资料"
              onPress={()=>{this.completeShopInfo()}}
            />
            <CommonButton
              buttonStyle={{marginTop:normalizeH(20), backgroundColor:'#d8d8d8'}}
              title="下一步"
              onPress={()=>{this.goShopManage()}}
            />
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)
  return {
    isUserLogined: isUserLogined,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSuccess)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green
  },
  headerLeftStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  headerTitleStyle: {
    color: '#fff',
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
  },
  image: {
    marginLeft: normalizeW(46),
    marginTop: normalizeH(60),
    marginRight: normalizeW(20)
  },
  success: {
    marginTop: normalizeH(88),
    fontSize: 28,
    color: '#FF7819'
  },
  successTrip: {
    marginTop: normalizeH(15),
    fontSize: 15,
    color: '#5A5A5A',
  },
  trips: {
    alignItems: 'center',
    width: normalizeW(315),
    height: normalizeH(66),
    marginTop: normalizeH(193),
    marginLeft: normalizeW(30),
    marginRight: normalizeW(30)
  }
})