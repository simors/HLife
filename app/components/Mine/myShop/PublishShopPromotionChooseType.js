/**
 * Created by lilu on 2017/8/4.
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import {connect} from 'react-redux'
import {CachedImage} from "react-native-img-cache"
import {bindActionCreators} from 'redux'
import Svg from '../../common/Svgs'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
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
import PromotionTypeShow from './PromotionTypeShow'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let shopPromotionForm = 'shopPromotionForm'
let chooseTypeInput = {
  formKey: shopPromotionForm,
  stateKey: Symbol('chooseTypeInput'),
  type: "chooseTypeInput",
}


class PublishShopPromotionChooseType extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shouldUploadImage: false,
      chooseTypeId: undefined,
      hideBottomView: false,
      custName:'',
      types: [
        {
          id: '0',
          type: '折扣',
          typeDesc: '',
          containerStyle: 'activeType',
          textStyle: 'activeTypeTxt',
          placeholderText: '例:店庆活动,全场七折起(15字内)'
        },
        {
          id: '1',
          type: '预售',
          typeDesc: '',
          containerStyle: 'defaultType',
          textStyle: 'defaultTypeTxt',
          placeholderText: '例:3月15号到货(15字内)'
        },
        {
          id: '2',
          type: '限时购',
          typeDesc: '',
          containerStyle: 'defaultType',
          textStyle: 'defaultTypeTxt',
          placeholderText: '例:每天下午18:00~22:00(15字内)'
        },
        {
          id: '3',
          type: '自定义',
          typePlaceholderText: '',
          containerStyle: 'customType',
          textStyle: 'customTypeTxt',
          placeholderText: '用简短的文字描述活动(15字内)'
        },
      ]
    }
    this.replyInput = null

  }

  componentDidMount() {
    this.props.initInputForm(chooseTypeInput)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=> {

    })
  }

  unChooseType(index) {
    chooseTypeInput.data = {}
    this.props.inputFormUpdate(chooseTypeInput)
  }

  renderTypes(start, end) {
    let renderType = this.state.types.map((item, index) => {
      if (index >= start && index <= end) {
        if (this.props.chooseTypeId == item.id) {
          return (
            <TouchableWithoutFeedback key={'type_'+item.id} onPress={()=> {
              this.unChooseType(index)
            }}>
              <View style={styles.typeBox}>
                <Text style={styles.chooseTypeText}>{item.type}</Text>
                <View style={styles.typeSvg}>
                  <Svg size={normalizeW(165)} height={normalizeH(69)} icon="selected_act"/>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )
        } else {
          if (index == 3) {
            return (
              <TouchableWithoutFeedback key={'type_' + item.id} onPress={()=> {
                this.changeType(index)
              }}>
                <View style={styles.typeBox}>
                  <Text style={styles.unChoose4TypeText}>{item.type}</Text>
                  <View style={styles.typeSvg}>
                    <Svg size={normalizeW(165)} height={normalizeH(69)} icon="custom_act"/>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )
          } else {
            return (
              <TouchableWithoutFeedback key={'type_' + item.id} onPress={()=> {
                this.changeType(index)
              }}>
                <View style={styles.typeBox}>
                  <Text style={styles.unChooseTypeText}>{item.type}</Text>
                  <View style={styles.typeSvg}>
                    <Svg size={normalizeW(165)} height={normalizeH(69)} icon="unselect_act@2x"/>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )
          }
        }
      }
    })
    return renderType
  }

  openModel(callback) {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    }
    else {
      this.setState({
        hideBottomView: true
      }, ()=> {
        if (this.replyInput) {
          this.replyInput.focus()
        }
        if (callback && typeof callback == 'function') {
          callback()
        }
      })

    }
  }

  changeType(index) {
    chooseTypeInput.data = this.state.types[index]
    this.props.inputFormUpdate(chooseTypeInput)
  }

  chooseCustType(index){
     let newTypes = this.state.types
    newTypes[3].type=this.state.custName
    this.setState({
      type: newTypes
    },()=>{
      chooseTypeInput.data = this.state.types[index]
      this.props.inputFormUpdate(chooseTypeInput)
    })
    this.openModel()

  }

  componentWillReceiveProps(nextProps) {

  }

  onButtonPress() {
    if (this.props.chooseTypeId != undefined && this.props.chooseTypeId != '') {
      Actions.PUBLISH_SHOP_PROMOTION_CHOOSE_DATE()
    } else {
      Toast.show('请选择一个活动类型')
    }
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

  onKeyboardWillShow = (e) => {
    // this.setState({
    //   hideBottomView: true
    // })
  }

  onKeyboardWillHide = (e) => {
    // console.log('onKeyboardWillHide')
    this.setState({
      hideBottomView: false
    })
  }

  onKeyboardDidShow = (e) => {
    if (Platform.OS === 'android') {
      this.onKeyboardWillShow(e)
    }
  }

  onKeyboardDidHide = (e) => {
    if (Platform.OS === 'android') {
      this.onKeyboardWillHide(e)
    }
  }

  sendReply(){
    if(this.state.custName&&this.state.custName!=''&&this.state.custName.length<5){
      let newTypes = this.state.types[3]
      this.setState({hideBottomView: false})
      newTypes.type=this.state.custName
      this.setState({
        type: newTypes
      },()=>{
        chooseTypeInput.data = newTypes
        this.props.inputFormUpdate(chooseTypeInput)
        if (this.props.chooseTypeId != undefined && this.props.chooseTypeId != '') {
          Actions.PUBLISH_SHOP_PROMOTION_CHOOSE_DATE()
        } else {
          Toast.show('请选择一个活动类型')
        }
      })
    }else{
      this.setState({hideBottomView: false})
      Toast.show('自定义类型不能为空或者大于4个字！')

    }


  }

  changeCustName(content){
    // console.log('content=======>',content)
    let newTypes = this.state.types
    newTypes[3].type=content
    this.setState({custName:content,type:newTypes})
    // console.log('content=======>',this.state.types[3])

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
            <Text style={styles.showText}>选择活动类型</Text>
          </View>
          <KeyboardAwareScrollView>
            <View style={{flexDirection: 'row',}}>
             <PromotionTypeShow
               type = {this.state.types[0]}
               isChoosen = {this.props.chooseTypeId&&this.props.chooseTypeId==this.state.types[0].id?true:false}
               changeType = {()=>{this.changeType(0) }}
               unChooseType = {()=>{this.unChooseType(0)}}
             />
              <PromotionTypeShow
                type = {this.state.types[1]}
                isChoosen = {this.props.chooseTypeId&&this.props.chooseTypeId==this.state.types[1].id?true:false}
                changeType = {()=>{this.changeType(1) }}
                unChooseType = {()=>{this.unChooseType(1)}}
              />

            </View>
            <View style={{flexDirection: 'row',}}>
              <PromotionTypeShow
                type = {this.state.types[2]}
                isChoosen = {this.props.chooseTypeId&&this.props.chooseTypeId==this.state.types[2].id?true:false}
                changeType = {()=>{this.changeType(2) }}
                unChooseType = {()=>{this.unChooseType(2)}}
              />
              <PromotionTypeShow
                type = {this.state.types[3]}
                isChoosen = {this.props.chooseTypeId&&this.props.chooseTypeId==this.state.types[3].id?true:false}
                changeType = {()=>{this.chooseCustType(3) }}
                unChooseType = {()=>{this.unChooseType(3)}}
              />
            </View>
            {this.renderSubmitButton()}
          </KeyboardAwareScrollView>
          {this.state.hideBottomView
            ? <TouchableOpacity
            style={{position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundColor: 'rgba(0,0,0,0.5)'}}
            onPress={()=> {
              dismissKeyboard()
            }}>
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
              onChangeText={(content)=>this.changeCustName(content)}
              replyInputRefCallBack={(input)=> {
                this.replyInput = input
              }}
              onSend={(content) => {
                this.sendReply(content)
              }}
              label="下一步"
              btnContainerStyle={{width:normalizeW(90)}}
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
  const isLogin = isUserLogined(state)
  let chooseTypeId = getInputData(state, chooseTypeInput.formKey, chooseTypeInput.stateKey)
  console.log('chooseTypeId=============>', chooseTypeId)

  return {
    shopId: userOwnedShopInfo.id,
    chooseTypeId: chooseTypeId.id,
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

export default connect(mapStateToProps, mapDispatchToProps)(PublishShopPromotionChooseType)

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
  noGoodText: {
    position: 'absolute',
    left: normalizeW(91),
    top: normalizeH(52),
    fontSize: em(40),
    color: 'rgba(255,120,25,0.30)',
    letterSpacing: em(0, 48),
    zIndex: 10,
  },
  addGoodBox: {
    position: 'absolute',
    left: normalizeW(108),
    top: normalizeH(128),
    flexDirection: 'row',
    zIndex: 10,
    alignItems: 'center'
  },
  addGoodText: {
    fontSize: em(15),
    color: '#FF7819',
    letterSpacing: em(0.61),

  },
  submitBtn: {
    backgroundColor: '#FF7819',
    height: normalizeH(50),
    width: normalizeW(345),
    marginLeft: normalizeW(15),
    marginTop: normalizeH(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: em(18),
    letterSpacing: -em(0.45)
  },
  unChooseTypeText: {
    fontSize: em(20),
    color: '#FF7819',
    letterSpacing: em(0.24),
    zIndex: 100,
    position:'relative',


  },
  unChoose4TypeText: {
    fontSize: em(20),
    color: 'rgba(0,0,0,0.20)',
    letterSpacing: em(0.24),
    zIndex: 100,
    position:'relative',


  },
  chooseTypeText: {
    position:'relative',
    fontSize: em(20),
    color: '#FFFFFF',
    letterSpacing: em(0.24),
    zIndex: 100
  },
  typeBox: {
    height: normalizeH(69),
    width: normalizeW(165),
    marginLeft: normalizeW(15),
    marginTop: normalizeH(12),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  typeSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: normalizeH(69),
    width: normalizeW(165),
  }
})