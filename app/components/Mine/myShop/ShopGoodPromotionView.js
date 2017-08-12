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
import GoodShow from '../../shop/GoodShow'

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
      let goodInfo={
        promotion:{
          promotionPrice:this.props.promotion.promotionPrice,
          type:this.props.promotion.type,
        },
        coverPhoto: this.props.promotion.coverPhoto,
        price: this.props.promotion.price,
        originalPrice: this.props.promotion.originalPrice,
        goodsName: this.props.promotion.goodName,
      }
      return(
        <View style={{flex: 1,width:normalizeW(345),height:normalizeH(264),paddingTop:normalizeH(15),paddingBottom: normalizeH(15),borderBottomWidth:normalizeBorder(1),borderBottomColor:'#F5F5F5'}}>
        <GoodShow
          goodInfo={goodInfo}
        />
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
              <Text style={styles.showTitleText}>活动有效期：</Text>
            </View>
            <View style={styles.showInfoWrap}>
              <Text style={[styles.showInfoText,{backgroundColor:'rgba(0,0,0,0.05)'}]}>{this.props.promotion.startDate+' 至'+this.props.promotion.endDate}</Text>
            </View>
            <View style={styles.showInfoWrap}>
              <Text style={styles.showTitleText}>活动说明</Text>
            </View>
            <View style={styles.showInfoWrap}>
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
    backgroundColor: '#FFFFFF'
  },
  body: {
    flex: 1,
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    alignItems: 'center',
    paddingBottom: normalizeH(20)
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
    // marginBottom: normalizeH(25),
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
  wrapBox:{
    paddingTop: normalizeH(15),
    paddingBottom: normalizeH(20),
    alignItems: 'center',
    borderBottomColor:'#F5F5F5',
    borderBottomWidth:normalizeBorder(1),
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
    marginTop: normalizeH(10),
    width:normalizeW(345)
  },
  showInfoAbs:{
    width:normalizeW(110),
    // marginLeft:normalizeW(15),
    fontSize: em(15),
    color: 'rgba(0,0,0,0.5)',
    alignItems: 'flex-start'
  },
  showTitleText:{
    fontSize: em(12),
    color: '#000000',
    fontFamily: '.PingFangSC-Semibold'
  },
  showInfoText:{
    fontFamily: '.PingFangSC-Regular',
    marginLeft: normalizeW(15),
    fontSize: em(15),
    color: 'rgba(0,0,0,0.50)'
  },
  typeWrap:{
    position: 'absolute',
    top:15,
    left: -30,
    width: normalizeH(120),
    height: normalizeH(30),
    transform:[{rotate:'-45deg'}],
    backgroundColor:'#FF9D4E',
    zIndex: 5,
    justifyContent:'center',
    alignItems:'center'
    },
  typeText:{
    fontSize:em(15),
    color:'#FFFFFF',
    fontFamily:'.PingFangSC-Semibold',

  }

})