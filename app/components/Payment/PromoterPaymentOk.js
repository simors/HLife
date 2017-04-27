/**
 * Created by yangyang on 2017/4/20.
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
import Header from '../common/Header'
import CommonButton from '../common/CommonButton'
import {switchTab} from '../../util/AVUtils'
import * as Toast from '../common/Toast'
import {getCurrentPromoter, finishPromoterPayment} from '../../action/promoterAction'

class PaymentSuccess extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=> {
      this.props.finishPromoterPayment({
        promoterId: this.props.promoterId,
        error: (err) => {
          Toast.show(err.message)
        }
      })
    })
  }

  componentWillUnmount() {
    InteractionManager.runAfterInteractions(()=> {
      this.props.getCurrentPromoter({
        error: (err) => {
          Toast.show(err.message)
        }
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="none"
          title="注册推广员"
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <ScrollView>
            <View style={{flexDirection: 'row'}}>
              <Image style={styles.image} source={require('../../assets/images/payment_success.png')}/>
              <View>
                <Text style={styles.success}>支付成功</Text>
                <Text style={styles.successTrip}>恭喜您成为邻家优店推广员</Text>
              </View>
            </View>
            <View style={styles.trips}>
              <Text style={{fontSize: 12, color: '#FF7819', marginBottom: 5}}>向朋友推荐成为你的推广好友可以让你获取更多收益哦！</Text>
              <Text style={{fontSize: 12, color: '#5A5A5A', textAlign: 'center', }}>请确保推广员信息的真实合法性，平台将不定期对推广员信息进行排查，杜绝非法欺骗的行为</Text>
            </View>

            <CommonButton
              buttonStyle={{marginTop:normalizeH(20)}}
              title="推广管理"
              onPress={()=>{Actions.PROMOTER_PERFORMANCE()}}
            />
            <CommonButton
              buttonStyle={{marginTop:normalizeH(20), backgroundColor:'#d8d8d8'}}
              title="返回个人中心"
              onPress={()=>{switchTab('MINE')}}
            />
          </ScrollView>
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
  getCurrentPromoter,
  finishPromoterPayment,
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
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
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