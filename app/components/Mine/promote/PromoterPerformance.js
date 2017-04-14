/**
 * Created by yangyang on 2017/3/25.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  StatusBar,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import THEME from '../../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import PromoterLevelIcon from './PromoterLevelIcon'
import {getPromoterById, activePromoter} from '../../../selector/promoterSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class PromoterPerformance extends Component {
  constructor(props) {
    super(props)
  }

  renderToolbar() {
    return (
      <View style={styles.toolView}>
        <TouchableOpacity style={{width: normalizeW(35), height: normalizeH(35), justifyContent: 'center', alignItems: 'center'}}
                          onPress={() => Actions.pop()} >
          <Icon name="ios-arrow-back" style={styles.left} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Image style={{width: normalizeW(20), height: normalizeH(20)}} source={require('../../../assets/images/revernue_details.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderPromoterLevel() {
    let promoter = this.props.promoter
    if (!promoter) {
      return <View/>
    }
    return (
      <View style={{paddingTop: normalizeH(15), alignSelf: 'center'}}>
        <PromoterLevelIcon level={promoter.level} />
      </View>
    )
  }

  renderCategoryEarnings() {
    let promoter = this.props.promoter
    if (!promoter) {
      return <View/>
    }
    return (
      <View style={styles.categoryEarningsView}>
        <View style={{flex: 1, borderColor: 'rgba(255,255,255,0.50)', borderRightWidth: 1}}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {}}>
            <Text style={styles.categoryTextStyle}>店铺收益 (元)</Text>
            <Text style={styles.categoryEarningsText}>{promoter.shopEarnings}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {}}>
            <Text style={styles.categoryTextStyle}>分成收益 (元)</Text>
            <Text style={styles.categoryEarningsText}>{promoter.royaltyEarnings}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderHeaderView() {
    return (
      <LinearGradient colors={['#F77418', '#F5A623', '#F77418']} style={styles.header}>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          {this.renderToolbar()}
          {this.renderPromoterLevel()}
          {this.renderCategoryEarnings()}
        </View>
      </LinearGradient>
    )
  }

  renderTotalEarnings() {
    let promoter = this.props.promoter
    if (!promoter) {
      return <View/>
    }
    return (
      <View style={styles.totalEarningsView}>
        <Text style={{fontSize: em(17), color: '#5A5A5A', paddingTop: normalizeH(25)}}>推广总收益 (元)</Text>
        <Text style={{fontSize: em(38), color: THEME.base.mainColor, paddingTop: normalizeH(5)}}>
          {promoter.shopEarnings + promoter.royaltyEarnings}
        </Text>
      </View>
    )
  }

  renderInvitationStat() {
    let promoter = this.props.promoter
    if (!promoter) {
      return <View/>
    }
    return (
      <View style={styles.invitationStatView}>
        <TouchableOpacity style={[styles.statBtn, {borderColor: '#F5F5F5', borderRightWidth: 1}]} onPress={() => {Actions.INVITED_SHOPS()}}>
          <View style={styles.statTitleStyle}>
            <Image style={{width: normalizeW(25), height: normalizeH(23)}}
                   source={require('../../../assets/images/shop_invite.png')}/>
            <Text style={styles.statTitleText}>邀请店铺</Text>
          </View>
          <View style={styles.statNum}>
            <Text style={{fontSize: em(36), color: THEME.base.mainColor, paddingRight: normalizeW(8)}}>{promoter.inviteShopNum}</Text>
            <Text style={{fontSize: em(17), color: THEME.base.mainColor, alignSelf: 'flex-end'}}>家</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statBtn} onPress={() => {Actions.DIRECT_TEAM()}}>
          <View style={styles.statTitleStyle}>
            <Image style={{width: normalizeW(25), height: normalizeH(21)}}
                   source={require('../../../assets/images/my_team.png')}/>
            <Text style={styles.statTitleText}>团队成员</Text>
          </View>
          <View style={styles.statNum}>
            <Text style={{fontSize: em(36), color: THEME.base.mainColor, paddingRight: normalizeW(8)}}>{promoter.teamMemNum}</Text>
            <Text style={{fontSize: em(17), color: THEME.base.mainColor, alignSelf: 'flex-end'}}>人</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderBodyView() {
    return (
      <View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {this.renderTotalEarnings()}
          {this.renderInvitationStat()}
          <TouchableOpacity style={{paddingTop: normalizeH(25)}} onPress={() => {Actions.INVITE_CODE_VIEWER()}}>
            <Image style={{width: normalizeW(156), height: normalizeH(156)}}
                   source={require('../../../assets/images/generate_code.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={{flex: 1, height: PAGE_HEIGHT}}>
          {this.renderHeaderView()}
          {this.renderBodyView()}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let promoterId = activePromoter(state)
  let promoter = getPromoterById(state, promoterId)
  return {
    promoter,
  }
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PromoterPerformance)

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: normalizeW(20),
  },
  left: {
    fontSize: em(24),
    color: '#FFF',
  },
  categoryEarningsView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalizeH(40),
    height: normalizeH(69),
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.50)',
  },
  categoryTextStyle: {
    color: '#FFF',
    fontSize: em(12),
  },
  categoryEarningsText: {
    fontSize: em(17),
    fontWeight: 'bold',
    color: '#FFF',
    paddingTop: normalizeH(10),
  },
  totalEarningsView: {
    flex: 1,
    height: normalizeH(110),
    justifyContent: 'center',
    alignItems: 'center',
  },
  invitationStatView: {
    flex: 1,
    height: normalizeH(133),
    flexDirection: 'row',
    borderColor: '#F5F5F5',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  statTitleStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTitleText: {
    fontSize: em(17),
    color: '#5A5A5A',
    paddingLeft: normalizeW(9),
  },
  statBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNum: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: normalizeH(18),
  },
})