/**
 * Created by lilu on 2017/8/4.
 */
/**
 * Created by zachary on 2017/1/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager,
  TextInput
} from 'react-native'
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
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {fetchShopAnnouncements, } from '../../../action/shopAction'
import MultilineText from '../../common/Input/MultilineText'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import MyShopGoodListForChoose from './MyShopGoodListForChoose'
import {selectUserOwnedShopInfo,
  selectShopFollowers,
  selectShopFollowersTotalCount,
  selectSimilarShopList,
  selectShopDetail,selectShopList,
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

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let shopPromotionForm = Symbol('shopPromotionForm')
let chooseGoodInput = {
  formKey: shopPromotionForm,
  stateKey: Symbol('chooseGoodInput'),
  type: 'chooseGoodInput',
  data: '',
}

let promotionPriceInput = {
  formKey: shopPromotionForm,
  stateKey: Symbol('promotionPriceInput'),
  type: 'promotionPriceInput',
  data: ''
}


class PublishShopAnnouncement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shouldUploadImage: false,
      chooseGoodId:undefined,
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  unChooseGood(goodInfo){
    // this.setState({
    //   chooseGoodId: undefined
    // })
     chooseGoodInput.data=undefined

    this.props.inputFormUpdate(chooseGoodInput)
    // this.props.inputFormUpdate()
    console.log('I  UN CHOOOSE=========?>',chooseGoodInput.data)
  }

  chooseGood(goodInfo){
    chooseGoodInput.data= {text: goodInfo.id}
    this.props.inputFormUpdate(chooseGoodInput)
    // this.setState({
    //   chooseGoodId: goodInfo.id
    // })
    console.log('I   CHOOOSE=========?>',chooseGoodInput.data)
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  onButtonPress() {
    Actions.PUBLISH_SHOP_PROMOTION_CHOOSE_GOOD()
  }

  renderNoGood(){
    return(
      <View>
        <Text style={styles.noGoodText}>暂无商品</Text>
        <View style={styles.addGoodBox}>
          <Svg size={normalizeH(32)} icon="click_add"/>
          <Text style={styles.addGoodText}>点击添加产品</Text>

        </View>
        <CachedImage source={require('../../../assets/images/background_shop_copy.png')}/>
      </View>
    )
  }

  renderGoodList(){
    return(
            <MyShopGoodListForChoose id={this.props.shopId} chooseGoodId={this.props.chooseGoodId} chooseGood={(goodInfo)=>{this.chooseGood(goodInfo)}} unChooseGood={(goodInfo)=>{this.unChooseGood(goodInfo)}}/>
    )
  }

  uploadImageCallback() {
    this.publishAnnouncement()
  }

  publishAnnouncement() {
    if(this.props.shopAnnouncementId) {
      this.props.submitFormData({
        formKey: commonForm,
        shopAnnouncementId: this.props.shopAnnouncementId,
        submitType: INPUT_FORM_SUBMIT_TYPE.UPDATE_ANNOUNCEMENT,
        success: ()=>{this.submitSuccessCallback(this, '更新成功')},
        error: (error)=>{this.submitErrorCallback(this, error.message || '更新失败')}
      })
    }else {
      this.props.submitFormData({
        formKey: commonForm,
        id: this.props.id,
        submitType: INPUT_FORM_SUBMIT_TYPE.PUBLISH_ANNOUNCEMENT,
        success: ()=>{this.submitSuccessCallback(this, '发布成功')},
        error: (error)=>{this.submitErrorCallback(this, error.message || '发布失败')}
      })
    }
  }

  submitSuccessCallback(context, message) {
    dismissKeyboard()
    context.props.fetchShopAnnouncements({
      id: context.props.id,
      isRefresh: true
    })
    Toast.show(message, {
      duration: 1000,
      onHidden: ()=>{
        Actions.pop()
      }
    })
  }

  submitErrorCallback(context, message) {
    Toast.show(message, {duration: 1000})
  }

  renderGoods(){
    return this.props.goodList&&this.props.goodList.length?this.renderGoodList():this.renderNoGood()
    // return this.renderNoGood()
  }
  render() {

    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="发布公告"
        />
        <View style={styles.body}>
          <View style={styles.showTextBox}>
            <Text style={styles.showText}>选择活动商品</Text>
          </View>
          <KeyboardAwareScrollView>
            {this.renderGoods()}
          </KeyboardAwareScrollView>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  let goodList = []
  if(userOwnedShopInfo.id) {
    goodList = selectGoodsList(state, userOwnedShopInfo.id, 1)
  }
  let chooseGoodId = getInputData(state,chooseGoodInput.formKey,chooseGoodInput.stateKey)
  // console.log('chooseGoodId=============>',chooseGoodId)
  let priceInput = getInputData(state,'shopPromotionForm','promotionPriceInput')

  return {
    goodList: goodList,
    shopId: userOwnedShopInfo.id,
    chooseGoodId: chooseGoodId.text,
    priceInput: priceInput.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitInputData,
  fetchShopAnnouncements,
  initInputForm,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishShopAnnouncement)

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
    paddingLeft:normalizeW(15),
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
  showTextBox:{
    paddingTop:normalizeH(15),
    paddingBottom: normalizeH(15)
  },
  showText:{
    fontSize:em(15),
    color:'#5A5A5A'
  },
  noGoodText:{
    position: 'absolute',
    left: normalizeW(91),
    top: normalizeH(52),
    fontFamily:'.PingFangSC-Semibold',
    fontSize: em(40),
    color:'rgba(255,120,25,0.30)',
    letterSpacing: em(0,48),
    zIndex: 10,
  },
  addGoodBox:{
    position: 'absolute',
    left: normalizeW(108),
    top: normalizeH(128),
    flexDirection: 'row',
    zIndex: 10,
    alignItems: 'center'
  },
  addGoodText:{
    fontFamily:'.PingFangSC-Medium',
    fontSize: em(15),
    color: '#FF7819',
    letterSpacing: em(0.61),

  }
})