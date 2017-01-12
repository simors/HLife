/**
 * Created by zachary on 2016/12/20.
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

import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as appConfig from '../../../constants/appConfig'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import * as authSelector from '../../../selector/authSelector'

class ShopRegisterSuccess extends Component {
  constructor(props) {
    super(props)
  }

  completeShopInfo() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
    }else {
      Actions.COMPLETE_SHOP_INFO()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="text"
          leftText="取消"
          leftPress={() => Actions.pop()}
          title="注册店铺"
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <Image style={styles.image} source={require("../../../assets/images/shop_congratuation.png")} />
          <View style={styles.congratulationWrap}>
            <Text style={styles.congratulationTxt}>恭喜您</Text>
            <Text style={styles.congratulationTxt}>已成功入驻吾爱店铺</Text>
          </View>
          <View style={styles.tipWrap}>
            <Text style={[styles.tip, styles.red]}>我们通过线上推广和传播给您的线下店铺带来更多的生意</Text>
            <Text style={styles.tip}>请确保店铺信息的真实合法性，平台将不定期对店铺信息进行排查，杜绝非法欺骗的行为</Text>
          </View>

          <CommonButton
            buttonStyle={{marginTop:normalizeH(54)}}
            title="完善店铺资料"
            onPress={()=>{this.completeShopInfo()}}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopRegisterSuccess)

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
        paddingTop: normalizeH(64),
      },
      android: {
        paddingTop: normalizeH(44)
      }
    }),
    flex: 1,
  },
  image: {
    height:normalizeH(311)
  },
  congratulationWrap: {
    marginTop: normalizeH(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  congratulationTxt: {
    fontSize: em(28),
    color: THEME.colors.red,
    lineHeight: em(40)
  },
  tipWrap: {
    marginTop: normalizeH(10),
    alignItems: 'center'

  },
  tip: {
    width: normalizeW(307),
    fontSize: 10,
    color: THEME.colors.lighter,
    lineHeight: 15,
    textAlign: 'center'
  },
  red: {
    color: THEME.colors.red,
  }
})