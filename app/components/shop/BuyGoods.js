/**
 * Created by yangyang on 2017/8/21.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../constants/themes/theme1'
import Header from '../common/Header'
import {CachedImage} from "react-native-img-cache"
import {getThumbUrl} from '../../util/ImageUtil'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class BuyGoods extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: "1",
      receiver: "",
      receiverPhone: "",
      receiverAddr: "",
      remark: "",
    }
  }

  renderBottomBar() {
    return (
      <View style={styles.bottomBarView}>
        <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: normalizeW(15)}}>
          <Text style={{fontSize: em(10), color: '#000'}}>实付款：</Text>
          <Text style={{fontSize: em(20), color: THEME.base.mainColor}}>
            ¥{this.state.amount * this.props.goods.price}元
          </Text>
        </View>
        <TouchableOpacity onPress={() => {}} style={styles.subBtn}>
          <Text style={{fontSize: em(15), color: '#FFF'}}>提交订单</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    let goods = this.props.goods
    console.log('goods:', goods)
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="下单"
        />
        <View style={styles.body}>
          <View style={styles.goodsView}>
            <View style={{paddingRight: normalizeW(11)}}>
              <CachedImage mutable
                           style={[{width: normalizeW(100),height: normalizeH(100)}]}
                           source={{uri: getThumbUrl(goods.coverPhoto, normalizeW(100), normalizeH(100))}} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.goodsNameText} numberOfLines={2}>{goods.goodsName}</Text>
              <Text style={styles.goodsPriceText}>¥{goods.price}</Text>
            </View>
          </View>
          <View style={styles.inputArea}>
            <View style={styles.inputView}>
              <View style={{width: normalizeW(120)}}>
                <Text style={styles.inputTipText}>收件人姓名</Text>
              </View>
              <View style={{flex: 1, marginLeft: normalizeW(30)}}>
                <TextInput
                  style={styles.textinputStyle}
                  onChangeText={(receiver) => this.setState({receiver})}
                  value={this.state.receiver}
                  underlineColorAndroid="transparent"
                  placeholder="请输入收件人姓名"
                />
              </View>
            </View>
            <View style={styles.inputView}>
              <View style={{width: normalizeW(120)}}>
                <Text style={styles.inputTipText}>收件人手机号</Text>
              </View>
              <View style={{flex: 1, marginLeft: normalizeW(30)}}>
                <TextInput
                  style={styles.textinputStyle}
                  onChangeText={(receiverPhone) => this.setState({receiverPhone})}
                  value={this.state.receiverPhone}
                  underlineColorAndroid="transparent"
                  placeholder="请输入收件人手机号"
                />
              </View>
            </View>
            <View style={styles.inputView}>
              <View style={{width: normalizeW(120)}}>
                <Text style={styles.inputTipText}>收件人地址</Text>
              </View>
              <View style={{flex: 1, marginLeft: normalizeW(30)}}>
                <TextInput
                  style={styles.textinputStyle}
                  onChangeText={(receiverAddr) => this.setState({receiverAddr})}
                  value={this.state.receiverAddr}
                  underlineColorAndroid="transparent"
                  placeholder="请输入收件人地址"
                />
              </View>
            </View>
            <View style={styles.inputView}>
              <View style={{width: normalizeW(120)}}>
                <Text style={styles.inputTipText}>购买数量</Text>
              </View>
              <View style={{flex: 1, marginLeft: normalizeW(30)}}>
                <TextInput
                  style={styles.textinputStyle}
                  onChangeText={(amount) => this.setState({amount})}
                  value={this.state.amount}
                  underlineColorAndroid="transparent"
                  keyboardType="numeric"
                  placeholder="请输入购买商品的数量"
                />
              </View>
            </View>
            <View style={[styles.inputView, {borderBottomWidth: 0}]}>
              <View style={{width: normalizeW(120)}}>
                <Text style={styles.inputTipText}>备注信息</Text>
              </View>
            </View>
            <View style={{height: normalizeH(100), borderWidth: 1, borderColor: '#E2E2E2', borderRadius: 5}}>
              <TextInput
                style={[styles.textinputStyle, {textAlignVertical: 'top'}]}
                onChangeText={(remark) => this.setState({remark})}
                value={this.state.remark}
                underlineColorAndroid="transparent"
                placeholder="给商家留言"
                multiline={true}
              />
            </View>
          </View>
        </View>
        {this.renderBottomBar()}
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

export default connect(mapStateToProps, mapDispatchToProps)(BuyGoods)


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: normalizeH(64),
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  goodsView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalizeH(130),
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    backgroundColor: '#FFF',
  },
  goodsNameText: {
    fontSize: em(17),
    color: '#000',
    lineHeight: 25,
  },
  goodsPriceText: {
    fontSize: em(20),
    fontWeight: 'bold',
    color: THEME.base.mainColor,
    marginTop: normalizeH(15),
  },
  inputArea: {
    marginTop: normalizeH(5),
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    backgroundColor: '#FFF',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalizeH(47),
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  inputTipText: {
    fontSize: em(17),
    color: '#000',
  },
  textinputStyle: {
    flex: 1,
    padding: 0,
    fontSize: em(17),
    color: '#B2B2B2',
  },
  bottomBarView: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: normalizeH(49),
    width: PAGE_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(250, 250, 250, 0.9)',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.lighterA,
  },
  subBtn: {
    height: normalizeH(49),
    width: normalizeW(135),
    backgroundColor: THEME.base.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
})