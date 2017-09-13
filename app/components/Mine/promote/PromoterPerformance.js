/**
 * Created by yangyang on 2017/8/23.
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
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import THEME from '../../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {getPromoterById, activePromoter} from '../../../selector/promoterSelector'
import PromoterIcon from '../../common/PromoterIcon'
import Svg from '../../common/Svgs'
import math from 'mathjs'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height



class PromoterPerformance extends Component {
  constructor(props) {
    super(props)
  }

  showQrCodeView() {
    if(this.props.promoter && this.props.promoter.qrcode) {
      Actions.QRCODE_VIEW({qrcodeUrl: this.props.promoter.qrcode.url})
    }
  }

  renderToolbar() {
    let promoter = this.props.promoter
    if (!promoter) {
      return <View/>
    }
    return (
      <View style={styles.toolView}>
        <TouchableOpacity style={{width: normalizeW(35), height: normalizeH(35), justifyContent: 'center', alignItems: 'center'}}
                          onPress={() => Actions.pop()} >
          <Icon name="ios-arrow-back" style={styles.left} />
        </TouchableOpacity>
        <PromoterIcon isSmall={false} level={promoter.level}/>
      </View>
    )
  }

  renderHeaderView() {
    let promoter = this.props.promoter
    if (!promoter) {
      return <View/>
    }
    return (
      <View style={styles.header}>
        {this.renderToolbar()}
        <View style={{alignItems: 'center', marginTop: normalizeH(20)}}>
          <Text style={styles.headerText}>推广总收益(元)</Text>
        </View>
        <View style={{alignItems: 'center', marginTop: normalizeH(15)}}>
          <Text style={{fontSize: em(40), color: '#FFF'}}>{Number(promoter.shopEarnings + promoter.royaltyEarnings).toFixed(2)}</Text>
        </View>
        <View style={{alignItems: 'center', marginTop: normalizeH(20)}}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => {Actions.EARN_RECORD({promoterId: this.props.activePromoterId})}}>
            <Text style={styles.headerText}>收益记录</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderBodyView() {
    let promoter = this.props.promoter
    console.log('promoter', promoter)
    if (!promoter) {
      return <View/>
    }
    return (
      <View>
        <TouchableOpacity style={{borderBottomWidth: 1, borderColor: '#F7F7F7'}}
                          onPress={() => {Actions.INVITED_SHOPS()}}>
          <View style={styles.statItemView}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Svg size={32} icon="shop_invite_promoter"/>
              <Text style={styles.statTip}>邀请店铺</Text>
            </View>
            <View>
              <Text style={styles.statValue}>{promoter.inviteShopNum}家</Text>
            </View>
          </View>
          <View style={[styles.statItemView, {marginLeft: normalizeW(45), borderTopWidth: 1, borderColor: '#F7F7F7'}]}>
            <Text style={styles.earnTip}>收益</Text>
            <View>
              <Text style={styles.statValue}>¥{promoter.shopEarnings.toFixed(2)}元</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{borderBottomWidth: 1, borderColor: '#F7F7F7'}}
                          onPress={() => {Actions.DIRECT_TEAM()}}>
          <View style={styles.statItemView}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Svg size={32} icon="my_team" />
              <Text style={styles.statTip}>我的邻友</Text>
            </View>
            <View>
              <Text style={styles.statValue}>{math.chain(promoter.teamMemNum).add(promoter.level2Num).add(promoter.level3Num).done()}人</Text>
            </View>
          </View>
          <View style={[styles.statItemView, {marginLeft: normalizeW(45), borderTopWidth: 1, borderColor: '#F7F7F7'}]}>
            <Text style={styles.earnTip}>收益</Text>
            <View>
              <Text style={styles.statValue}>¥{promoter.royaltyEarnings.toFixed(2)}元</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={{paddingTop: normalizeH(40)}} onPress={() => {this.showQrCodeView()}}>
            <Image style={{width: normalizeW(156), height: normalizeH(156)}}
                   resizeMode='contain'
                   source={require('../../../assets/images/generate_code.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
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
    activePromoterId: promoterId,
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
    height: normalizeH(218),
    backgroundColor: THEME.base.mainColor,
  },
  toolView: {
    marginTop: normalizeH(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: normalizeW(15),
  },
  left: {
    fontSize: em(32),
    color: '#FFF',
  },
  headerText: {
    fontSize: em(15),
    color: '#FFF',
  },
  headerBtn: {
    width: normalizeW(90),
    height: normalizeH(30),
    borderRadius: normalizeH(15),
    borderWidth: 1,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItemView: {
    height: normalizeH(42),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: normalizeW(12),
    paddingRight: normalizeW(12),
  },
  statTip: {
    fontSize: em(17),
    color: '#000',
    marginLeft: normalizeW(7),
  },
  statValue: {
    fontSize: em(20),
    fontWeight: 'bold',
    color: THEME.base.mainColor,
  },
  earnTip: {
    fontSize: em(15),
    color: 'rgba(0,0,0,0.5)',
  },
})