/**
 * Created by zachary on 2016/12/13.
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
  TextInput,
  Keyboard
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as Toast from '../../common/Toast'
import * as authSelector from '../../../selector/authSelector'
import {getInputFormData} from '../../../selector/inputFormSelector'
import Symbol from 'es6-symbol'
import {fetchMyShopExpiredPromotionList, fetchUserOwnedShopInfo, submitShopPromotion} from '../../../action/shopAction'
import {fetchShopPromotionDraft,handleDestroyShopPromotionDraft} from '../../../action/draftAction'

import {submitFormData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {selectUserOwnedShopInfo} from '../../../selector/shopSelector'
import CommonTextInput from '../../common/Input/CommonTextInput'
import KeyboardAwareToolBar from '../../common/KeyboardAwareToolBar'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import ImageInput from '../../common/Input/ImageInput'
import ArticleEditor from '../../common/Input/ArticleEditor'
import Popup from '@zzzkk2009/react-native-popup'
import Loading from '../../common/Loading'
import uuid from 'react-native-uuid'
import TimerMixin from 'react-timer-mixin'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let shopPromotionForm = Symbol('shopPromotionForm')
const shopPromotion = {
  formKey: shopPromotionForm,
  stateKey: Symbol('shopPromotion'),
  type: 'shopPromotion',
}

const rteHeight = {
  height: normalizeH(64),
}

const wrapHeight = 214

class EditShopPromotion extends Component {
  constructor(props) {
    super(props)

    this.toolBarContentTypes = {
      DEFAULT: 'DEFAULT_TYPE_INPUT',
      CUSTOM: 'CUSTOM_TYPE_INPUT',
    }
    console.log('props.shopPromotion',this.props.shopPromotion)
    this.localRichTextImagesUrls = []
    this.leanRichTextImagesUrls = []
    this.localCoverImgUri = props.shopPromotion.coverUrl || ''
    this.isPublishing = false
    this.draftId=''
    if(this.props.shopPromotion.id){
      this.draftId = this.props.shopPromotion.id
    }else if (this.props.shopPromotion.draftId){
      this.draftId = this.props.shopPromotion.draftId
    }
    this.state = {

      rteFocused: false,    // 富文本获取到焦点
      shouldUploadRichTextImg: false,
      extraHeight: rteHeight.height,
      headerHeight: wrapHeight,
      showOverlay: false,

      form: {
        shopId: props.userOwnedShopInfo.id,
        shopPromotionId: this.props.shopPromotion.shopPromotionId?this.props.shopPromotion.shopPromotionId:props.shopPromotion.id,
        status: props.shopPromotion.status,
        typeId: props.shopPromotion.typeId,
        type: props.shopPromotion.type,
        typeDesc: props.shopPromotion.typeDesc,
        coverUrl: props.shopPromotion.coverUrl,
        title: props.shopPromotion.title,
        promotingPrice: props.shopPromotion.promotingPrice,
        originalPrice: props.shopPromotion.originalPrice,
        abstract: props.shopPromotion.abstract,
        promotionDetailInfo: props.shopPromotion.promotionDetailInfo && JSON.parse(props.shopPromotion.promotionDetailInfo)
      },
      typeDescPlaceholder: '例:店庆活动,全场七折起(15字内)',
      toolBarContentType: this.toolBarContentTypes.DEFAULT,
      toolBarInputFocusNum: 0,
      shouldUploadCover: false,
      types: [
        {
          id: 0,
          type: '折扣',
          typeDesc: '',
          containerStyle: 'activeType',
          textStyle: 'activeTypeTxt',
          placeholderText: '例:店庆活动,全场七折起(15字内)'
        },
        {
          id: 1,
          type: '预售',
          typeDesc: '',
          containerStyle: 'defaultType',
          textStyle: 'defaultTypeTxt',
          placeholderText: '例:3月15号到货(15字内)'
        },
        {
          id: 2,
          type: '限时购',
          typeDesc: '',
          containerStyle: 'defaultType',
          textStyle: 'defaultTypeTxt',
          placeholderText: '例:每天下午18:00~22:00(15字内)'
        },
        {
          id: 3,
          type: '自定义',
          typePlaceholderText: '',
          containerStyle: 'customType',
          textStyle: 'customTypeTxt',
          placeholderText: '用简短的文字描述活动(15字内)'
        },
      ]
    }


  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      //this.props.fetchUserOwnedShopInfo()
    })
  }

  componentDidMount() {
    //this.showToolBarInput()
    this.updateTypesDesc(this.state.form.typeDesc)
    this.setInterval(()=>{

      this.props.fetchShopPromotionDraft({userId:this.props.userId,draftId:this.draftId, ...this.state.form,
        abstract: this.state.form.abstract,
        promotionDetailInfo:  JSON.stringify(this.state.form.promotionDetailInfo),
        shopId: this.state.form.shopId,
        localCoverImgUri: this.localCoverImgUri,
        localRichTextImagesUrls: this.localRichTextImagesUrls,
      })
      // console.log('here is uid ',this.draftId)
    },5000)

    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow)
      Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide)

    }
  }

  componentWillUnmount(){
    // console.log('unmount component')

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
    //   showOverlay:true
    // })
  }

  onKeyboardWillHide = (e) => {
    this.setState({
      showOverlay:false
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

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps=nextProps=', nextProps)
    let abstract = nextProps.abstract || ''
    let promotionDetailInfo = null
    if(nextProps.promotionDetailInfo && nextProps.promotionDetailInfo.length) {
      promotionDetailInfo = nextProps.promotionDetailInfo
    }
    // console.log('componentWillReceiveProps=this.state=', this.state)

    let shopId = ''
    if(nextProps.userOwnedShopInfo && nextProps.userOwnedShopInfo.id) {
      shopId = nextProps.userOwnedShopInfo.id
    }

    this.setState({
      form: {
        ...this.state.form,
        abstract: abstract ? abstract : this.state.form.abstract,
        promotionDetailInfo: promotionDetailInfo ? promotionDetailInfo : this.state.form.promotionDetailInfo,
        shopId: shopId ? shopId : this.state.form.shopId
      }
    }, ()=>{
      // console.log('componentWillReceiveProps=this.state=', this.state)
    })
  }
  
  showToolBarInput(type) {
    this.setState({
      toolBarInputFocusNum: 1,
      showOverlay: true
    }, ()=>{
      if(type == this.toolBarContentTypes.CUSTOM) {
        this.showCustomTypeInputToolbar()
      }else {
        this.showDefaultTypeInputToolbar()
      }
    })
  }

  showDefaultTypeInputToolbar(callback) {
    if(this._typeDefaultDescInput) {
      this._typeDefaultDescInput.focus()
      callback && callback()
    }
  }

  showCustomTypeInputToolbar(callback) {
    if(this._typeNameInput) {
      this._typeNameInput.focus()
      callback && callback()
    }
  }

  changeType(_index) {
    let newTypes = this.state.types.map((item, index) => {
      if(_index == index) {
        if(item.containerStyle == 'activeType') {
          if(item.id == 3) {
            this.setState({
              toolBarContentType: this.toolBarContentTypes.CUSTOM,
              typeDescPlaceholder: item.placeholderText
            }, ()=>{
              this.showToolBarInput(this.toolBarContentTypes.CUSTOM)
            })
          }else {
            this.setState({
              toolBarContentType: this.toolBarContentTypes.DEFAULT,
              typeDescPlaceholder: item.placeholderText
            }, ()=>{
              this.showToolBarInput()
            })
          }
        }else {
          item.containerStyle = 'activeType'
          item.textStyle = 'activeTypeTxt'

          if(item.id == 3) {
            this.setState({
              form: {
                ...this.state.form,
                typeId: item.id,
                type: item.type == '自定义' ? '' : item.type,
                typeDesc: item.typeDesc
              },
              toolBarContentType: this.toolBarContentTypes.CUSTOM,
              typeDescPlaceholder: item.placeholderText
            }, ()=>{
              // console.log('changeType===',  this.state)
              this.showToolBarInput(this.toolBarContentTypes.CUSTOM)
            })
          }else {
            this.setState({
              form: {
                ...this.state.form,
                typeId: item.id,
                type: item.type,
                typeDesc: item.typeDesc
              },
              toolBarContentType: this.toolBarContentTypes.DEFAULT,
              typeDescPlaceholder: item.placeholderText
            }, ()=>{
              this.showToolBarInput()
            })
          }
        }
      }else {
        if(item.id == 3) {
          // item.type = '自定义'
          item.containerStyle = 'customType'
          item.textStyle = 'customTypeTxt'
        }else {
          item.containerStyle = 'defaultType'
          item.textStyle = 'defaultTypeTxt'
        }
      }
      return item
    })

    this.setState({
      types: newTypes
    })
  }

  renderTypes() {
    return this.state.types.map((item, index) => {
      return (
        <TouchableWithoutFeedback key={'type_' + index} onPress={()=>{this.changeType(index)}}>
          <View style={[styles.typeRowItem, styles[item.containerStyle]]}>
            <Text style={[styles.typeRowItemTxt, styles[item.textStyle]]}>{item.type}</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    })
  }

  onDefaultTypeBtnPress() {
    if(!this.checkTypeDesc()) {
      return
    }
    this.setState({
      showOverlay:false
    })
    dismissKeyboard()
  }

  onCustomTypeBtnPress() {
    if(!this.checkType()) {
      return
    }

    let newTypes = this.state.types.map((item, index) => {
      if(item.id == 3) {
        item.type = this.state.form.type
      }
      return item
    })

    this.setState({
      type: newTypes,
    })
    this.setState({
      showOverlay:false
    })
    dismissKeyboard()
  }

  onOverlayPress() {
    dismissKeyboard()

    // if(this.state.form.typeId != 3) {
    //   this.onDefaultTypeBtnPress()
    // }else {
    //   this.onCustomTypeBtnPress()
    // }
  }

  checkForm() {

    if(!this.state.form.shopId) {
      Toast.show('暂未获取到您的店铺信息，请刷新页面重试!')
      return false
    }

    if(!this.checkType()) {
      return false
    }

    if(!this.localCoverImgUri) {
      Toast.show('请添加封面图片')
      return false
    }

    if(!this.state.form.title) {
      Toast.show('请填写活动标题')
      return false
    }

    if(!this.state.form.promotingPrice) {
      Toast.show('请填写活动价格')
      return false
    }

    if(!this.state.form.promotionDetailInfo || !this.state.form.promotionDetailInfo.length) {
      Toast.show('请完善活动详情')
      return false
    }

    return true
  }

  checkType() {
    if(this.checkTypeName() && this.checkTypeDesc()) {
      return true
    }
    return false
  }

  checkTypeName() {
    if(!this.state.form.type) {
      Toast.show('请输入类型名称')
      return false
    }else if(this.state.form.type.length > 4) {
      Toast.show('类型名称长度不能超过4个字')
      return false
    }
    return true
  }

  checkTypeDesc() {
    if(!this.state.form.typeDesc) {
      Toast.show('请输入类型描述')
      return false
    }else if(this.state.form.typeDesc.length > 20) {
      Toast.show('类型描述长度不能超过20个字')
      return false
    }
    return true
  }

  renderToolBarContent() {
    // console.log('renderToolBarContent===', this.state.toolBarInputFocusNum)
    if(this.state.showOverlay) {
      if(this.state.toolBarInputFocusNum) {
        switch(this.state.toolBarContentType) {
          case 'DEFAULT_TYPE_INPUT':
            return this.renderToolBarDefaultTypeInput()
          case 'CUSTOM_TYPE_INPUT':
            return this.renderToolBarCustomTypeInput()
          default:
            return null
        }
      }
    }

    return null
  }

  checkShouldShowToolBarInput() {
    if(this._typeDefaultDescInput) {
      if(this._typeDefaultDescInput.isFocused()) {
        return
      }
    }
    if(this._typeNameInput) {
      if(this._typeNameInput.isFocused()) {
        return
      }
    }
    if(this._typeDescInput) {
      if(this._typeDescInput.isFocused()) {
        return
      }
    }
    this.setState({
      toolBarInputFocusNum: 0
    })
  }

  updateTypesDesc(typeDesc) {
    this.state.types.forEach((item) =>{
      if(item.id == this.state.form.typeId) {
        item.typeDesc = typeDesc
      }
    })
  }

  renderToolBarDefaultTypeInput() {
    return (
      <View style={styles.toolbarDefaultTypeInputContainer}>
        <TextInput
          ref={(input) =>{this._typeDefaultDescInput = input}}
          placeholder={this.state.typeDescPlaceholder}
          maxLength={120}
          value={this.state.form.typeDesc}
          style={styles.toolbarInputStyle}
          enablesReturnKeyAutomatically={true}
          blurOnSubmit={true}
          underlineColorAndroid="transparent"
          onBlur={()=>{this.checkShouldShowToolBarInput()}}
          onChangeText={(text) => {
            this.updateTypesDesc(text)
            this.setState({
              form: {
                ...this.state.form,
                typeDesc: text
              }
            })
          }}
          onSubmitEditing={()=>{
            this.onDefaultTypeBtnPress()
          }}
        />
        <TouchableOpacity
          style={[styles.btnContainer]}
          onPress={() => {this.onDefaultTypeBtnPress()}}
        >
          <Text style={[styles.btnText]}>确认</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderToolBarCustomTypeInput() {
    return (
      <View style={styles.toolbarDefaultTypeInputContainer}>
        <View style={styles.inputWrap}>
          <View style={styles.typeNameInputBox}>
            <TextInput
              ref={(input) =>{this._typeNameInput = input}}
              placeholder="请输入类型名(4字内)"
              maxLength={24}
              value={this.state.form.type}
              style={[styles.toolbarInputStyle, styles.typeNameInputStyle]}
              enablesReturnKeyAutomatically={true}
              blurOnSubmit={true}
              underlineColorAndroid="transparent"
              onBlur={()=>{this.checkShouldShowToolBarInput()}}
              onChangeText={(text) => {
                this.setState({
                  form: {
                    ...this.state.form,
                    type: text
                  }
                })
              }}
            />
          </View>
          <TextInput
            ref={(input) =>{this._typeDescInput = input}}
            placeholder={this.state.typeDescPlaceholder}
            maxLength={120}
            value={this.state.form.typeDesc}
            style={[styles.toolbarInputStyle, styles.typeDescInputStyle]}
            enablesReturnKeyAutomatically={true}
            blurOnSubmit={true}
            underlineColorAndroid="transparent"
            onBlur={()=>{this.checkShouldShowToolBarInput()}}
            onChangeText={(text) => {
              this.updateTypesDesc(text)
              this.setState({
                form: {
                  ...this.state.form,
                  typeDesc: text
                }
              })
            }}
            onSubmitEditing={()=>{this.onCustomTypeBtnPress()}}
          />
        </View>
        <TouchableOpacity
          style={[styles.btnContainer]}
          onPress={() => {this.onCustomTypeBtnPress()}}
        >
          <Text style={[styles.btnText]}>确认</Text>
        </TouchableOpacity>
      </View>
    )
  }

  publishPromotion() {
    if(this.isPublishing){
      return
    }
    this.isPublishing = true
    

    if(!this.checkForm()) {
      this.isPublishing = false
      return
    }

    if('0' == this.state.form.status) {
      Popup.confirm({
        title: '编辑活动',
        content: '是否立即启用该活动?',
        ok: {
          text: '启用',
          style: {color: '#FF7819'},
          callback: ()=>{
            this.state.form.status = '1'
            this.setState({
              form:{
                ...this.state.form,
                status: this.state.form.status
              }
            })
            this.submitForm()
          }
        },
        cancel: {
          text: '暂不',
          callback: ()=>{
            // console.log('cancel')
            this.submitForm()
          }
        }
      })
    }else {
      this.submitForm()
    }
  }

  submitForm() {
    // console.log('submitForm.this.state=====', this.state)
    if(this.state.shopPromotionId){
      console.log('不是重新发布咯')
      this.loading = Loading.show()
      this.props.submitShopPromotion({
        ...this.state.form,
        localCoverImgUri: this.localCoverImgUri,
        localRichTextImagesUrls: this.localRichTextImagesUrls,
        success: ()=>{
          Toast.show('活动更新成功')
          this.props.fetchUserOwnedShopInfo()
          this.props.fetchMyShopExpiredPromotionList({isRefresh:true})
          Actions.pop()
          this.isPublishing = false
          this.props.handleDestroyShopPromotionDraft({id:this.draftId})
          Loading.hide(this.loading)
        },
        error: ()=>{
          Toast.show('活动更新失败')
          this.isPublishing = false
          Loading.hide(this.loading)
        }
      })
    }else{
      console.log('重新发布咯')
      this.loading = Loading.show()
      this.props.submitShopPromotion({
        ...this.state.form,
        localCoverImgUri: this.localCoverImgUri,
        localRichTextImagesUrls: this.localRichTextImagesUrls,
        success: ()=>{
          this.isPublishing = false
          Loading.hide(this.loading)
          Toast.show('活动发布成功')
          if(this.props.isPop) {
            this.props.fetchUserOwnedShopInfo()

            Actions.pop()
            this.props.handleDestroyShopPromotionDraft({id:this.draftId})

          }else{
            this.props.handleDestroyShopPromotionDraft({id:this.draftId})

            // Actions.SHOP_DETAIL({id: this.state.form.shopId})
            Actions.pop()


          }
        },
        error: ()=>{
          this.isPublishing = false
          Loading.hide(this.loading)
          Toast.show('活动发布失败')
        }
      })
    }

  }

  getRichTextImages(images) {
    this.localRichTextImagesUrls = images
    // console.log('getRichTextImages.localRichTextImagesUrls==', this.localRichTextImagesUrls)
  }

  renderArticleEditorToolbar(customStyle) {

    let defaultContainerStyle = {
      justifyContent:'center',
      alignItems: 'center',
      backgroundColor: THEME.base.mainColor
    }

    return (
      <TouchableOpacity onPress={() => {Keyboard.dismiss()}}>
        <View style={[defaultContainerStyle, customStyle]}>
          <Text style={{fontSize: 15, color: 'white'}}>收起</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderRichText() {
    return (
      <ArticleEditor
        {...shopPromotion}
        wrapHeight={this.state.extraHeight}
        initValue={this.props.shopPromotion.promotionDetailInfo && JSON.parse(this.props.shopPromotion.promotionDetailInfo)}
        toolbarController={true}
        mode="modify"
        renderCustomToolbar={() => {
          return this.renderArticleEditorToolbar({
             flex:1,
             width:64,
          })
        }}
        getImages={(images) => this.getRichTextImages(images)}
        onFocusEditor={() => {this.setState({headerHeight: 0})}}
        onBlurEditor={() => {this.setState({headerHeight: 214})}}
        placeholder="描述一下你的商品及活动详情"
      />
    )
  }

  render() {
    // console.log('this.props.shopPromotion======>>>', this.props.shopPromotion)
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="编辑活动"
          headerContainerStyle={{backgroundColor:'#f9f9f9'}}
          rightType="text"
          rightText="发布"
          rightPress={() => {
              this.props.fetchShopPromotionDraft({userId:this.props.userId,draftId:this.draftId, ...this.state.form,
                abstract: this.state.form.abstract,
                promotionDetailInfo:  JSON.stringify(this.state.form.promotionDetailInfo),
                shopId: this.state.form.shopId,
                localCoverImgUri: this.localCoverImgUri,
                localRichTextImagesUrls: this.localRichTextImagesUrls,
              })
            this.publishPromotion()}}
          rightStyle={{color: THEME.base.mainColor}}
        />
        <View style={styles.body}>
          <View style={[styles.contentContainer, {height: this.state.headerHeight, overflow:'hidden'}]}
                onLayout={(event) => {this.setState({extraHeight: rteHeight.height + event.nativeEvent.layout.height})}}
          >
            <View style={styles.typeWrap}>
              <View style={styles.typeRow}>
                <View style={[styles.typeRowItem, styles.typeRowItemTitle]}>
                  <Text style={styles.typeRowItemTxt}>类型</Text>
                </View>
                {this.renderTypes()}
              </View>
              <TouchableWithoutFeedback onPress={()=>{/*this.onShowTypeDescPress()*/}}>
                <View style={styles.typeDescWrap}>
                    <Text style={styles.typeDescTxt}>{this.state.form.typeDesc || this.state.typeDescPlaceholder}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={styles.introWrap}>
              <View style={styles.coverBox}>
                <ImageInput
                  containerStyle={{width: 80, height: 80,borderWidth:0}}
                  addImageBtnStyle={{top:0, left: 0, width: 80, height: 80}}
                  choosenImageStyle={{width: 80, height: 80}}
                  addImage={require('../../../assets/images/upload_pic.png')}
                  initValue={this.state.form.coverUrl}
                  closeModalAfterSelectedImg={true}
                  imageSelectedChangeCallback={(localImgUri)=>{this.localCoverImgUri = localImgUri}}
                />
              </View>
              <View style={styles.introBox}>
                <View style={styles.titleBox}>
                  <Text style={styles.titleLabel}>标题</Text>
                  <TextInput
                    placeholder='商品或服务名称(20字内)'
                    maxLength={120}
                    value={this.state.form.title}
                    style={[styles.titleInput]}
                    enablesReturnKeyAutomatically={true}
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => {
                      this.setState({
                        form: {
                          ...this.state.form,
                          title: text
                        }
                      })
                    }}
                  />
                </View>
                <View style={styles.priceBox}>
                  <View style={styles.promotingPriceBox}>
                    <Text style={styles.priceLabel}>价格</Text>
                    <Text style={{color:'#F56A23',marginLeft:3}}>￥</Text>
                    <TextInput
                      placeholder='0.00'
                      placeholderTextColor="#F56A23"
                      maxLength={7}
                      value={this.state.form.promotingPrice}
                      keyboardType="numeric"
                      style={[styles.promotingPriceInput]}
                      enablesReturnKeyAutomatically={true}
                      underlineColorAndroid="transparent"
                      onChangeText={(text) => {
                        this.setState({
                          form: {
                            ...this.state.form,
                            promotingPrice: text
                          }
                        })
                      }}
                    />
                  </View>

                  <View style={styles.originalPriceBox}>
                    <Text style={styles.priceLabel}>原价</Text>
                    <Text style={{color:'#aaa',marginLeft:3}}>￥</Text>
                    <TextInput
                      placeholder='0.00'
                      placeholderTextColor="#aaa"
                      maxLength={7}
                      value={this.state.form.originalPrice}
                      keyboardType="numeric"
                      style={[styles.originalPriceInput]}
                      enablesReturnKeyAutomatically={true}
                      underlineColorAndroid="transparent"
                      onChangeText={(text) => {
                        this.setState({
                          form: {
                            ...this.state.form,
                            originalPrice: text
                          }
                        })
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {this.renderRichText()}
        </View>

        {this.state.showOverlay &&
          <TouchableOpacity
            style={{position:'absolute',left:0,right:0,bottom:0,top:0,backgroundColor:'rgba(0,0,0,0.5)'}}
            onPress={()=>{
              this.onOverlayPress()
            }}>
            <View style={{flex:1}} />
          </TouchableOpacity>
        }

        <KeyboardAwareToolBar
          initKeyboardHeight={-100}
          hideOverlay={true}
        >
          {this.renderToolBarContent()}
        </KeyboardAwareToolBar>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  const isUserLogined = authSelector.isUserLogined(state)
  const userId = authSelector.activeUserId(state)

  const formData = getInputFormData(state, shopPromotionForm)
  let shopPromotion = formData && formData.shopPromotion
  let abstract = shopPromotion && shopPromotion.abstract
  let promotionDetailInfo = shopPromotion && shopPromotion.text
  // console.log('formData=====', formData)
  // console.log('promotionDetailInfo=====', promotionDetailInfo)

  return {
    userId:userId,
    userOwnedShopInfo: userOwnedShopInfo,
    isUserLogined: isUserLogined,
    abstract: abstract,
    promotionDetailInfo: promotionDetailInfo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserOwnedShopInfo,
  submitShopPromotion,
  fetchShopPromotionDraft,
  handleDestroyShopPromotionDraft,
  fetchMyShopExpiredPromotionList
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EditShopPromotion)
Object.assign(EditShopPromotion.prototype, TimerMixin)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  contentContainer: {

  },
  typeWrap: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white'
  },
  typeRow: {
    flexDirection: 'row'
  },
  typeDescWrap: {
    marginLeft: 51,
    marginTop: 10,
    padding:6,
  },
  typeDescTxt: {
    color: '#b2b2b2',
    fontSize: em(15)
  },
  typeRowItem: {
    padding: 10,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 2,
    marginRight: 15
  },
  typeRowItemTitle: {
    marginRight: 0
  },
  typeRowItemTxt: {
    color: '#5a5a5a',
    fontSize: em(15)
  },
  activeType: {
    backgroundColor: '#FF7819'
  },
  activeTypeTxt: {
    color: 'white',
    fontSize: em(15)
  },
  defaultType: {
    backgroundColor: '#aaa'
  },
  defaultTypeTxt: {
    color: 'white',
    fontSize: em(15)
  },
  customType: {
    backgroundColor: '#f5f5f5'
  },
  customTypeTxt: {
    color: '#aaa',
    fontSize: em(15)
  },
  inputContainerStyle: {
    height: 29,
    paddingLeft: 17
  },
  inputStyle: {
    backgroundColor: 'white',
  },
  toolbarDefaultTypeInputContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  toolbarInputStyle: {
    flex: 1,
    height: 50,
    paddingLeft: 17,
    paddingRight: 17
  },
  typeNameInputStyle: {
    height: 36,
    paddingLeft: 0,
    paddingRight: 0
  },
  typeNameInputBox: {
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#b2b2b2'
  },
  typeDescInputStyle: {
    height: 36,
    paddingLeft: 0,
    paddingRight: 0
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF7819',
    paddingLeft: 15,
    paddingRight: 15
  },
  btnText: {
    color: 'white',
    fontSize: em(15)
  },
  inputWrap: {
    flex: 1,
    paddingLeft: 17,
    paddingRight: 17
  },
  introWrap: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 15,
    paddingLeft: 15,
    paddingBottom: 10,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#b2b2b2'
  },
  coverBox: {
    marginRight: 15
  },
  introBox: {
    flex: 1,
  },
  titleBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#b2b2b2'
  },
  priceBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleLabel: {
    fontSize: em(17),
    color: '#aaa'
  },
  titleInput: {
    flex: 1,
    paddingLeft: 6
  },
  promotingPriceBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: em(15),
    color: '#aaa'
  },
  promotingPriceInput: {
    flex: 1,
    paddingLeft: 6,
    color: '#FF7819'
  },
  originalPriceBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPriceInput: {
    flex: 1,
    paddingLeft: 6
  }

})