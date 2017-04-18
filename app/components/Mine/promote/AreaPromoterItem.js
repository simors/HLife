/**
 * Created by yangyang on 2017/4/18.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../../constants/themes/theme1'
import PromoterLevelIcon from './PromoterLevelIcon'
import {getConversationTime} from '../../../util/numberUtils'
import {userInfoById} from '../../../selector/authSelector'

class AreaPromoterItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let promoter = this.props.promoter
    if (!promoter) {
      return <View/>
    }
    return (
      <View style={{borderBottomWidth: 1, borderColor: '#F5F5F5'}}>
        <View style={styles.promoterBaseView}>
          <TouchableOpacity style={{paddingLeft: normalizeW(15), paddingRight: normalizeW(10)}} onPress={() => {}}>
            <Image style={styles.avatarStyle} resizeMode='contain'
                   source={this.props.userInfo.avatar ? {uri: this.props.userInfo.avatar} : require('../../../assets/images/default_portrait.png')}/>
          </TouchableOpacity>
          <View style={styles.baseInfoView}>
            <View>
              <View>
                <Text style={styles.nicknameText}>{this.props.userInfo.nickname}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: normalizeH(10)}}>
                <PromoterLevelIcon level={promoter.level} mode="tiny"/>
                <Text style={[styles.tipsText, {paddingLeft: normalizeW(10), paddingRight: normalizeW(10)}]}>{promoter.liveCity}</Text>
                <Text style={styles.tipsText}>最新业绩：{getConversationTime(new Date(promoter.updatedAt))}</Text>
              </View>
            </View>
            <TouchableOpacity style={{marginRight: normalizeW(15)}} onPress={() => {}}>
              <Image source={require('../../../assets/images/unselect.png')}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.performView}>
          <Text style={styles.totalPerformText}>总业绩</Text>
          <Text style={styles.performText}>{promoter.shopEarnings + promoter.royaltyEarnings}</Text>
        </View>
      </View>
    )
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(AreaPromoterItem)

const styles = StyleSheet.create({
  avatarStyle: {
    width: normalizeW(44),
    height: normalizeH(44),
    borderRadius: normalizeW(22),
    overflow: 'hidden',
  },
  promoterBaseView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  baseInfoView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: normalizeH(69),
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  nicknameText: {
    fontSize: em(17),
    fontWeight: 'bold',
    color: '#5a5a5a',
  },
  tipsText: {
    fontSize: em(12),
    color: '#B6B6B6',
  },
  performView: {
    height: normalizeH(43),
    paddingLeft: normalizeW(70),
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalPerformText: {
    fontSize: em(12),
    color: '#5A5A5A',
    paddingRight: normalizeW(10),
  },
  performText: {
    fontSize: em(15),
    color: THEME.base.mainColor,
  },
})