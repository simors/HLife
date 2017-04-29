/**
 * Created by lilu on 2017/1/12.
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

class promoterAuthSuccess extends Component {
  constructor(props) {
    super(props)
  }

  newerGift(){

  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="text"
          leftText="取消"
          leftPress={() => Actions.pop()}
          title="推广大使"
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <Image style={styles.image} source={require("../../../assets/images/promote_sucsess_gift.png")} />
          <View style={styles.congratulationWrap}>
            <Text style={styles.congratulationTxt}>恭喜您</Text>
            <Text style={styles.congratulationTxt}>已成为吾爱推广大使</Text>
          </View>
          <CommonButton
            buttonStyle={{marginTop:normalizeH(69)}}
            title="点击获取新手大礼包"
            onPress={()=>{this.newerGift()}}
          />
          <CommonButton
            buttonStyle={{marginTop:normalizeH(15)}}
            title="直接开始使用"
            onPress={()=>{}}
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

export default connect(mapStateToProps, mapDispatchToProps)(promoterAuthSuccess)

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
    height:normalizeH(220),
    width:normalizeW(220),
    marginTop:normalizeH(59)
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
    fontSize: em(10),
    color: THEME.colors.lighter,
    lineHeight: 15,
    textAlign: 'center'
  },
  red: {
    color: THEME.colors.red,
  }
})