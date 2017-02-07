/**
 * Created by zachary on 2017/2/7.
 */
import React, {Component} from 'react'
import {
  View,
  Dimensions
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Banner2 from './Banner2'
import * as Toast from './Toast'

export default class CommonBanner2 extends Component {

  constructor(props) {
    super(props)
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

  render() {
    return(
      <View style={{flex: 1}}>
        <Banner2
          banners={this.props.banners}
          intent={this.clickListener.bind(this)}
          bulletsContainerStyle={{bottom:0,height:20}}
        />
      </View>
    )
  }
}