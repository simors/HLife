/**
 * Created by wanpeng on 2017/4/11.
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
  InteractionManager,
  NativeModules
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import * as authSelector from '../../selector/authSelector'
import Header from '../common/Header'
import CommonButton from '../common/CommonButton'
import {getPaymentInfo} from '../../selector/paymentSelector'



class MyCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      boundCarded: false
    }
  }

  onRelieveCard = () => {
  }

  render() {
    return(
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title='银行卡'
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={{marginTop: normalizeH(42), fontFamily: 'PingFangSC-Semibold', fontSize: 18, color: '#4990E2'}}>{this.props.cardInfo.bank_code}</Text>
            <Text style={{marginTop: normalizeH(20), fontSize: 18, color: '#4990E2'}}>{this.props.cardInfo.card_number}</Text>
          </View>
          <CommonButton
            buttonStyle={{marginTop:normalizeH(47)}}
            onPress={this.onRelieveCard}
            title="解除绑定"
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)
  const cardInfo = getPaymentInfo(state)
  return {
    isUserLogined: isUserLogined,
    cardInfo: cardInfo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyCard)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainerStyle: {
    borderBottomWidth: 1,
    backgroundColor: '#F9F9F9'
  },
  headerLeftStyle: {
    color: THEME.colors.green,
    fontSize: 24
  },
  headerTitleStyle: {
    color: '#030303',
    fontSize: 17,
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
  },
  card: {
    width: normalizeW(345),
    height: normalizeH(140),
    borderRadius: 10,
    paddingLeft: normalizeW(28),
    backgroundColor: 'rgba(255,157,78,0.20)',
    marginTop: normalizeH(20),
    marginLeft: normalizeW(15)
  }
})
