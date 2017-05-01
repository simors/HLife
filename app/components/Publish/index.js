/**
 * Created by yangyang on 2017/3/8.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  StyleSheet,
  StatusBar,
  NativeModules,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../constants/themes/theme1'
import * as authSelector from '../../selector/authSelector'
import {selectShopPromotionMaxNum, selectUserOwnedShopInfo} from '../../selector/shopSelector'
import uuid from 'react-native-uuid'
import * as Toast from '../common/Toast'
import Popup from '@zzzkk2009/react-native-popup'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class Publish extends Component {
  constructor(props) {
    super(props)
    this.state = {
      order_no: undefined,
    }
  }

  publishShopActivity() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    let userOwnedShopInfo = this.props.userOwnedShopInfo
    if(userOwnedShopInfo.status == 1) {
      if(this.props.isExceededShopPromotionMaxNum){
        Popup.confirm({
            title: '店铺活动',
            content: '您的店铺活动已达最大数量,去管理店铺活动？',
            ok: {
              text: '确认',
              style: {color: '#FF7819'},
              callback: ()=>{
                // console.log('ok')
                Actions.MY_SHOP_PROMOTION_MANAGE_INDEX()
              }
            },
            cancel: {
              text: '取消',
              callback: ()=>{
                // console.log('cancel')
              }
            }
          })
      }else{
        Actions.PUBLISH_SHOP_PROMOTION()
      }
    }else{
      Toast.show('您的店铺目前处于异常状态，请联系客服')
    }
    
  }

  render() {
    return (
      <View style={styles.container} >
        {/*<StatusBar barStyle="dark-content"/>*/}
        <View style={styles.body}>
          <View style={styles.logo}>
            <Image
              resizeMode="contain"
              style={{width: normalizeW(181), height: normalizeH(181), paddingBottom: normalizeH(20)}}
              source={require('../../assets/images/icon_add.png')}/>
            <Image source={require('../../assets/images/font_faxian.png')}/>
          </View>
          <View>
            <View style={styles.services}>
              <TouchableOpacity style={styles.item} onPress={() => {this.props.isUserLogined? Actions.PUBLISH_TOPIC() : Actions.LOGIN()}}>
                <Image
                  resizeMode="contain"
                  style={{width: normalizeW(60), height: normalizeH(60)}}
                  source={require('../../assets/images/publish_topic.png')}
                />
                <Text style={styles.serviceText}>发布话题</Text>
              </TouchableOpacity >
              <TouchableOpacity style={styles.item} onPress={() => {this.publishShopActivity()}}>
                <Image
                  resizeMode="contain"
                  style={{width: normalizeW(60), height: normalizeH(60)}}
                  source={require('../../assets/images/publish_activity.png')}
                />
                <Text style={styles.serviceText}>店铺活动</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.closeView}>
              <TouchableOpacity style={styles.close} onPress={() => Actions.pop()}>
                <Image
                  source={require('../../assets/images/add_close.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)

  const shopPromotionMaxNum = selectShopPromotionMaxNum(state)
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)

  let isExceededShopPromotionMaxNum = false
  let containedPromotionsNum = 0
  if(userOwnedShopInfo && userOwnedShopInfo.containedPromotions) {
    containedPromotionsNum = userOwnedShopInfo.containedPromotions.length
  }

  if(containedPromotionsNum >= shopPromotionMaxNum) {
    isExceededShopPromotionMaxNum = true
  }

  return {
    isUserLogined: isUserLogined,
    isExceededShopPromotionMaxNum: isExceededShopPromotionMaxNum,
    userOwnedShopInfo: userOwnedShopInfo
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Publish)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalizeH(20),
  },
  logo: {
    marginTop: normalizeH(85),
    alignItems: 'center',
  },
  services: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(170,170,170,0.2)',
    borderBottomColor: 'rgba(250,250,250,1)',
    width: PAGE_WIDTH,
  },
  serviceText: {
    paddingTop: normalizeH(15),
    paddingBottom: normalizeH(66),
    fontSize: em(17),
    color: '#5A5A5A'
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingTop: normalizeH(34)
  },
  close: {
    flex: 1,
    alignSelf: 'center',
    padding: normalizeH(12),
  },
  closeView: {
    height: normalizeH(60),
  },
})