/**
 * Created by lilu on 2017/8/12.
 */

import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  InteractionManager,
  ScrollView,
  StatusBar,
  Keyboard,
  BackAndroid,
  ListView,
  Modal,
  TextInput,
  Animated,
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import ViewPager from '../common/ViewPager'
import Gallery from 'react-native-gallery'
import {getThumbUrl} from '../../util/ImageUtil'

import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import ChatroomShopGoodCustiomTopView from './ChatroomShopGoodCustiomTopView'
import {fetchUsers} from '../../action/authActions'
import * as AVUtils from '../../util/AVUtils'
import {
  selectUserOwnedShopInfo,
  selectShopDetail,
} from '../../selector/shopSelector'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as configSelector from '../../selector/configSelector'
import GoodAlbumShow from './GoodAlbumShow'
import * as authSelector from '../../selector/authSelector'
import * as Toast from '../common/Toast'
import {DEFAULT_SHARE_DOMAIN} from '../../util/global'
import {CachedImage} from "react-native-img-cache"
import ArticleViewer from '../common/Input/ArticleViewer'
import {BUY_GOODS} from '../../constants/appConfig'
import {LazyloadScrollView} from '../common/Lazyload'
import Svg from '../common/Svgs'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class GoodShow extends Component {
  constructor(props) {
    super(props)
  }


  componentDidMount() {

  }

  renderLastGood() {
    return (
      <View style={styles.wrapBox}>
        <View style={[styles.channelWrap, {width: normalizeW(348)}]}>
          <View style={[styles.defaultImageStyles, {width: normalizeW(348)}]}>
            {this.props.goodInfo.promotionId && this.props.goodInfo.promotionType ? <View style={styles.typeWrap}>
              <Text style={styles.typeText}>{this.props.goodInfo.promotionType}</Text>
            </View> : null}
            <CachedImage mutable style={[styles.defaultImageStyles, {width: normalizeW(348)}]}
                         source={this.props.goodInfo.coverPhoto ? {uri: getThumbUrl(this.props.goodInfo.coverPhoto, normalizeW(348), normalizeH(169))} : require("../../assets/images/default_goods_cover.png")}/>
          </View>
          {/*<Image style={styles.defaultImageStyles} source={{uri: value.coverPhoto}}/>*/}
          <Text style={ styles.channelText} numberOfLines={1}>{this.props.goodInfo.goodsName}</Text>
          <Text style={ styles.channelPrice}
                numberOfLines={1}>{'¥' + (this.props.goodInfo.promotionId && this.props.goodInfo.promotionPrice ? this.props.goodInfo.promotionPrice : this.props.goodInfo.price)}</Text>

        </View>
      </View>
    )
  }

  renderCommonGood() {
    if (this.props.goodInfo) {
      return (
        <View style={styles.wrapBox} key={this.props.key}>
          <View style={styles.channelWrap}>
            {this.props.goodInfo.promotionId && this.props.goodInfo.promotionType ? <View style={styles.typeWrap}>
              <Text style={styles.typeText}>{this.props.goodInfo.promotionType}</Text>
            </View> : null}
            <CachedImage mutable style={styles.defaultImageStyles}
                         source={this.props.goodInfo.coverPhoto ? {uri: getThumbUrl(this.props.goodInfo.coverPhoto, normalizeW(169), normalizeH(169))} : require("../../assets/images/default_goods_cover.png")}/>
            {/*<Image style={styles.defaultImageStyles} source={{uri: value.coverPhoto}}/>*/}
            <Text style={ styles.channelText} numberOfLines={1}>{this.props.goodInfo.goodsName}</Text>
            <Text style={ styles.channelPrice}
                  numberOfLines={1}>{'¥' + (this.props.goodInfo.promotionId && this.props.goodInfo.promotionPrice ? this.props.goodInfo.promotionPrice : this.props.goodInfo.price)}</Text>

          </View>
        </View>
      )
    } else {
      return null
    }
  }

  renderGoodShow() {
    if (this.props.showType && this.props.showType == 'lastGood') {
      return (this.renderLastGood())
    } else {
      return (      this.renderCommonGood()
      )
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.renderGoodShow()}
      </View>
    )
  }

}


const styles = StyleSheet.create({
  wrapBox: {
    flex: 1,
    alignItems: 'center',
  },
  defaultImageStyles: {
    height: normalizeH(169),
    width: normalizeW(169),
  },
  channelWrap: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    height: normalizeH(224),
    width: normalizeW(169),
    overflow: 'hidden',
    borderWidth: normalizeBorder(0),
    backgroundColor: '#F5F5F5'
  },
  channelText: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: normalizeW(10),

    marginTop: normalizeH(10),
    width: normalizeW(144),
    height: normalizeH(12),
    fontSize: em(13),
    alignItems: 'flex-start',
    color: '#5A5A5A'
  },
  channelPrice: {
    flex: 1,
    marginBottom: normalizeH(6),
    marginLeft: normalizeW(10),
    width: normalizeW(144),
    height: 15,
    fontSize: em(17),
    color: '#00BE96'
  },
  showInfoWrap: {
    flex: 1,
    flexDirection: 'row',
    marginTop: normalizeH(10),
    width: normalizeW(345)
  },
  showInfoAbs: {
    width: normalizeW(110),
    // marginLeft:normalizeW(15),
    fontSize: em(15),
    color: 'rgba(0,0,0,0.5)',
    alignItems: 'flex-start'
  },
  showTitleText: {
    fontSize: em(12),
    color: '#000000',
    fontFamily: '.PingFangSC-Semibold'
  },
  showInfoText: {
    fontFamily: '.PingFangSC-Regular',
    marginLeft: normalizeW(15),
    fontSize: em(15),
    color: 'rgba(0,0,0,0.50)'
  },
  typeWrap: {
    position: 'absolute',
    top: 15,
    left: -30,
    width: normalizeH(120),
    height: normalizeH(30),
    transform: [{rotate: '-45deg'}],
    backgroundColor: '#FF9D4E',
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  typeText: {
    fontSize: em(15),
    color: '#FFFFFF',
    fontFamily: '.PingFangSC-Semibold',

  }
})