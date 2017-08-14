/**
 * Created by yangyang on 2017/8/14.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {normalizeW, normalizeH, normalizeBorder, em} from '../../util/Responsive'
import Header from '../common/Header'
import THEME from '../../constants/themes/theme1'

export default class WithdrawalTips extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title='提现说明'
        />
        <View style={styles.body}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View style={{marginTop: normalizeH(20)}}>
              <Text style={styles.titleTips}>汇邻优店账户的余额可以去微信公众号中提取，操作步骤如下：</Text>
            </View>
            <View style={styles.stepTipView}>
              <View style={styles.stepNumView}>
                <Text style={styles.stepNumText}>第一步</Text>
              </View>
              <Text style={styles.stepTips}>关注微信公众号"汇邻优店"</Text>
            </View>
            <View style={styles.stepTipView}>
              <View style={styles.stepNumView}>
                <Text style={styles.stepNumText}>第二步</Text>
              </View>
              <Text style={styles.stepTips}>点击：个人中心 -> 我的钱包</Text>
            </View>
            <View style={[styles.stepTipView, {alignItems: 'flex-start'}]}>
              <View style={styles.stepNumView}>
                <Text style={styles.stepNumText}>第三步</Text>
              </View>
              <View>
                <Text style={[styles.stepTips, {paddingTop: normalizeH(6)}]}>关联"汇邻优店"的app账号</Text>
                <Text style={{fontSize: em(12), color: '#AAA', paddingTop: normalizeH(10), width: normalizeW(233)}} numberOfLines={2}>
                  只需关联一次，以后在公众号中可以直接查看到我的账户余额
                </Text>
              </View>
            </View>
            <View style={styles.stepTipView}>
              <View style={styles.stepNumView}>
                <Text style={styles.stepNumText}>第四步</Text>
              </View>
              <Text style={styles.stepTips}>点击"提现至微信余额"</Text>
            </View>
            <View style={{marginTop: normalizeH(40), alignItems: 'center'}}>
              <Image width={normalizeW(115)} height={normalizeH(115)}
                     source={require('../../assets/images/qrcode.png')}></Image>
              <Text style={{fontSize: em(12), color: '#000'}}>微信扫一扫，关注公众号"汇邻优店"</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  body: {
    marginTop: normalizeH(64),
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    flex: 1,
  },
  titleTips: {
    fontSize: em(15),
    color: '#AAA',
    lineHeight: 25,
  },
  stepTipView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalizeH(15),
  },
  stepNumView: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    marginRight: normalizeW(10),
  },
  stepNumText: {
    fontSize: em(17),
    color: '#5A5A5A',
    padding: 6,
  },
  stepTips: {
    fontSize: em(17),
    color: '#000'
  },
})