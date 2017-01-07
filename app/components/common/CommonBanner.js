/**
 * Created by zachary on 2016/12/16.
 */
import React, {Component} from 'react'
import {
  View
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Banner from './Banner'
import * as Toast from './Toast'

export default class CommonBanner extends Component {

  constructor(props) {
    super(props)
    this.defaultIndex = 0
  }

  clickListener(index, banners) {
    let banner = banners[index]
    let actionType = banner.actionType
    let action = banner.action
    let title = banner.title
    if(actionType == 'link') {
      let payload = {
        url: action,
        showHeader: !!title,
        headerTitle: title
      }
      return (
        Actions.COMMON_WEB_VIEW(payload)
      )
    }else if(actionType == 'toast') {
      Toast.show(action)
    }else if(actionType == 'action') {
      Actions[action]()
    }
  }

  onMomentumScrollEnd(event, state) {
    this.defaultIndex = state.index
  }

  render() {
    return(
      <View style={{flex: 1}}>
        <Banner
          banners={this.props.banners}
          hideTitle={true}
          defaultIndex={this.defaultIndex}
          onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
          intent={this.clickListener.bind(this)}
          useScrollView={true}
        />
      </View>
    )
  }
}