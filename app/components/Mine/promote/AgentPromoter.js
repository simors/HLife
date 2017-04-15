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
import {selectPromoterStatistics} from '../../../selector/promoterSelector'
import {getTotalPerformance} from '../../../action/promoterAction'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class AgentPromoter extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.getTotalPerformance({
        identity: this.props.promoter.identity,
        province: this.props.promoter.province,
        city: this.props.promoter.city,
        district: this.props.promoter.district,
      })
    })
  }

  renderToolView() {
    return (
      <View style={styles.toolView}>
        <View style={{marginLeft: normalizeW(15)}}>
          <TouchableOpacity style={{flex: 1}} onPress={() => Actions.pop()}>
            <Icon
              name='ios-arrow-back'
              style={styles.goBack}/>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', marginRight: normalizeW(15)}}>
          <View style={{marginRight: normalizeW(20)}}>
            <TouchableOpacity onPress={() => {Actions.PROMOTER_PERFORMANCE()}}>
              <Image style={styles.toolBtnImg} resizeMode="contain" source={require('../../../assets/images/diamond_20.png')}/>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => {Actions.AREA_MANAGER({promoter: this.props.promoter})}}>
              <Image style={styles.toolBtnImg} resizeMode="contain" source={require('../../../assets/images/region_manage.png')}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  renderAgentIconView() {
    let promoter = this.props.promoter
    return (
      <View style={{alignSelf: 'center'}}>
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
          <Text style={{fontSize: em(15), color: '#5a5a5a'}}>全省总业绩（元）</Text>
          <Text style={{fontSize: em(36), color: THEME.base.mainColor, fontWeight: 'bold', paddingTop: normalizeH(15)}}>
            {this.props.statistics.totalPerformance}
          </Text>
        </View>
        <View style={styles.sevenTitleView}>
          <Text style={{fontSize: em(15), color: '#5a5a5a'}}>近七日业绩（万元）</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={{flex: 1, height: PAGE_HEIGHT, marginBottom: normalizeH(45)}}>
          {this.renderHeaderView()}
          {this.renderBodyView()}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let statistics = selectPromoterStatistics(state)
  return {
    statistics,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getTotalPerformance,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AgentPromoter)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
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
})