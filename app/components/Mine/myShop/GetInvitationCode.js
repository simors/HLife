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

export default class GetInvitationCode extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="text"
          leftText="x"
          leftPress={() => Actions.pop()}
          title="邀请码获取方式"
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>
          <ScrollView>
            <View>
              <Image style={styles.image} source={require("../../../assets/images/shop_congratuation.png")} />
              <Text style={styles.title}>加入{appConfig.APP_NAME}店铺</Text>
            </View>

            <View style={styles.illustration}>
              <Text style={styles.text}>尊敬的用户：</Text>
              <Text style={styles.text}>&nbsp;&nbsp;&nbsp;&nbsp;为完善推广系统，方便玩家推荐好友享受游戏的乐趣，波克城市介绍人系统说明。</Text>
              <Text style={styles.text}>&nbsp;&nbsp;&nbsp;&nbsp;1、等级为2级及以上的玩家，只要玩波克平台下的游戏（除推推乐、杀闪封神以及明星山庄出售的元宝），都有机会获得“明信片”，获得的“明信片”可以在大厅背包中查看。</Text>
              <Text style={styles.text}>&nbsp;&nbsp;&nbsp;&nbsp;2、您可以将“明信片”赠送给朋友，朋友用手机号注册波克城市帐号即可获得一级礼包。同时，您与朋友建立牌友关系。</Text>
            </View>

            <CommonButton
              buttonStyle={{marginTop:normalizeH(20)}}
              title="完善店铺资料"
              onPress={()=>{}}
            />
            <CommonButton
              buttonStyle={{marginTop:normalizeH(15)}}
              title="超值购买"
              onPress={()=>{}}
            />
          </ScrollView>

        </View>
      </View>
    )
  }
}

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
    fontSize: em(26)
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
    height:normalizeH(200)
  },
  title: {
    position: 'absolute',
    left: normalizeW(36),
    bottom: normalizeH(25),
    fontSize: em(28),
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'transparent'
  },
  illustration: {
    padding: 15
  },
  text: {
    color: THEME.colors.lighter,
    lineHeight: em(20),
    fontSize: em(15),
    letterSpacing: 1
  }

})