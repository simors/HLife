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




class PublishShopPromotionSubmit extends Component {
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
          <Text style={styles.submitBtnText}>下一步</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }


  onButtonPress(){
    let payload = {
      shopId: this.props.shopId,
      abstract: this.props.abstract,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      goodId: this.props.good.id,
      type: this.props.type.type,
      price: this.props.price,
      typeId: this.props.type.id,
      typeDes: this.props.type.typeDesc,
      status: 1,
      success:()=>{
        Actions.MY_SHOP_PROMOTION_MANAGE_INDEX()
        this.props.inputFormOnDestroy({formKey:shopPromotionForm})
      },
      error:(err)=>{Toast.show(err.message)}
    }
    this.props.submitShopGoodPromotion(payload)
  }
  renderGoodShow(){
    if(this.props.good){
      return(
        <View style={styles.channelWrap}>
          <View style={styles.defaultImageStyles}>
            <CachedImage mutable style={styles.defaultImageStyles}
                         source={this.props.good.coverPhoto ? {uri: getThumbUrl(this.props.good.coverPhoto, normalizeW(169), normalizeH(169))} : require("../../../assets/images/default_goods_cover.png")}/>
          </View>
          {/*<Image style={styles.defaultImageStyles} source={{uri: value.coverPhoto}}/>*/}
          <Text style={ styles.channelText} numberOfLines={1}>{this.props.good.goodsName}</Text>
          <Text style={ styles.channelPrice} numberOfLines={1}>{'¥' + this.props.good.price}</Text>
        </View>
      )
    }else{
      return null
    }

  }
  render() {

    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="活动确认"
        />
        <View style={styles.body}>
          <KeyboardAwareScrollView>
            {this.renderGoodShow()}
            <View style={styles.showInfoWrap}>
                <Text style={styles.showInfoAbs}>活动类型：</Text>
                <Text style={styles.showInfoText}>{this.props.type.type}</Text>
            </View>

            <View style={styles.showInfoWrap}>
              <Text style={styles.showInfoAbs}>商品活动价格：</Text>
              <Text style={styles.showInfoText}>{this.props.price+'元'}</Text>
            </View>

            <View style={styles.showInfoWrap}>
            <Text style={styles.showInfoAbs}>活动有效期：</Text>
            <Text style={styles.showInfoText}>{this.props.startDate+' 至'}</Text>
          </View>

            <View style={styles.showInfoWrap}>
              <Text style={styles.showInfoAbs}></Text>
              <Text style={styles.showInfoText}>{this.props.endDate}</Text>
            </View>

            <View style={styles.showInfoWrap}>
            <Text style={styles.showInfoAbs}>活动有效时长</Text>
            <Text style={styles.showInfoText}>{this.props.countDays +'天'}</Text>
          </View>

            <View style={styles.showInfoWrap}>
              <Text style={styles.showInfoAbs}>活动费用</Text>
              <Text style={styles.showInfoText}>{0 +'元／天'}</Text>
            </View>

            <View style={styles.showInfoWrap}>
              <Text style={styles.showInfoAbs}>活动说明</Text>
              <Text style={styles.showInfoText}>{this.props.abstract}</Text>
            </View>

            {this.renderSubmitButton()}
          </KeyboardAwareScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  const isLogin = isUserLogined(state)

  let formData = getInputFormData(state,shopPromotionForm)
  // console.log('formData=====>',formData)
  let abstract = formData&&formData.abstractInput?formData.abstractInput.text:''
  let startDate = formData&&formData.chooseStartDateInput?formData.chooseStartDateInput.text:''
  let endDate = formData&&formData.chooseEndDateInput?formData.chooseEndDateInput.text:''
  let goodId = formData&&formData.chooseGoodInput?formData.chooseGoodInput.text:''
  let good = selectGoodsById(state,userOwnedShopInfo.id,goodId)
  let type = formData&&formData.chooseTypeInput?formData.chooseTypeInput:{}
  let price = formData&&formData.promotionPriceInput?formData.promotionPriceInput.text:''
  let countDays = DateDiff(startDate,endDate)
  return {
    shopId: userOwnedShopInfo.id,
    geo: userOwnedShopInfo.geo,
    isLogin: isLogin,
    abstract: abstract,
    startDate: startDate,
    endDate: endDate,
    good: good,
    type: type,
    price: price,
    countDays: countDays
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitShopGoodPromotion,
  submitInputData,
  fetchShopAnnouncements,
  initInputForm,
  inputFormOnDestroy,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishShopPromotionSubmit)

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
    backgroundColor: '#FF7819',
    height: normalizeH(50),
    width: normalizeW(345),
    marginLeft: normalizeW(15),
    marginTop: normalizeH(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: em(18),
    letterSpacing: -em(0.45)
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