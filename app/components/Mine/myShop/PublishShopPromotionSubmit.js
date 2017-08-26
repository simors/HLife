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
  TextInput,
  Modal
} from 'react-native'
import ToolBarContent from '../../shop/ShopCommentReply/ToolBarContent'
import KeyboardAwareToolBar from '../../common/KeyboardAwareToolBar'
import {isUserLogined, activeUserInfo,activeUserId} from '../../../selector/authSelector'
import {selectShopPromotionDayPay,selectOpenGoodPromotion} from '../../../selector/shopSelector'
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
import {PUBLISH_PROMOTION} from '../../../constants/appConfig'

import Symbol from 'es6-symbol'
import {submitFormData, submitInputData, INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {fetchShopAnnouncements,submitShopGoodPromotion,fetchShopPromotionDayPay} from '../../../action/shopAction'
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
      showPayModal: false,
    }
    this.replyInput = null

  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=> {
      this.props.fetchShopPromotionDayPay()
    })
  }

  componentWillReceiveProps(nextProps) {

  }

  renderSubmitButton() {
    return(
      <TouchableOpacity onPress={()=>{this.onButtonPress()}}>
      <View style={styles.submitBtn}>
        <Text style={styles.submitBtnText}>确认发布</Text>
      </View>
        </TouchableOpacity>
    )

  }

  onButtonPress(){
    if(this.props.proNum&&this.props.proNum>0){
      Actions.PAYMENT({
        title: '商家活动支付',
        price: this.props.sumPay ,
        metadata: {
          'fromUser': this.props.currentUser,
          'toUser': 'platform',
          'dealType': PUBLISH_PROMOTION
        },
        subject: '购买汇邻优店活动费用',
        paySuccessJumpScene: 'MY_SHOP_INDEX',
        paySuccessJumpSceneParams: {},
        payErrorJumpBack: true,
        paySuccess:()=>{
          let payload = {
            shopId: this.props.shopId,
            abstract: this.props.abstract,
            startDate: new Date(this.props.startDate.replace(/-/g,'/')),
            endDate: new Date(this.props.endDate.replace(/-/g,'/')),
            goodId: this.props.good.id,
            type: this.props.type.type,
            price: this.props.price,
            typeId: this.props.type.id,
            typeDes: this.props.type.typeDesc,
            geo:this.props.geo,
            status: 1,
            success:()=>{
              this.props.inputFormOnDestroy({formKey:shopPromotionForm})
            },
            error:(err)=>{Toast.show(err.message)}
          }
          this.props.submitShopGoodPromotion(payload)        }
      })
    }else{
      let payload = {
        shopId: this.props.shopId,
        abstract: this.props.abstract,
        startDate: new Date(this.props.startDate.replace(/-/g,'/')),
        endDate: new Date(this.props.endDate.replace(/-/g,'/')),
        goodId: this.props.good.id,
        type: this.props.type.type,
        price: this.props.price,
        typeId: this.props.type.id,
        typeDes: this.props.type.typeDesc,
        geo:this.props.geo,
        status: 1,
        success:()=>{
          this.props.inputFormOnDestroy({formKey:shopPromotionForm})
          Toast.show('提交成功', {
            duration: 1500,
            onHidden: () =>{
              // Actions.MY_SHOP_INDEX()
              Actions.popTo('MY_SHOP_INDEX')
            }
          })
        },
        error:(err)=>{Toast.show(err.message)}
      }
      this.props.submitShopGoodPromotion(payload)
    }


  }

  renderPaymentModal() {
    return (
      <View>
        <Modal
          visible={this.state.showPayModal}
          transparent={true}
          animationType='fade'
          onRequestClose={()=> {
            this.setState({showPayModal: false})
          }}
        >
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View style={{backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center'}}>
              <View style={{paddingBottom: normalizeH(20), paddingTop: normalizeH(20)}}>
                <Text style={{fontSize: em(20), color: '#5A5A5A', fontWeight: 'bold'}}>设置购买数量</Text>
              </View>
              <View style={{paddingBottom: normalizeH(15), flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: em(17), color: THEME.base.mainColor, paddingRight: 8}}>数量：</Text>
                <TextInput
                  placeholder='输入数量'
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => this.setState({buyAmount: text})}
                  value={this.state.buyAmount}
                  keyboardType="numeric"
                  maxLength={6}
                  style={{
                    height: normalizeH(42),
                    fontSize: em(17),
                    textAlignVertical: 'center',
                    textAlign: 'right',
                    borderColor: '#0f0f0f',
                    width: normalizeW(80),
                    paddingRight: normalizeW(15),
                  }}
                />
                <Text style={{fontSize: em(17), color: '#5A5A5A', paddingLeft: 8}}>份</Text>
              </View>
              <View style={{
                width: PAGE_WIDTH - 100,
                height: normalizeH(50),
                padding: 0,
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 1,
                borderColor: '#F5F5F5'
              }}>
                <View style={{flex: 1, borderRightWidth: 1, borderColor: '#F5F5F5'}}>
                  <TouchableOpacity
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                    onPress={() => this.setState({showPayModal: false})}>
                    <Text style={{fontSize: em(17), color: '#5A5A5A'}}>取消</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                    onPress={() => this.onPaymentPress()}>
                    <Text style={{fontSize: em(17), color: THEME.base.mainColor}}>确定</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  onPaymentPress() {
    this.setState({showPayModal: false})
    let amount = this.state.buyAmount
    if (Math.floor(amount) != amount) {
      Toast.show('购买数量只能是整数')
      return
    }

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
              <Text style={styles.showInfoText}>{this.props.proNum&&this.props.proNum>0?this.props.dayPay +'元/天  '+ '(总计'+this.props.sumPay+'元)':0+'元'}</Text>
            </View>

            <View style={styles.showInfoWrap}>
              <Text style={styles.showInfoAbs}>活动说明</Text>
              <Text style={styles.showInfoText}>{this.props.abstract}</Text>
            </View>
          </KeyboardAwareScrollView>
        </View>
        {/*{this.renderPaymentModal()}*/}
        {this.renderSubmitButton()}

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  let currentUser = activeUserId(state)
  const isLogin = isUserLogined(state)
  let dayPay = selectShopPromotionDayPay(state)
  let openPromotionList = selectOpenGoodPromotion(state)
  let proNum = openPromotionList.length
  console.log('proNum=======>',proNum)
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
    countDays: countDays,
    dayPay: dayPay,
    currentUser: currentUser,
    proNum: proNum,
    sumPay: dayPay*countDays,
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
  fetchShopPromotionDayPay
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
    marginBottom: normalizeH(50)
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
    position:'absolute',
    left:0,
    bottom:0,
    backgroundColor: '#FF7819',
    height: normalizeH(50),
    width: PAGE_WIDTH,
    marginTop: normalizeH(32),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
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