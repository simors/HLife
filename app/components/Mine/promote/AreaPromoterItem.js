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
import Popup from '@zzzkk2009/react-native-popup'
import THEME from '../../../constants/themes/theme1'
import PromoterLevelIcon from './PromoterLevelIcon'
import {getConversationTime} from '../../../util/numberUtils'
import {userInfoById} from '../../../selector/authSelector'
import * as Toast from '../../common/Toast'
import Icon from 'react-native-vector-icons/Ionicons'

class AreaPromoterItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: false,
      expand: false,
    }
  }

  setAsAreaAgent(userInfo, promoter) {
    if (promoter.identity != 0) {
      Toast.show('此推广员已经是区域代理')
      return
    }
    this.setState({selected: true})
    let that = this
    Popup.confirm({
      title: '提示',
      content: '确认将' + userInfo.nickname + '设置为代理？',
      ok: {
        text: '确定',
        style: {color: THEME.base.mainColor},
        callback: ()=>{
          that.props.setAreaAgent(promoter)
        }
      },
      cancel: {
        text: '取消',
        callback: ()=>{
          that.setState({selected: false})
        }
      }
    })
  }

  toggleDetail() {
    this.setState({expand: !this.state.expand})
  }

  render() {
    let promoter = this.props.promoter
    if (!promoter) {
      return <View/>
    }
    return (
      <View style={{borderBottomWidth: 1, borderColor: '#F5F5F5'}}>
        <View style={styles.promoterBaseView}>
          <TouchableOpacity style={{paddingLeft: normalizeW(15), paddingRight: normalizeW(10)}}
                            onPress={() => {Actions.PERSONAL_HOMEPAGE({userId: this.props.userInfo.id})}}>
            <Image style={styles.avatarStyle}
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
            <TouchableOpacity style={{marginRight: normalizeW(15)}} onPress={() => {this.setAsAreaAgent(this.props.userInfo, promoter)}}>
              <Image source={this.state.selected ? require('../../../assets/images/selected.png') : require('../../../assets/images/unselect.png')}/>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.performView} onPress={() => {this.toggleDetail()}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.totalPerformText}>总业绩</Text>
            <Text style={styles.performText}>{promoter.shopEarnings + promoter.royaltyEarnings}</Text>
          </View>
          <View style={{marginRight: normalizeW(15)}}>
            <Icon
              name={this.state.expand ? 'ios-arrow-down' : 'ios-arrow-forward'}
              style={{color: '#F5F5F5', fontSize: em(28)}}/>
          </View>
        </TouchableOpacity>
        <View style={[styles.detailView, {height:  this.state.expand ? normalizeH(115) : 0, overflow: 'hidden'}]}>
          <View style={[styles.detailItem, {borderBottomWidth: 1, borderColor: '#FFF'}]}>
            <Text style={styles.detailTitle}>入驻店铺数</Text>
            <Text style={styles.detailValue}>{promoter.inviteShopNum}家</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>推广团队人数</Text>
            <Text style={styles.detailValue}>{promoter.teamMemNum}人</Text>
          </View>
        </View>
      </View>
    )
  }
}

AreaPromoterItem.defaultProps = {
  showDetail: false,
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
    justifyContent: 'space-between',
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
  detailView: {
    backgroundColor: '#F5F5F5',
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    backgroundColor: '#F5F5F5',
  },
  detailTitle: {
    fontSize: em(17),
    color: '#5A5A5A',
  },
  detailValue: {
    fontSize: em(17),
    color: THEME.base.mainColor,
  },
})