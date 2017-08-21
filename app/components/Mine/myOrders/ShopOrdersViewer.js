/**
 * Created by yangyang on 2017/8/20.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import {fetchShopperOrders} from '../../../action/shopAction'
import {activeUserId} from '../../../selector/authSelector'
import ShopOrderListView from './ShopOrderListView'
import {selectUserOwnedShopInfo} from '../../../selector/shopSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopOrdersViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabType: 0,
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchShopperOrders({
        more: false,
        vendorId: this.props.vendor.id,
        type: 'new',
        limit: 10,
      })
      this.props.fetchShopperOrders({
        more: false,
        vendorId: this.props.vendor.id,
        type: 'deliver',
        limit: 10,
      })
      this.props.fetchShopperOrders({
        more: false,
        vendorId: this.props.vendor.id,
        type: 'finished',
        limit: 10,
      })
    })
  }

  toggleTab(type) {
    this.setState({tabType: type})
  }

  renderTabBar() {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          onPress={()=> {
            this.toggleTab(0)
          }}>
          <View style={[{
            width: normalizeW(69),
            height: normalizeH(44),
            justifyContent: 'flex-end',
            alignItems: 'center'
          },
            this.state.tabType == 0 ?
            {
              borderBottomWidth: 3,
              borderColor: THEME.base.mainColor
            } : {}]}>
            <Text style={[{fontSize: em(15), paddingBottom: normalizeH(8)},
              this.state.tabType == 0 ?
              {
                color: THEME.base.mainColor,
                fontWeight: 'bold',
              } : {color: '#4A4A4A'}]}
            >全部</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          onPress={()=> {
            this.toggleTab(1)
          }}>
          <View style={[{
            width: normalizeW(69),
            height: normalizeH(44),
            justifyContent: 'flex-end',
            alignItems: 'center'
          },
            this.state.tabType == 1 ?
            {
              borderBottomWidth: 3,
              borderColor: THEME.base.mainColor
            } : {}]}>
            <Text style={[{fontSize: em(15), paddingBottom: normalizeH(8)},
              this.state.tabType == 1 ?
              {
                color: THEME.base.mainColor,
                fontWeight: 'bold',
              } : {color: '#4A4A4A'}]}
            >新订单</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          onPress={()=> {
            this.toggleTab(2)
          }}>
          <View style={[{
            width: normalizeW(69),
            height: normalizeH(44),
            justifyContent: 'flex-end',
            alignItems: 'center'
          },
            this.state.tabType == 2 ?
            {
              borderBottomWidth: 3,
              borderColor: THEME.base.mainColor
            } : {}]}>
            <Text style={[{fontSize: em(15), paddingBottom: normalizeH(8)},
              this.state.tabType == 2 ?
              {
                color: THEME.base.mainColor,
                fontWeight: 'bold',
              } : {color: '#4A4A4A'}]}
            >已发货</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          onPress={()=> {
            this.toggleTab(3)
          }}>
          <View style={[{
            width: normalizeW(69),
            height: normalizeH(44),
            justifyContent: 'flex-end',
            alignItems: 'center'
          },
            this.state.tabType == 3 ?
            {
              borderBottomWidth: 3,
              borderColor: THEME.base.mainColor
            } : {}]}>
            <Text style={[{fontSize: em(15), paddingBottom: normalizeH(8)},
              this.state.tabType == 3 ?
              {
                color: THEME.base.mainColor,
                fontWeight: 'bold',
              } : {color: '#4A4A4A'}]}
            >已完成</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="订单管理"
        />
        <View style={styles.body}>
          {this.renderTabBar()}
          <ShopOrderListView vendorId={this.props.vendor.id}
                             type={this.state.tabType == 0 ? 'all' :
                               this.state.tabType == 1 ? 'new' :
                                 this.state.tabType == 2 ? 'deliver' : 'finished'} />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUserId = activeUserId(state)
  let vendor = selectUserOwnedShopInfo(state)
  return {
    currentUserId,
    vendor,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopperOrders
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopOrdersViewer)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: normalizeH(64),
  },
  tabBar: {
    height: normalizeH(44),
    width: PAGE_WIDTH,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
  },
})