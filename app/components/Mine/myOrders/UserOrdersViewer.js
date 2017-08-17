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
import {fetchUserShopOrders} from '../../../action/shopAction'

class UserOrdersViewer extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchUserShopOrders({
        more: false,
        buyerId: '585892e1ac502e006704ffe1',
        orderStatus: [1,2],
        limit: 10,
      })
    })
  }

  render() {
    return (
      <View></View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
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