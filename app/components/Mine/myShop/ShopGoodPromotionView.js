/**
 * Created by lilu on 2017/8/5.
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager,
  TextInput
} from 'react-native'
import ToolBarContent from '../../shop/ShopCommentReply/ToolBarContent'
import KeyboardAwareToolBar from '../../common/KeyboardAwareToolBar'
import {isUserLogined, activeUserInfo} from '../../../selector/authSelector'
import {DateDiff} from '../../../util/dateUtils'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Svg from '../../common/Svgs'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import ImageInput from '../../common/Input/ImageInput'
import ImageGroupViewer from '../../common/Input/ImageGroupViewer'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as Toast from '../../common/Toast'
import TextAreaInput from '../../common/Input/TextAreaInput'
import {getThumbUrl} from '../../../util/ImageUtil'
import {CachedImage} from "react-native-img-cache"

import Symbol from 'es6-symbol'
import {submitFormData, submitInputData, INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {fetchShopAnnouncements,submitShopGoodPromotion} from '../../../action/shopAction'
import MultilineText from '../../common/Input/MultilineText'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import MyShopGoodListForChoose from './MyShopGoodListForChoose'
import DateTimeInput from '../../common/Input/DateTimeInput'
import {
  selectUserOwnedShopInfo,
  selectGoodsById,
} from '../../../selector/shopSelector'
import {initInputForm, inputFormUpdate,inputFormOnDestroy} from '../../../action/inputFormActions'
import {getInputData,getInputFormData} from '../../../selector/inputFormSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let shopPromotionForm = 'shopPromotionForm'




class ShopGoodPromotionView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shouldUploadImage: false,
      chooseTypeId: undefined,
      hideBottomView: false,
    }
    this.replyInput = null

  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=> {

    })
  }

  componentWillReceiveProps(nextProps) {

  }

  renderSubmitButton() {
    return (
      <TouchableWithoutFeedback onPress={()=> {
        this.onButtonPress()
      }}>
        <View style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>关闭</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }


  onButtonPress(){

  }

  renderGoodShow(){
    if(this.props.promotion.goodId){
      return(
        <View style={styles.channelWrap}>
          <View style={styles.defaultImageStyles}>
            <CachedImage mutable style={styles.defaultImageStyles}
                         source={this.props.promotion.coverPhoto ? {uri: getThumbUrl(this.props.promotion.coverPhoto, normalizeW(169), normalizeH(169))} : require("../../../assets/images/default_goods_cover.png")}/>
          </View>
          {/*<Image style={styles.defaultImageStyles} source={{uri: value.coverPhoto}}/>*/}
          <Text style={ styles.channelText} numberOfLines={1}>{this.props.promotion.goodsName}</Text>
          <Text style={ styles.channelPrice} numberOfLines={1}>{'¥' + this.props.promotion.promotionPrice}</Text>
        </View>
      )
    }else{
      return null
    }

  }
  render() {

    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <KeyboardAwareScrollView>
            {this.renderGoodShow()}
            <View style={styles.showInfoWrap}>
              <Text style={styles.showInfoAbs}>活动类型：</Text>
              <Text style={styles.showInfoText}>{this.props.promotion.type}</Text>
            </View>

            <View style={styles.showInfoWrap}>
              <Text style={styles.showInfoAbs}>商品活动价格：</Text>
              <Text style={styles.showInfoText}>{this.props.promotion.price+'元'}</Text>
            </View>

            <View style={styles.showInfoWrap}>
              <Text style={styles.showInfoAbs}>活动有效期：</Text>
            </View>
            <View style={styles.showInfoWrap}>
              <Text style={styles.showInfoText}>{this.props.promotion.startDate+' 至'}</Text>
              <Text style={styles.showInfoText}>{this.props.promotion.endDate}</Text>
            </View>
            <View style={styles.showInfoWrap}>
              <Text style={styles.showInfoAbs}>活动说明</Text>
              <Text style={styles.showInfoText}>{this.props.promotion.abstract}</Text>
            </View>
          </KeyboardAwareScrollView>
          {this.props.status=='clo'?null:this.renderSubmitButton()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopGoodPromotionView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green,
    paddingTop: normalizeH(20),
    height: normalizeH(64),
  },
  headerLeftStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  headerTitleStyle: {
    color: '#fff',
  },
  headerRightStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
  },
  scrollViewStyle: {
    flex: 1,
    width: PAGE_WIDTH,
  },
  bottomWrap: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  noticeTip: {
    marginLeft: normalizeW(12),
    fontSize: em(12),
    color: '#BEBEBE'
  },
  showTextBox: {
    paddingTop: normalizeH(15),
    paddingBottom: normalizeH(15)
  },
  showText: {
    fontSize: em(15),
    color: '#5A5A5A'
  },
  submitBtn: {
    backgroundColor: '#FFFFFF',
    height: normalizeH(40),
    width: normalizeW(169),
    marginTop: normalizeH(20),
    marginLeft: normalizeW(103),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:normalizeBorder(1),
    borderColor: '#FF7819'
  },
  submitBtnText: {
    color: '#FF7819',
    fontSize: em(17),
    letterSpacing: em(0.2)
  },
  chooseText:{
    fontSize: em(15),
    color: '#000000',
  },
  chooseDateWrap:{
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom:normalizeH(15)
  },
  chooseDateBox:{
    padding: normalizeH(10),
    paddingBottom: normalizeH(0),
    margin: normalizeW(15),
    flex: 1,
    borderWidth:normalizeBorder(1),
    borderRadius: em(3),
  },
  pickerStyle:{
    flex:1,
    width:normalizeW(200),
    height: normalizeH(42),
    marginLeft:normalizeW(5),
    backgroundColor: 'rgba(255,120,25,0.10)'
  },
  countDaysBox:{
    // marginTop: normalizeH(8),
    marginLeft: normalizeW(30),
    flexDirection: 'row',
    alignItems: 'center'
  },
  countDaysAbstract:{
    color: 'rgba(0,0,0,0.50)',
    fontSize: em(12),
  },
  countDaysText:{
    fontSize: em(15),
    color: '#FF7819',

  },
  inputBox: {
    justifyContent: 'center',
    alignItems: 'flex-start'
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
    marginTop: normalizeH(10),
    marginLeft: normalizeW(88),
    marginBottom: normalizeH(5),
    borderWidth:normalizeBorder(0),
    backgroundColor:'#F5F5F5'
  },
  channelText: {
    flex:1,
    flexDirection:'row',
    marginLeft:normalizeW(10),

    marginTop: normalizeH(10),
    width: normalizeW(144),
    height: normalizeH(12),
    fontSize: em(13),
    alignItems: 'flex-start',
    color: '#5A5A5A'
  },
  channelPrice: {
    flex:1,
    marginBottom: normalizeH(6),
    marginLeft:normalizeW(10),
    width: normalizeW(144),
    height: 15,
    fontSize: em(17),
    color: '#00BE96'
  },
  columnContainer: {
    backgroundColor: THEME.base.backgroundColor,

    flex: 1
  },
  showInfoWrap:{
    flex:1,
    flexDirection: 'row',
    marginTop: normalizeH(10)
  },
  showInfoAbs:{
    width:normalizeW(110),
    // marginLeft:normalizeW(15),
    fontSize: em(15),
    color: 'rgba(0,0,0,0.5)',
    alignItems: 'flex-start'
  },
  showInfoText:{
    fontSize: em(15),
    color: '#000000'
  }

})