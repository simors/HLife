/**
 * Created by zachary on 2016/12/9.
 */
import React, {
  PropTypes,
  Component,
} from 'react'
import {
  Text,
  Image,
  View,
  StyleSheet,
	TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native'
import {connect} from 'react-redux'
import THEME from '../../constants/themes/theme1'
import {isUserLogined, getUserIdentity, activeUserId} from '../../selector/authSelector'
import {selectShopPromotionMaxNum, selectUserOwnedShopInfo} from '../../selector/shopSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class TabIcon extends Component {
  render() {
    return (
      <View>
        {this.publish(
          this.props.title,
          this.props.selected,
          this.props.number,
          this.props.onPress,
          this.props.isLogin,
          this.props.identity,
          this.props.isExceededShopPromotionMaxNum,
          this.props.shopPayment,
          this.props.shopInfoComplete
        )}
      </View>
    )
  }

  publish=(title, selected, index, onPressed, isLogin, identity, isExceededShopPromotionMaxNum, shopPayment, shopInfoComplete) =>{
    if (index == 2) {
      return (
        <TouchableWithoutFeedback onPress={()=> {
          if (onPressed) {
            onPressed({isLogin: isLogin, index: index, identity: identity, isExceededShopPromotionMaxNum: isExceededShopPromotionMaxNum, shopPayment: shopPayment, shopInfoComplete: shopInfoComplete})
          }
        }}>
          <View style={[styles.container, {backgroundColor: THEME.base.mainColor}]}>
            {this.getImage(index, selected)}
            <Text style={{color:'#FFF', fontSize: em(10), marginTop: 4}}>
              {title}
            </Text>
            <View style={styles.topLine}/>
            <View style={styles.topLine}/>
          </View>
        </TouchableWithoutFeedback>
      )
    }
    return (
      <TouchableWithoutFeedback onPress={()=> {
        if (onPressed) {
          onPressed({isLogin: isLogin, index: index})
        }
      }}>
        <View style={styles.container}>
          {this.getImage(index, selected)}
          {this.getTitle(title, selected)}
          <View style={styles.topLine}/>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  getTitle=(title, selected) =>{
    return (
      <Text
        style={{color: selected ? THEME.base.mainColor : '#929292', fontSize: em(10), marginTop: 4}}
      >
        {title}
      </Text>
    )
  }

  getImage=(index, selected)=> {
    let imageSource = undefined
    switch (index) {
      case 0:
        imageSource = selected ? require("../../assets/images/home_select.png"): require("../../assets/images/home_unselect.png")
        break

      case 1:
        imageSource = selected ? require("../../assets/images/shop_select.png"): require("../../assets/images/shop_un.png")
        break

      case 2:
        imageSource = require("../../assets/images/publish_24.png")
        break

      case 3:
        imageSource = selected ? require("../../assets/images/topic_select.png"): require("../../assets/images/topic_un.png")
        break

      case 4:
        imageSource = selected ? require("../../assets/images/mine_select.png"): require("../../assets/images/mine_un.png")
        break
      default:
    }

    return (
      <View>
        <Image source={imageSource} />
        {this.renderRedDot(index)}
      </View>
    )
  }

  renderRedDot = (index) => {
    switch (index) {
      case 0:
        return <View />
      case 1:
        return <View />
      case 2:
        return <View />
      case 3:
        return <View />
      default:
    }
  }
}

const mapStateToProps = (state) => {
  let newProps = {}
  const isLogin = isUserLogined(state)
  const identity = getUserIdentity(state, activeUserId(state))
  newProps.isLogin = isLogin
  newProps.identity = identity

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
  newProps.isExceededShopPromotionMaxNum = isExceededShopPromotionMaxNum
  newProps.shopPayment = userOwnedShopInfo.payment
  newProps.shopInfoComplete = userOwnedShopInfo.coverUrl ? true : false

  return newProps
}

export default connect(mapStateToProps, null)(TabIcon)



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    height: 50,
    width: PAGE_WIDTH / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: PAGE_WIDTH / 5,
    height: 0.5,
    backgroundColor: '#ededed',
  },
  redDotStyle: {
    position:'absolute',
    top:-1,
    right:-7,
    width:10,
    height:10,
    borderRadius:5,
    backgroundColor:'#FD5F5F'
  }
})
