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
import {getPromoterById, activePromoter} from '../../../selector/promoterSelector'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class AgentPromoter extends Component {
  constructor(props) {
    super(props)
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
            <TouchableOpacity onPress={() => {}}>
              <Image style={styles.toolBtnImg} resizeMode="contain" source={require('../../../assets/images/region_manage.png')}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  renderAgentIconView() {
    let promoter = this.props.promoter
    if (!promoter) {
      return <View/>
    }
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
    return (
      <View></View>
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
  let currentPromoterId = activePromoter(state)
  let promoter = getPromoterById(state, currentPromoterId)
  return {
    promoter,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
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
})