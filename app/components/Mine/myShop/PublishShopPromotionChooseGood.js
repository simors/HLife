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


class PublishShopPromotionChooseGood extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shouldUploadImage: false,
      chooseGoodId:undefined,
      hideBottomView: false,
    }
    this.replyInput = null

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
    this.openModel()
  }

  componentDidMount() {

    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow)
      Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide)
    }
  }
  componentWillUnmount(){
    if (Platform.OS == 'ios') {
      Keyboard.removeListener('keyboardWillShow', this.onKeyboardWillShow)
      Keyboard.removeListener('keyboardWillHide', this.onKeyboardWillHide)
    } else {
      Keyboard.removeListener('keyboardDidShow', this.onKeyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', this.onKeyboardDidHide)

    }
  }

  onKeyboardWillShow = (e) => {
    // this.setState({
    //   hideBottomView: true
    // })
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

  openModel(callback) {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    }
    else {
      this.setState({
        hideBottomView: true
      }, ()=>{
        // console.log('openModel===', this.replyInput)
        if (this.replyInput) {
          this.replyInput.focus()
        }
        if (callback && typeof callback == 'function') {
          callback()
        }
      })

    }
  }

  onKeyboardWillHide = (e) => {
    // console.log('onKeyboardWillHide')
    this.setState({
      hideBottomView: false
    })
  }

  renderGoods(){
    return this.props.goodList&&this.props.goodList.length?this.renderGoodList():this.renderNoGood()
    // return this.renderNoGood()
  }

  sendReply(content){
    if(this.props.chooseGoodId&&this.props.chooseGoodId!=''){
      this.setState({hideBottomView: false})
      promotionPriceInput.data= {text: content}
      this.props.inputFormUpdate(promotionPriceInput)
      Actions.PUBLISH_SHOP_PROMOTION_CHOOSE_TYPE()
    }else{
      Toast.show('请选择一个商品')
    }

  }

  render() {
    let textInputProps={

    }
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
          {this.state.hideBottomView
            ? <TouchableOpacity style={{position:'absolute',left:0,right:0,bottom:0,top:0,backgroundColor:'rgba(0,0,0,0.5)'}} onPress={()=>{dismissKeyboard()}}>
            <View style={{flex: 1}}/>
          </TouchableOpacity>
            : null
          }
          <KeyboardAwareToolBar
            initKeyboardHeight={-normalizeH(50)}
            hideOverlay={true}
          >
            {this.state.hideBottomView
              ? <ToolBarContent
              initValue={this.props.priceInput?this.props.priceInput:0}
              replyInputRefCallBack={(input)=> {
                this.replyInput = input
              }}
              onSend={(content) => {
                this.sendReply(content)
              }}
              placeholder='设置活动价格'
              label="下一步"
              keyboardType="numeric"
            />
              : null
            }
          </KeyboardAwareToolBar>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  let goodList = []
  const isLogin = isUserLogined(state)

  if(userOwnedShopInfo.id) {
    goodList = selectGoodsList(state, userOwnedShopInfo.id, 1)
  }
  let chooseGoodId = getInputData(state,chooseGoodInput.formKey,chooseGoodInput.stateKey)
  let priceInput = getInputData(state,promotionPriceInput.formKey,promotionPriceInput.stateKey)
  console.log('priceInput=============>',priceInput.text)

  return {
    goodList: goodList,
    shopId: userOwnedShopInfo.id,
    chooseGoodId: chooseGoodId.text,
    priceInput: priceInput.text,
    isLogin: isLogin
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitInputData,
  fetchShopAnnouncements,
  initInputForm,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishShopPromotionChooseGood)

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