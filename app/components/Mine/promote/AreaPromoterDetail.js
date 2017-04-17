/**
 * Created by yangyang on 2017/4/15.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  InteractionManager,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ListView,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../../constants/themes/theme1'
import Header from '../../common/Header'
import KeyboardAwareToolBar from '../../common/KeyboardAwareToolBar'
import ToolBarContent from '../../shop/ShopCommentReply/ToolBarContent'
import {getTotalPerformance, setShopTenant} from '../../../action/promoterAction'
import {selectPromoterStatistics, selectCityTenant} from '../../../selector/promoterSelector'
import * as Toast from '../../common/Toast'

class AreaPromoterDetail extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.getTotalPerformance({
        province: this.props.province,
        city: this.props.city,
        district: this.props.district,
      })
    })
  }

  openModal() {
    if (this.feeInput) {
      this.feeInput.focus()
    }
  }

  setTenantFee(tenant) {
    let payload = {
      fee: parseFloat(tenant),
      province: this.props.province,
      city: this.props.area,
      success: () => {
        this.feeInput.blur()
        Toast.show('设置入驻费成功')
      },
      error: (err) => {
        this.feeInput.blur()
        Toast.show(err)
      }
    }
    console.log(payload)
    this.props.setShopTenant(payload)
  }

  renderFeeView() {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {this.openModal()}}>
        <Text style={{fontSize: em(17), color: THEME.base.mainColor, fontWeight: 'bold'}}>{this.props.tenant}</Text>
      </TouchableOpacity>
    )
  }

  renderBaseView() {
    let promoter = this.props.promoter
    return (
      <View style={{backgroundColor: '#FFF'}}>
        <View style={[styles.agentItemView, {borderBottomWidth: 1, borderColor: '#f5f5f5'}]}>
          <View style={{flexDirection: 'row', paddingLeft: normalizeW(15), alignItems: 'center'}}>
            <Image style={styles.avatarStyle} resizeMode='contain'
                   source={this.props.avatar ? {uri: this.props.avatar} : require('../../../assets/images/default_portrait.png')}/>
            <View style={{paddingLeft: normalizeW(10)}}>
              <Text style={styles.titleText}>{this.props.nickname ? this.props.nickname : '未设置代理人'}</Text>
              <Text style={{fontSize: em(12), color: '#B6B6B6', paddingTop: normalizeH(9)}}>
                个人业绩： {promoter ? promoter.shopEarnings + promoter.royaltyEarnings : 0}
              </Text>
            </View>
          </View>
          <View style={styles.changeAgentBtn}>
            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {}}>
              <Text style={{fontSize: em(15), color: '#FFF'}}>更换代理</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.agentItemView}>
          <View style={{flexDirection: 'row', paddingLeft: normalizeW(15), alignItems: 'center'}}>
            <Image style={styles.avatarStyle} resizeMode='contain' source={require('../../../assets/images/Settlement_fee.png')}/>
            <View style={{paddingLeft: normalizeW(10)}}>
              <Text style={styles.titleText}>当前店铺入驻费（元）</Text>
            </View>
          </View>
          <View style={[styles.changeAgentBtn, {backgroundColor: 'rgba(255, 157, 78, 0.2)'}]}>
            {this.renderFeeView()}
          </View>
        </View>
      </View>
    )
  }

  renderStatView() {
    let statistics = this.props.statistics
    if (!statistics) {
      return <View/>
    }
    return (
      <View style={{marginTop: normalizeH(8), backgroundColor: '#FFF'}}>
        <View style={styles.totalPerformView}>
          <Text style={[styles.titleText, {paddingTop: normalizeH(15)}]}>全市总业绩（元）</Text>
          <Text style={[styles.totalPerformText, {paddingTop: normalizeH(15)}]}>{statistics.totalPerformance}</Text>
        </View>
        <View style={styles.perforItemView}>
          <Text style={[styles.performItemText, {paddingLeft: normalizeW(15)}]}>入驻店铺数</Text>
          <Text style={[styles.performItemValue, {paddingRight: normalizeW(15)}]}>{statistics.totalInvitedShops} 家</Text>
        </View>
        <View style={styles.perforItemView}>
          <Text style={[styles.performItemText, {paddingLeft: normalizeW(15)}]}>推广团队总人数</Text>
          <Text style={[styles.performItemValue, {paddingRight: normalizeW(15)}]}>{statistics.totalTeamMems} 人</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header leftType="icon"
                leftIconName="ios-arrow-back"
                leftPress={()=> {
                  Actions.pop()
                }}
                title={this.props.area + '详情'}
        />
        <View style={styles.body}>
          <ScrollView style={{flex: 1}}>
            {this.renderBaseView()}
            {this.renderStatView()}
          </ScrollView>

          <KeyboardAwareToolBar
            initKeyboardHeight={-normalizeH(50)}
          >
            <ToolBarContent
              replyInputRefCallBack={(input)=> {
                this.feeInput = input
              }}
              onSend={(tenant) => {
                this.setTenantFee(tenant)
              }}
              placeholder='设置入驻费'
              label="设置"
              keyboardType="numeric"
            />
          </KeyboardAwareToolBar>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let province = ownProps.province
  let city = ownProps.city
  let district = ownProps.district
  let area = province + city + district
  let statistics = selectPromoterStatistics(state, area)
  let tenant = selectCityTenant(state, ownProps.area)
  return {
    statistics,
    tenant,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getTotalPerformance,
  setShopTenant
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AreaPromoterDetail)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
  },
  body: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44),
      }
    }),
  },
  agentItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: normalizeH(65),
  },
  avatarStyle: {
    width: normalizeW(44),
    height: normalizeH(44),
    borderRadius: normalizeW(22),
    overflow: 'hidden',
  },
  changeAgentBtn: {
    width: normalizeW(76),
    height: normalizeH(25),
    backgroundColor: THEME.base.mainColor,
    borderRadius: 2,
    marginRight: normalizeW(15),
  },
  titleText: {
    fontSize: em(15),
    color: '#5a5a5a',
  },
  totalPerformText: {
    fontSize: em(36),
    fontWeight: 'bold',
    color: THEME.base.mainColor,
  },
  totalPerformView: {
    height: normalizeH(99),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  perforItemView: {
    height: normalizeH(47),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  performItemText: {
    fontSize: em(17),
    color: '#5A5A5A',
  },
  performItemValue: {
    fontSize: em(17),
    color: THEME.base.mainColor,
  },
})