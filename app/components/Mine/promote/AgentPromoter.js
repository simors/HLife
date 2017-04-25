/**
 * Created by yangyang on 2017/4/12.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Platform,
  InteractionManager,
  StatusBar,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import THEME from '../../../constants/themes/theme1'
import * as Toast from '../../common/Toast'
import LinearGradient from 'react-native-linear-gradient'
import PromoterAgentIcon from './PromoterAgentIcon'
import {
  selectPromoterStatistics,
  selectLastDaysPerformance,
  selectAreaMonthsPerformance,
} from '../../../selector/promoterSelector'
import {
  getTotalPerformance,
  getLastDaysPerformance,
  getAreaMonthsPerformance,
} from '../../../action/promoterAction'
import Chart from 'react-native-chart'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

const data = [
  [0, 1],
  [1, 4],
  [2, 7],
  [3, 3],
];

class AgentPromoter extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    let promoter = this.props.promoter
    var date = new Date('2017-05-09')
    // var date = new Date()
    date.setTime(date.getTime() - 24*60*60*1000)    // 统计昨天的业绩

    var lastYear = date.getFullYear()
    var lastMonth = date.getMonth()
    if (lastMonth == 0) {
      lastMonth = 12
      lastYear = lastYear - 1
    }

    InteractionManager.runAfterInteractions(()=>{
      this.props.getTotalPerformance({
        province: promoter.province,
        city: promoter.city,
        district: promoter.district,
      })
      this.props.getLastDaysPerformance({
        level: promoter.identity == 1 ? 3 : promoter.identity == 2 ? 2 : 1,
        province: promoter.province,
        city: promoter.city,
        district: promoter.district,
        days: 7,
        lastDate: date.toLocaleDateString(),
        error: (message) => {
          Toast.show(message)
        }
      })
      if (promoter.identity != 3 && promoter.identity != 0) {
        this.props.getAreaMonthsPerformance({
          level: promoter.identity == 1 ? 3 : 2,
          province: promoter.province,
          city: promoter.city,
          lastYear: lastYear,
          lastMonth: lastMonth,
          months: 6,
          error: (message) => {
            Toast.show(message)
          }
        })
      }
    })
  }

  renderRegionManageTool() {
    let promoter = this.props.promoter
    if (promoter.identity >= 3) {
      return <View/>
    }
    return (
      <View>
        <TouchableOpacity onPress={() => {Actions.AREA_MANAGER({promoter: this.props.promoter})}}>
          <Image style={styles.toolBtnImg} resizeMode="contain" source={require('../../../assets/images/region_manage.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderToolView() {
    let promoter = this.props.promoter
    return (
      <View style={styles.toolView}>
        <TouchableOpacity style={{flex: 1, marginLeft: normalizeW(15)}} onPress={() => Actions.pop()}>
          <Icon
            name='ios-arrow-back'
            style={styles.goBack}/>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center', marginRight: normalizeW(15)}}>
          <View style={{marginRight: promoter.identity >= 3 ? 0 : normalizeW(20)}}>
            <TouchableOpacity onPress={() => {Actions.PROMOTER_PERFORMANCE()}}>
              <Image style={styles.toolBtnImg} resizeMode="contain" source={require('../../../assets/images/diamond_20.png')}/>
            </TouchableOpacity>
          </View>
          {this.renderRegionManageTool()}
        </View>
      </View>
    )
  }

  renderAgentIconView() {
    let promoter = this.props.promoter
    return (
      <View style={{alignSelf: 'center', paddingTop: normalizeH(15)}}>
        <TouchableOpacity>
          <PromoterAgentIcon identity={promoter.identity} province={promoter.province} city={promoter.city} district={promoter.district} />
        </TouchableOpacity>
      </View>
    )
  }

  renderHeaderView() {
    return (
      <LinearGradient colors={['#F77418', '#F5A623', '#F77418']} style={styles.header}>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          {this.renderToolView()}
          {this.renderAgentIconView()}
        </View>
      </LinearGradient>
    )
  }

  renderLastDaysChart() {
    let step = 0
    let lastDaysData = this.props.sevenDaysPerf
    if (!lastDaysData) {
      return <View/>
    }
    let dataSet = new Set()
    lastDaysData.forEach((data) => {
      dataSet.add(data[1])
    })
    step = dataSet.size - 1 > 0 ? dataSet.size - 1 : 1
    return (
      <View>
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

  renderLastMonthsChart() {
    return (
      <View>
        <View style={[styles.sevenTitleView, {marginTop: normalizeH(8)}]}>
          <Text style={{fontSize: em(15), color: '#5a5a5a'}}>六月下辖区域业绩（元)</Text>
        </View>
        <View style={styles.chartContainer}>
          <Chart
            style={styles.chart}
            data={data}
            type="bar"
            showDataPoint={true}
            verticalGridStep={data.length - 1}
            tightBounds={true}
            yAxisUseDecimal={true}
          />
        </View>
      </View>
    )
  }

  renderBodyView() {
    if (!this.props.statistics) {
      return <View/>
    }
    return (
      <View style={{marginTop: normalizeH(15), backgroundColor: '#F5F5F5'}}>
        <View style={styles.statItemView}>
          <View style={{paddingLeft: normalizeW(15)}}>
            <Text style={styles.itemTitle}>入驻店铺数</Text>
          </View>
          <View style={{paddingRight: normalizeW(15)}}>
            <Text style={styles.itemData}>{this.props.statistics.totalInvitedShops}家</Text>
          </View>
        </View>
        <View style={[styles.statItemView, {borderTopWidth: 1, borderColor: '#f5f5f5',}]}>
          <View style={{paddingLeft: normalizeW(15)}}>
            <Text style={styles.itemTitle}>推广团队总人数</Text>
          </View>
          <View style={{paddingRight: normalizeW(15)}}>
            <Text style={styles.itemData}>{this.props.statistics.totalTeamMems}人</Text>
          </View>
        </View>
        <View style={styles.totalPerView}>
          <Text style={{fontSize: em(15), color: '#5a5a5a'}}>区域总业绩（元）</Text>
          <Text style={{fontSize: em(36), color: THEME.base.mainColor, fontWeight: 'bold', paddingTop: normalizeH(15)}}>
            {this.props.statistics.totalPerformance}
          </Text>
        </View>
        {this.renderLastDaysChart()}
        {this.renderLastMonthsChart()}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={{flex: 1}}>
          {this.renderHeaderView()}
          {this.renderBodyView()}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let province = ownProps.promoter.province
  let city = ownProps.promoter.city
  let district = ownProps.promoter.district
  let area = province + city + district
  let statistics = selectPromoterStatistics(state, area)
  let areaKey = ''
  if (ownProps.promoter.identity == 1) {
    areaKey = province
  } else if (ownProps.promoter.identity == 2) {
    areaKey = province + city
  } else if (ownProps.promoter.identity == 3) {
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
  console.log('areaMonthsPerf', areaMonthsPerf)
  return {
    statistics,
    sevenDaysPerf,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getTotalPerformance,
  getLastDaysPerformance,
  getAreaMonthsPerformance,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AgentPromoter)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
  },
  header: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        height: normalizeH(217)
      },
      android: {
        height: normalizeH(197)
      },
    }),
  },
  toolView: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(20)
      },
      android: {
        marginTop: normalizeH(0)
      },
    }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: normalizeH(5),
  },
  toolBtnImg: {
    width: normalizeW(20),
    height: normalizeH(20),
  },
  goBack: {
    fontSize: em(28),
    color: '#FFF'
  },
  statItemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: normalizeH(52),
    backgroundColor: '#FFF',
  },
  itemTitle: {
    fontSize: em(17),
    color: '#5a5a5a',
  },
  itemData: {
    fontSize: em(17),
    color: THEME.base.mainColor,
  },
  totalPerView: {
    height: normalizeH(104),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalizeH(8),
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
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
})