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
import {
  getTotalPerformance,
  setShopTenant,
  getShopTenantByCity,
  cancelAreaAgent,
  getLastDaysPerformance,
  getAreaMonthsPerformance,
} from '../../../action/promoterAction'
import {
  selectPromoterStatistics,
  selectCityTenant,
  selectAgentByArea,
  selectLastDaysPerformance,
  selectAreaMonthsPerformance,
} from '../../../selector/promoterSelector'
import * as Toast from '../../common/Toast'
import Popup from '@zzzkk2009/react-native-popup'
import Chart from 'react-native-chart'
import ViewPager from '../../common/ViewPager'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class AreaPromoterDetail extends Component {
  constructor(props) {
    super(props)
    this.lastYear = 0
    this.lastMonth = 0
    this.months = 6
  }

  componentWillMount() {
    let upPromoter = this.props.upPromoter
    // let date = new Date('2017-05-09')
    let date = new Date()
    date.setTime(date.getTime() - 24*60*60*1000)    // 统计昨天的业绩

    this.lastYear = date.getFullYear()
    this.lastMonth = date.getMonth()
    if (this.lastMonth == 0) {
      this.lastMonth = 12
      this.lastYear = this.lastYear - 1
    }

    InteractionManager.runAfterInteractions(()=>{
      this.props.getTotalPerformance({
        province: this.props.province,
        city: this.props.city,
        district: this.props.district,
      })

      if (this.props.upPromoter.identity == 2) {
        this.props.getShopTenantByCity({
          province: this.props.province,
          city: this.props.city,
        })
      }

      this.props.getLastDaysPerformance({
        level: upPromoter.identity == 1 ? 2 : 1,    // 上级是省级代理，则查询市级业绩，上级是市级代理，则查询区县业绩
        province: this.props.province,
        city: this.props.city,
        district: this.props.district,
        days: 7,
        lastDate: date.toLocaleDateString(),
        error: (message) => {
          Toast.show(message)
        }
      })
      if (upPromoter.identity == 1) {   // 上级只能是省级
        this.props.getAreaMonthsPerformance({
          level: upPromoter.identity == 1 ? 2 : 1,
          province: this.props.province,
          city: this.props.city,
          lastYear: this.lastYear,
          lastMonth: this.lastMonth,
          months: this.months,
          error: (message) => {
            Toast.show(message)
          }
        })
      }
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
    this.props.setShopTenant(payload)
  }

  cancelAreaAgent(agent) {
    let upPromoter = this.props.upPromoter
    let payload = {
      promoterId: agent.id,
      identity: upPromoter.identity + 1, // 上级代理只能设置下级代理
      province: upPromoter.province,
      city: upPromoter.identity == 1 ? this.props.area : upPromoter.city,
      district: upPromoter.identity == 1 ? undefined : (upPromoter.identity == 2 ? this.props.area : upPromoter.district),
      success: () => {
        Toast.show('取消代理成功！')
      },
      error: (message) => {
        Toast.show(message)
      }
    }

    Popup.confirm({
      title: '提示',
      content: '确认取消' + this.props.agent.nickname + '的代理？',
      ok: {
        text: '确定',
        style: {color: THEME.base.mainColor},
        callback: ()=>{
          this.props.cancelAreaAgent(payload)
        }
      },
      cancel: {
        text: '取消',
        callback: ()=>{
        }
      }
    })
  }

  renderFeeView() {
    if (this.props.upPromoter.identity == 1) {
      return (
        <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {this.openModal()}}>
          <Text style={{fontSize: em(17), color: THEME.base.mainColor, fontWeight: 'bold'}}>{this.props.tenant}</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: em(17), color: THEME.base.mainColor, fontWeight: 'bold'}}>{this.props.tenant}</Text>
        </View>
      )
    }
  }

  renderManageBtn() {
    let agent = this.props.agent
    let promoter = this.props.promoter
    if (agent.nickname) {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.changeAgentBtn}>
            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                              onPress={() => {Actions.CHANGE_AGENT({
                                upPromoter: this.props.upPromoter,
                                liveProvince: this.props.province,
                                liveCity: this.props.city,
                                area: this.props.area,
                              })}}>
              <Text style={{fontSize: em(15), color: '#FFF'}}>更换</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.changeAgentBtn, {backgroundColor: '#aaaaaa'}]}>
            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                              onPress={() => {this.cancelAreaAgent(promoter)}}>
              <Text style={{fontSize: em(15), color: '#FFF'}}>撤销</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.changeAgentBtn}>
            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                              onPress={() => {Actions.CHANGE_AGENT({
                                upPromoter: this.props.upPromoter,
                                liveProvince: this.props.province,
                                liveCity: this.props.city,
                                area: this.props.area,
                              })}}>
              <Text style={{fontSize: em(15), color: '#FFF'}}>添加</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  renderAgent() {
    let agent = this.props.agent
    let promoter = this.props.promoter
    return (
      <View style={[styles.agentItemView, {borderBottomWidth: 1, borderColor: '#f5f5f5'}]}>
        <View style={{flexDirection: 'row', paddingLeft: normalizeW(15), alignItems: 'center'}}>
          <Image style={styles.avatarStyle}
                 source={agent.avatar ? {uri: agent.avatar} : require('../../../assets/images/default_portrait.png')}/>
          <View style={{paddingLeft: normalizeW(10)}}>
            <Text style={styles.titleText}>{agent.nickname ? agent.nickname : '未设置代理人'}</Text>
            <Text style={{fontSize: em(12), color: '#B6B6B6', paddingTop: normalizeH(9)}}>
              个人业绩： {promoter ? (promoter.shopEarnings + promoter.royaltyEarnings).toFixed(3) : 0}
            </Text>
          </View>
        </View>
        {this.renderManageBtn()}
      </View>
    )
  }

  renderBaseView() {
    return (
      <View style={{backgroundColor: '#FFF'}}>
        {this.renderAgent()}
        <View style={styles.agentItemView}>
          <View style={{flexDirection: 'row', paddingLeft: normalizeW(15), alignItems: 'center'}}>
            <Image style={styles.avatarStyle} resizeMode='contain' source={require('../../../assets/images/Settlement_fee.png')}/>
            <View style={{paddingLeft: normalizeW(10)}}>
              <Text style={styles.titleText}>当前店铺入驻费（元）</Text>
            </View>
          </View>
          <View style={[styles.changeAgentBtn, {backgroundColor: 'rgba(255, 157, 78, 0.2)', width: normalizeW(115)}]}>
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
          <Text style={[styles.titleText, {paddingTop: normalizeH(15)}]}>区域总业绩（元）</Text>
          <Text style={[styles.totalPerformText, {paddingTop: normalizeH(15)}]}>{statistics.totalPerformance.toFixed(3)}</Text>
        </View>
        <View style={styles.perforItemView}>
          <Text style={[styles.performItemText, {paddingLeft: normalizeW(15)}]}>区域推广员总数</Text>
          <Text style={[styles.performItemValue, {paddingRight: normalizeW(15)}]}>{statistics.totalPromoters} 人</Text>
        </View>
        <View style={styles.perforItemView}>
          <Text style={[styles.performItemText, {paddingLeft: normalizeW(15)}]}>发展店铺总数</Text>
          <Text style={[styles.performItemValue, {paddingRight: normalizeW(15)}]}>{statistics.totalInvitedShops} 家</Text>
        </View>
        <View style={styles.perforItemView}>
          <Text style={[styles.performItemText, {paddingLeft: normalizeW(15)}]}>发展推广员总数</Text>
          <Text style={[styles.performItemValue, {paddingRight: normalizeW(15)}]}>{statistics.totalTeamMems} 人</Text>
        </View>
      </View>
    )
  }

  renderLastDaysChart() {
    let step = 0
    let lastDaysData = this.props.sevenDaysPerf
    if (!lastDaysData || lastDaysData.length == 0) {
      return <View/>
    }
    let dataSet = new Set()
    lastDaysData.forEach((data) => {
      dataSet.add(data[1])
    })
    step = dataSet.size - 1 > 0 ? dataSet.size - 1 : 1
    return (
      <View style={{marginTop: normalizeH(8)}}>
        <View style={styles.sevenTitleView}>
          <Text style={{fontSize: em(15), color: '#5a5a5a'}}>近七日业绩（元）</Text>
        </View>
        <View style={styles.chartContainer}>
          <Chart
            style={styles.chart}
            data={lastDaysData}
            verticalGridStep={step}
            type="line"
            showDataPoint={true}
            lineWidth={3}
            tightBounds={true}
            yAxisUseDecimal={true}
            dataPointFillColor={THEME.base.mainColor}
          />
        </View>
      </View>
    )
  }

  renderLastMonthsChart(data, sec, index) {
    return (
      <View>
        {data}
      </View>
    )
  }

  renderAreaMonthsPager() {
    if (!this.props.areaMonthsPerf || this.props.areaMonthsPerf.length == 0) {
      return <View/>
    }
    let pages = []
    let ds = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    })
    this.props.areaMonthsPerf.forEach((value) => {
      if (value.length > 0) {
        pages.push(this.renderAreaMonthsBarChart(value))
      }
    })
    if (pages.length == 0) {
      return (
        <View style={styles.emptyView}>
          <Text style={{fontSize: em(15), color: '#5A5A5A'}}>暂无月度统计数据</Text>
        </View>
      )
    }
    return (
      <ViewPager
        style={{flex:1}}
        dataSource={ds.cloneWithPages(pages)}
        renderPage={(data, sec, index) => this.renderLastMonthsChart(data, sec, index)}
        isLoop={false}
        autoPlay={false}
        initialPage={pages.length > 0 ? pages.length - 1 : 0}
      />
    )
  }

  renderAreaMonthsBarChart(stat) {
    let barData = []
    let month = 0
    stat.forEach((value) => {
      let subData = []
      subData[0] = value.district     // 只可能看到区县级数据
      subData[1] = value.earning
      month = value.month
      barData.push(subData)
    })
    return (
      <View>
        <View style={[styles.sevenTitleView, {marginTop: normalizeH(8)}]}>
          <Text style={{fontSize: em(15), color: '#5a5a5a'}}>{month}月下辖区域业绩（元)</Text>
        </View>
        <View style={styles.chartContainer}>
          <Chart
            style={styles.chart}
            data={barData}
            type="bar"
            showDataPoint={true}
            verticalGridStep={barData.length - 1}
            tightBounds={true}
            yAxisUseDecimal={true}
          />
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<StatusBar barStyle="dark-content" />*/}
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
            {this.renderLastDaysChart()}
            {this.renderAreaMonthsPager()}
          </ScrollView>
        </View>
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
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let province = ownProps.province
  let city = ownProps.city
  let district = ownProps.district
  let area = province + city + district
  let statistics = selectPromoterStatistics(state, area)
  let upPromoter = ownProps.upPromoter
  let agentCity = ''
  if (upPromoter.identity == 1) {
    agentCity = ownProps.area
  } else if (upPromoter.identity == 2) {
    agentCity = city
  }

  let tenant = selectCityTenant(state, agentCity)
  let agent = selectAgentByArea(state, ownProps.area)
  let promoter = agent.promoter

  let areaKey = ''
  if (ownProps.upPromoter.identity == 1) {
    areaKey = province + city
  } else if (ownProps.upPromoter.identity == 2) {
    areaKey = province + city + district
  }

  let lastDaysPerf = selectLastDaysPerformance(state, areaKey)
  let sevenDaysPerf = []
  lastDaysPerf.forEach((value) => {
    let data = []
    let statDate = new Date(value.statDate)
    data[0] = (statDate.getMonth()+1) + '-' + statDate.getDate()
    data[1] = value.earning
    sevenDaysPerf.push(data)
  })

  let areaMonthsPerf = selectAreaMonthsPerformance(state, areaKey)

  return {
    statistics,
    tenant,
    agent,
    promoter,
    sevenDaysPerf,
    areaMonthsPerf,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getTotalPerformance,
  setShopTenant,
  getShopTenantByCity,
  cancelAreaAgent,
  getLastDaysPerformance,
  getAreaMonthsPerformance,
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
    marginTop: normalizeH(64),
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
    width: normalizeW(50),
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
  sevenTitleView: {
    backgroundColor: '#FFF',
    height: normalizeH(53),
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: normalizeH(15),
    paddingRight: normalizeW(15),
    height: 200,
  },
  chart: {
    flex: 1,
    width: PAGE_WIDTH - normalizeW(15),
  },
  emptyView: {
    width: PAGE_WIDTH,
    height: normalizeH(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginTop: normalizeH(8),
  },
})