/**
 * Created by yangyang on 2017/8/17.
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
import {fetchUserShopOrders} from '../../../action/shopAction'
import {activeUserId} from '../../../selector/authSelector'
import {selectUserOrders} from '../../../selector/shopSelector'
import {ORDER_STATUS} from '../../../constants/appConfig'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class UserOrdersViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabType: 0,
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchUserShopOrders({
        more: false,
        buyerId: this.props.currentUserId,
        orderStatus: undefined,
        limit: 10,
      })
    })
  }

  toggleTab(type) {
    this.setState({tabType: type}, ()=> {
      if (0 == type) {

      } else if (1 == type) {

      } else if (2 == type) {

      }
    })
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
            width: normalizeW(100),
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
            width: normalizeW(100),
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
            >待收货</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          onPress={()=> {
            this.toggleTab(2)
          }}>
          <View style={[{
            width: normalizeW(100),
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
          title="我的订单"
        />
        <View style={styles.body}>
          {this.renderTabBar()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUserId = activeUserId(state)
  let userOrders = selectUserOrders(state, currentUserId)
  console.log('userOrders:', userOrders)
  return {
    currentUserId: currentUserId,
    userOrders: userOrders,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserShopOrders
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UserOrdersViewer)

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