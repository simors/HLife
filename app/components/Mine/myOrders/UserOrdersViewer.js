/**
 * Created by yangyang on 2017/8/17.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import {fetchUserShopOrders} from '../../../action/shopAction'
import {activeUserId} from '../../../selector/authSelector'
import {selectUserOrders} from '../../../selector/shopSelector'
import {ORDER_STATUS} from '../../../constants/appConfig'

class UserOrdersViewer extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchUserShopOrders({
        more: false,
        buyerId: this.props.currentUserId,
        orderStatus: [ORDER_STATUS.PAID_FINISHED],
        limit: 10,
      })
    })
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
})