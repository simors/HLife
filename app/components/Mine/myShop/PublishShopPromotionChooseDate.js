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
import {CachedImage} from "react-native-img-cache"
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
import Symbol from 'es6-symbol'
import {submitFormData, submitInputData, INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {fetchShopAnnouncements,} from '../../../action/shopAction'
import MultilineText from '../../common/Input/MultilineText'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import MyShopGoodListForChoose from './MyShopGoodListForChoose'
import DateTimeInput from '../../common/Input/DateTimeInput'
import {
  selectUserOwnedShopInfo,
  selectShopFollowers,
  selectShopFollowersTotalCount,
  selectSimilarShopList,
  selectShopDetail, selectShopList,
  selectGuessYouLikeShopList,
  selectLatestShopAnnouncemment,
  selectUserIsFollowShop,
  selectShopComments,
  selectShopCommentsTotalCount,
  selectUserIsUpedShop,
  selectGoodsList
} from '../../../selector/shopSelector'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'

const today = new Date()
const TODAY_DATE= (today.toISOString()).slice(0, 10)

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let shopPromotionForm = 'shopPromotionForm'
const chooseStartDateInput = {
  formKey: shopPromotionForm,
  stateKey: Symbol('chooseStartDateInput'),
  type: 'chooseStartDateInput',
}

const chooseEndDateInput = {
  formKey: shopPromotionForm,
  stateKey: Symbol('chooseEndDateInput'),
  type: 'chooseEndDateInput',
}


class PublishShopPromotionChooseDate extends Component {
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

  unChooseType(index){
    chooseTypeInput.data = {}
    this.props.inputFormUpdate(chooseTypeInput)
  }

  renderDatePicker(){
    return(
      <View style={styles.chooseDateBox}>
        <View style={styles.chooseDateWrap}>
          <Text style={styles.chooseText}>开始时间</Text>
          <DateTimeInput
            {...chooseStartDateInput}
            mode="datetime"
            PickerStyle={styles.pickerStyle}
            minDate={TODAY_DATE}
            maxDate='2100-10-10'
            is24Hour={true}
            format='YYYY-MM-DD HH:mm'
            date = {this.props.startDate}
            initValue={this.props.startDate}
        />

        </View>
        <View style={styles.chooseDateWrap}>
          <Text style={styles.chooseText}>结束时间</Text>
          <DateTimeInput
            {...chooseEndDateInput}
            mode="datetime"
            PickerStyle={styles.pickerStyle}
            minDate={this.props.startDate?this.props.startDate:undefined}
            maxDate='2100-10-10'
            format='YYYY-MM-DD HH:mm'
            is24Hour={true}
            date = {this.props.endDate}
            initValue={this.props.endDate}

          />
        </View>
      </View>
    )

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
    if(this.props.countDays){
      Actions.PUBLISH_SHOP_PROMOTION_ABSTRACT()
    }else{
      Toast.show('请选择起止日期')
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="发布活动"
        />
        <View style={styles.body}>
          <View style={styles.showTextBox}>
            <Text style={styles.showText}>选择活动时间</Text>
          </View>
          <KeyboardAwareScrollView>
            {this.renderDatePicker()}
            <View style={styles.countDaysBox}>
              <Text style={styles.countDaysAbstract}>有效活动时长</Text>
              <Text style={styles.countDaysText}>{this.props.countDays+'天'}</Text>

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
  let startDate = getInputData(state, chooseStartDateInput.formKey, chooseStartDateInput.stateKey)
  let endDate = getInputData(state, chooseEndDateInput.formKey, chooseEndDateInput.stateKey)
  let countDays = DateDiff(startDate.text,endDate.text)
  // console.log('countDays--->',countDays)
  console.log('startDate--->',startDate)
  console.log('countDays--->',countDays)
  return {
    shopId: userOwnedShopInfo.id,
    endDate: endDate.text,
    startDate: startDate.text,
    isLogin: isLogin,
    countDays: countDays
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitInputData,
  fetchShopAnnouncements,
  initInputForm,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishShopPromotionChooseDate)

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
    paddingRight: normalizeW(15)
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

  }
})