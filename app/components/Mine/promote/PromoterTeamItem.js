/**
 * Created by yangyang on 2017/4/10.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import THEME from '../../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {userInfoById} from '../../../selector/authSelector'
import {getConversationTime} from '../../../util/numberUtils'
import PromoterLevelIcon from './PromoterLevelIcon'

class PromoterTeamItem extends Component {
  constructor(props) {
    super(props)
  }

  renderMemberCount(promoter) {
    if (this.props.showDetail) {
      return (
        <View style={styles.memNumView}>
          <Image style={{width: normalizeW(18), height: normalizeH(15)}} source={require('../../../assets/images/team_18.png')}/>
          <Text style={{fontSize: em(15), color: '#5A5A5A', paddingTop: normalizeH(10)}}>{promoter.teamMemNum} 人</Text>
        </View>
      )
    }
    return <View/>
  }

  renderPerformanceItem() {
    let promoter = this.props.promoter
    let userInfo = this.props.userInfo
    if (this.props.showDetail) {
      return (
        <TouchableOpacity onPress={() => Actions.PROMOTER_SECOND_TEAM({promoter, user: userInfo})} style={styles.memberView}>
          <View>
            <Text style={styles.usernameText}>{userInfo.nickname}</Text>
            <View style={styles.promoterInfoView}>
              <PromoterLevelIcon level={promoter.level} mode="tiny"/>
              <Text style={styles.promoterDealText}>最新业绩： {getConversationTime(new Date(promoter.updatedAt))}</Text>
            </View>
          </View>
          {this.renderMemberCount(promoter)}
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={styles.memberView}>
          <View>
            <Text style={styles.usernameText}>{userInfo.nickname}</Text>
            <View style={styles.promoterInfoView}>
              <PromoterLevelIcon level={promoter.level} mode="tiny"/>
              <Text style={styles.promoterDealText}>最新业绩： {getConversationTime(new Date(promoter.updatedAt))}</Text>
            </View>
          </View>
          {this.renderMemberCount(promoter)}
        </View>
      )
    }
  }

  renderItem(promoter, userInfo) {
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: userInfo.id})}
                            style={{paddingLeft: normalizeW(15), paddingRight: normalizeW(9)}}>
            <Image style={styles.avatarStyle} resizeMode="contain"
                   source={userInfo.avatar ? {uri: userInfo.avatar} : require("../../../assets/images/default_portrait.png")} />
          </TouchableOpacity>
          {this.renderPerformanceItem()}
        </View>
        <View style={styles.performView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.performText}>总业绩</Text>
            <Text style={styles.royaltyText}>{(promoter.royaltyEarnings + promoter.shopEarnings).toFixed(3)}</Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    let promoter = this.props.promoter
    let userInfo = this.props.userInfo
    if (!promoter || !userInfo) {
      return <View/>
    }
    return (
      <View>
        <View style={styles.teamInfoView}>
          {this.renderItem(promoter, userInfo)}
        </View>
      </View>
    )
  }
}

PromoterTeamItem.defaultProps = {
  showDetail: true,
}

const mapStateToProps = (state, ownProps) => {
  let userId = ownProps.promoter.userId
  let userInfo = userInfoById(state, userId).toJS()

  return {
    userInfo
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PromoterTeamItem)

const styles = StyleSheet.create({
  teamInfoView: {
    paddingTop: normalizeH(20),
    paddingBottom: normalizeH(16),
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  avatarStyle: {
    width: normalizeW(44),
    height: normalizeH(44),
    borderRadius: normalizeW(22),
    overflow: 'hidden',
  },
  memberView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: normalizeH(12),
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  usernameText: {
    fontSize: em(17),
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  promoterInfoView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: normalizeH(10),
  },
  promoterDealText: {
    fontSize: em(12),
    color: '#B6B6B6',
    paddingLeft: normalizeW(10),
  },
  memNumView: {
    paddingRight: normalizeW(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  performView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: normalizeW(69),
    paddingTop: normalizeH(12),
  },
  performText: {
    fontSize: em(12),
    color: '#5A5A5A',
    paddingRight: normalizeW(5),
  },
  royaltyText: {
    fontSize: em(15),
    color: THEME.base.mainColor,
  },
})