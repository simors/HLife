/**
 * Created by zachary on 2017/1/10.
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
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {
  SelectInput,
  Option,
  OptionList
} from '../../common/CommonSelect'
import {bindActionCreators} from 'redux'
import Symbol from 'es6-symbol'
import {Actions} from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import PhoneInput from '../../common/Input/PhoneInput'
import TextAreaInput from '../../common/Input/TextAreaInput'
import TagsInput from '../../common/Input/TagsInput'
import ShopTagsSelect from './ShopTagsSelect'
import CommonTextInput from '../../common/Input/CommonTextInput'
import ServiceTimePicker from '../../common/Input/ServiceTimePicker'
import {fetchShopTags, fetchUserOwnedShopInfo} from '../../../action/shopAction'
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import * as authSelector from '../../../selector/authSelector'
import {selectShopCategories} from '../../../selector/configSelector'
import {selectShopTags, selectUserOwnedShopInfo} from '../../../selector/shopSelector'
import {fetchShopCategories} from '../../../action/configAction'
import {inputFormUpdate} from '../../../action/inputFormActions'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Toast from '../../common/Toast'
import Loading from '../../common/Loading'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')

const serviceTimeInput = {
  formKey: commonForm,
  stateKey: Symbol('serviceTimeInput'),
  type: "serviceTimeInput",
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '服务时间为空'}
  },
}
const shopCategoryInput = {
  formKey: commonForm,
  stateKey: Symbol('shopCategoryInput'),
  type: "shopCategoryInput",
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '店铺类型为空'}
  },
}
const servicePhoneInput = {
  formKey: commonForm,
  stateKey: Symbol('servicePhoneInput'),
  type: "servicePhoneInput",
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '服务电话为空'}
  },
}
const servicePhone2Input = {
  formKey: commonForm,
  stateKey: Symbol('servicePhone2Input'),
  type: "servicePhone2Input",
  checkValid: (data)=>{
    return {isVal: true, errMsg: '验证通过'}
    // if (data && data.text && data.text.length > 0) {
    //   return {isVal: true, errMsg: '验证通过'}
    // }
    // return {isVal: false, errMsg: '备用电话为空'}
  },
}
const ourSpecialInput = {
  formKey: commonForm,
  stateKey: Symbol('ourSpecialInput'),
  type: 'ourSpecialInput',
  checkValid: (data)=>{
    if(data && data.text) {
      if (data.text.length > 0 && data.text.length <= 100) {
        return {isVal: true, errMsg: '验证通过'}
      }else {
        return {isVal: false, errMsg: '字数必须小于100'}
      }
    }else{
      return {isVal: false, errMsg: '本店特色为空'}
    }
  },
}

const tagsInput = {
  formKey: commonForm,
  stateKey: Symbol('tagsInput'),
  type: 'tagsInput',
  checkValid: (data)=>{
    return {isVal: true, errMsg: '验证通过'}
  },
}

const shopNameInput = {
  formKey: commonForm,
  stateKey: Symbol('shopNameInput'),
  type: "shopNameInput",
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0 && (data.text !== '未知')) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '店铺名称为空'}
  },
}
const shopAddrInput = {
  formKey: commonForm,
  stateKey: Symbol('shopAddrInput'),
  type: "shopAddrInput",
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0 && (data.text !== '未知')) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '店铺地址为空'}
  },
}
const shopGeoInput = {
  formKey: commonForm,
  stateKey: Symbol('shopGeoInput'),
  type: "shopGeoInput",
  checkValid: ()=>{return {isVal: true}},
}
const shopGeoCityInput = {
  formKey: commonForm,
  stateKey: Symbol('shopGeoCityInput'),
  type: "shopGeoCityInput",
  checkValid: ()=>{return {isVal: true}},
}
const shopGeoDistrictInput = {
  formKey: commonForm,
  stateKey: Symbol('shopGeoDistrictInput'),
  type: "shopGeoDistrictInput",
  checkValid: ()=>{return {isVal: true}},
}

class EditShop extends Component {
  constructor(props) {
    super(props)

    if(Platform.OS == 'ios') {
      this.state = {
        selectShow: false,
        shopTagsSelectShow: false,
        optionListPos: 319,
        shopTagsSelectTop: 379,
        selectedShopTags: [],
        shopCategoryContainedTag: [],
        shouldUploadImage: false,
        shouldUploadImages: false,
        shopName: '点击输入店铺名称',
        shopAddress: '标注您的店铺地址',
      }
    }else{
      this.state = {
        selectShow: false,
        shopTagsSelectShow: false,
        optionListPos: 299,
        shopTagsSelectTop: 359,
        selectedShopTags: [],
        shopCategoryContainedTag: [],
        shouldUploadImage: false,
        shouldUploadImages: false,
        shopName: '点击输入店铺名称',
        shopAddress: '标注您的店铺地址',
      }
    }

    this.headerHeight = 44
    if(Platform.OS == 'ios') {
      this.headerHeight = 64
    }
    this.shopBaseInfoWrapHeight = 64
    this.scrollOffSet = 0

    this.localCoverImgUri = ''
    this.localAlbumList = []

  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.fetchUserOwnedShopInfo()
      this.props.fetchShopCategories()
      this.props.fetchShopTags()
    })
  }

  componentDidMount() {
    console.log('shopInfo',this.props.userOwnedShopInfo)
    this.localAlbumList=this.props.userOwnedShopInfo.album
    this.localCoverImgUri = this .props.userOwnedShopInfo.coverUrl
    if(this.props.userOwnedShopInfo.containedTag && this.props.userOwnedShopInfo.containedTag.length) {
      this.setState({
        selectedShopTags: this.props.userOwnedShopInfo.containedTag
      })

    }

    let targetShopCategory = {}
    if(this.props.userOwnedShopInfo.targetShopCategory) {
      targetShopCategory = this.props.userOwnedShopInfo.targetShopCategory
      if(targetShopCategory.id) {
        this.updateShopCategoryContainedTags(targetShopCategory.id)
      }
    }

    this.setState({
      shopName: this.props.userOwnedShopInfo.shopName,
      shopAddress: this.props.userOwnedShopInfo.shopAddress,
    })

    if (this.props.userOwnedShopInfo.album) {
      this.localAlbumList = this.props.userOwnedShopInfo.album
    } else {
      this.localAlbumList = []
    }

  }

  _onSelectPress(e){
    this.setState({
      selectShow: !this.state.selectShow,
    })
  }

  _getOptionList(OptionListRef) {
    return this.refs[OptionListRef]
  }

  _onSelectShopCategory(shopCategoryId) {
    // console.log('_onSelectShopCategory.shopCategoryId=', shopCategoryId)
    this.updateShopCategoryContainedTags(shopCategoryId)
    this.setState({
      selectShow: !this.state.selectShow,
      selectedShopTags: []
    })
  }

  renderShopCategoryOptions() {
    let optionsView = <View />
    if(this.props.allShopCategories) {
      optionsView = this.props.allShopCategories.map((item, index) => {
        return (
          <Option ref={"option_"+index} key={"shopCategoryOption_" + index} value={item.id}>{item.text}</Option>
        )
      })
    }
    return optionsView
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.localCoverImgUri) {
      // console.log('nextProps.localCoverImgUri===>>>', nextProps.localCoverImgUri)
      this.localCoverImgUri = nextProps.localCoverImgUri
    }

    if(nextProps.localAlbumList) {
      // console.log('nextProps.localAlbumList===>>>', nextProps.localAlbumList)
      this.localAlbumList = nextProps.localAlbumList
    }

    if(this.props.shopName != nextProps.shopName) {
      this.setState({
        shopName: nextProps.shopName
      })
      nextProps.inputFormUpdate({
        formKey: shopNameInput.formKey,
        stateKey: shopNameInput.stateKey,
        data: {text:nextProps.shopName},
      })
    }
    if(this.props.shopAddress != nextProps.shopAddress) {
      this.setState({
        shopAddress: nextProps.shopAddress
      })
      nextProps.inputFormUpdate({
        formKey: shopAddrInput.formKey,
        stateKey: shopAddrInput.stateKey,
        data: {text:nextProps.shopAddress},
      })
    }
    if(this.props.latitude != nextProps.latitude && this.props.longitude != nextProps.longitude) {
      nextProps.inputFormUpdate({
        formKey: shopGeoInput.formKey,
        stateKey: shopGeoInput.stateKey,
        data: {text:[nextProps.latitude, nextProps.longitude].join(',')},
      })
    }
    if(this.props.currentCity != nextProps.currentCity) {
      nextProps.inputFormUpdate({
        formKey: shopGeoCityInput.formKey,
        stateKey: shopGeoCityInput.stateKey,
        data: {text:nextProps.currentCity},
      })

    }

    if(this.props.currentDistrict != nextProps.currentDistrict) {
      nextProps.inputFormUpdate({
        formKey: shopGeoDistrictInput.formKey,
        stateKey: shopGeoDistrictInput.stateKey,
        data: {text:nextProps.currentDistrict},
      })
    }
  }

  updateShopCategoryContainedTags(shopCategoryId) {
    let shopCategoryContainedTag = []
    if(this.props.allShopCategories && this.props.allShopCategories.length) {
      for(let i = 0; i < this.props.allShopCategories.length; i++) {
        let shopCategory = this.props.allShopCategories[i]
        if(shopCategory.id == shopCategoryId) {
          shopCategoryContainedTag = shopCategory.containedTag
          // console.log('updateShopCategoryContainedTags.=')
          this.setState({
            shopCategoryContainedTag: shopCategoryContainedTag,
          })
          break
        }
      }
    }
  }

  onEditShopBtnPress() {
    if(this.isSubmiting) {
      return
    }
    this.isSubmiting = true
    this.loading = Loading.show()

    this.props.submitFormData({
      formKey: commonForm,
      shopId: this.props.userOwnedShopInfo.id,
      album: this.localAlbumList,
      coverUrl: this.localCoverImgUri,
      submitType: INPUT_FORM_SUBMIT_TYPE.EDIT_SHOP_IFNO,
      success: ()=>{
        this.isSubmiting = false
        Loading.hide(this.loading)
        this.props.fetchUserOwnedShopInfo()
        Toast.show('更新成功', {
          duration: 1500,
          onHidden: () =>{
            if(this.props.popNum && this.props.popNum > 1) {
              Actions.pop({
                popNum: this.props.popNum
              })
            }else {
              Actions.pop()
            }
          }
        })
      },
      error: (error)=>{
        this.isSubmiting = false
        Loading.hide(this.loading)
        Toast.show(error.message || '更新店铺失败')
      }
    })
  }

  onShopBaseInfoWrapLayout(event) {
    if(event.nativeEvent.layout.height) {
      this.shopBaseInfoWrapHeight = event.nativeEvent.layout.height
      this.calNewPos()
    }
  }

  calNewPos() {
    const marginBottomHeight = 10
    const inputWrapHeight = 50
    const coverImageHeight = 200
    if(Platform.OS == 'ios') {
      this.setState({
        shopTagsSelectTop: this.shopBaseInfoWrapHeight + coverImageHeight + inputWrapHeight + marginBottomHeight - this.scrollOffSet + 1
      })
    }else{
      this.setState({
        shopTagsSelectTop: this.shopBaseInfoWrapHeight + coverImageHeight + inputWrapHeight + marginBottomHeight - this.scrollOffSet + 1
      })
    }
  }

  handleOnScroll(e) {
    this.scrollOffSet = e.nativeEvent.contentOffset.y
    this.calNewPos()
  }

  toggleShopTagsSelectShow() {
    this.setState({
      shopTagsSelectShow:!this.state.shopTagsSelectShow
    })
  }

  onTagPress(tag, selected) {
    if(selected) {
      let index = -1
      for(let i = 0; i < this.state.selectedShopTags.length; i++) {
        if(this.state.selectedShopTags[i].id == tag.id) {
          index = i
          break
        }
      }
      if(index >= 0) {
        this.state.selectedShopTags.splice(index, 1)
      }
    }else {
      this.state.selectedShopTags.push(tag)
    }
    this.setState({
      selectedShopTags: this.state.selectedShopTags
    })
  }

  goBack() {
    if(this.props.popNum > 2) {
      Actions.pop({
        popNum: this.props.popNum
      })
    }else {
      Actions.pop()
    }
  }

  editShopCover(){
    Actions.UPDATE_SHOP_COVER_FOR_EDIT_SHOP({
      localCoverImgUri: this.localCoverImgUri
    })
  }

  editShopAlbum(){
    Actions.UPDATE_SHOP_ALBUM_FOR_EDIT_SHOP({
      localAlbumList: this.localAlbumList
    })
  }

  render() {

    const userOwnedShopInfo = this.props.userOwnedShopInfo

    let shopCover = require('../../../assets/images/background_shop.png')
    if(userOwnedShopInfo.coverUrl) {
      shopCover = {uri: userOwnedShopInfo.coverUrl}
    }
    let targetShopCategory = {}
    if(userOwnedShopInfo.targetShopCategory) {
      targetShopCategory = userOwnedShopInfo.targetShopCategory
    }

    if(this.localCoverImgUri) {
      shopCover = {uri: this.localCoverImgUri}
    }

    let albumLen = 0
    let album = userOwnedShopInfo.album || []
    if(this.localAlbumList) {
      albumLen = this.localAlbumList.length
    }else {
      albumLen = album.length
    }

    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => this.goBack()}
          title="店铺管理"
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
        />
        <View style={styles.body}>

          <KeyboardAwareScrollView
            automaticallyAdjustContentInsets={false}
            onScroll={e => this.handleOnScroll(e)}
            scrollEventThrottle={0}
            keyboardShouldPersistTaps={true}
          >
            <View style={{flex:1}}>
              <Image style={{width:PAGE_WIDTH,height: normalizeH(223)}} source={shopCover}/>
              <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(90,90,90,0.5)'}}>
                <TouchableOpacity style={{flex:1}} onPress={()=>{this.editShopCover()}}>
                  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:44,height:44}} source={require("../../../assets/images/edite_pic_44_white.png")}/>
                    <Text style={{marginTop:15,fontSize:15,color:'#fff'}}>编辑封面</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={{height:45}} onPress={()=>{this.editShopAlbum()}}>
                  <View
                    style={{
                    flex:1,
                    flexDirection:'row',
                    justifyContent:'flex-end',
                    alignItems:'center',
                    backgroundColor: 'rgba(245,245,245,0.5)',
                  }}>
                    <Text style={{fontSize:15,color: '#FFFFFF',opacity: 1}}>{`编辑相册  `}</Text>
                    <Icon
                      name="ios-arrow-forward"
                      style={{marginLeft:20,marginRight:15,color:'#FFFFFF',fontSize:17,opacity: 1}}/>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
            <View onLayout={this.onShopBaseInfoWrapLayout.bind(this)} style={styles.shopBaseInfoWrap}>
              <TouchableOpacity onPress={() => Actions.SHOP_ADDRESS_SELECT({
                shopName:this.state.shopName,
                shopAddress:this.state.shopAddress
              })} style={styles.shopBaseInfoLeftWrap}>
                <Text numberOfLines={1} style={styles.shopBaseInfoLeftTitle}>{this.state.shopName}</Text>
                {/*<View style={styles.shopBaseInfoLeftLocBox}>*/}
                  {/*<Image resizeMode='contain' source={require("../../../assets/images/shop_loaction.png")}/>*/}
                  {/*<Text numberOfLines={2} style={styles.shopBaseInfoLeftLocTxt}>{this.state.shopAddress}</Text>*/}
                {/*</View>*/}
              </TouchableOpacity>
            </View>
            <View style={{height:0,width:0}}>
              <CommonTextInput
                {...shopNameInput}
                initValue={this.props.userOwnedShopInfo.shopName}
                outerContainerStyle={{position:'absolute',height:0,width:0}}
                containerStyle={{height:0,width:0}}
                inputStyle={{height:0,width:0}}
                showClear={false}
              />
              <CommonTextInput
                {...shopAddrInput}
                initValue={this.props.userOwnedShopInfo.shopAddress}
                outerContainerStyle={{position:'absolute',height:0,width:0}}
                containerStyle={{height:0,width:0}}
                inputStyle={{height:0,width:0}}
                showClear={false}

              />
              <CommonTextInput
                {...shopGeoInput}
                initValue={[this.props.userOwnedShopInfo.geo.latitude, this.props.userOwnedShopInfo.geo.longitude].join(',')}
                outerContainerStyle={{position:'absolute',height:0,width:0}}
                containerStyle={{height:0,width:0}}
                inputStyle={{height:0,width:0}}
                showClear={false}

              />
              <CommonTextInput
                {...shopGeoCityInput}
                initValue={this.props.userOwnedShopInfo.geoCity}
                outerContainerStyle={{position:'absolute',height:0,width:0}}
                containerStyle={{height:0,width:0}}
                inputStyle={{height:0,width:0}}
                showClear={false}

              />
              <CommonTextInput
                {...shopGeoDistrictInput}
                initValue={this.props.userOwnedShopInfo.geoDistrict}
                outerContainerStyle={{position:'absolute',height:0,width:0}}
                containerStyle={{height:0,width:0}}
                inputStyle={{height:0,width:0}}
                showClear={false}

              />
            </View>
            <View style={styles.inputsWrap}>
              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>店铺类型</Text>
                </View>
                <View style={[styles.inputBox, styles.selectBox]}>
                  <SelectInput
                    {...shopCategoryInput}
                    show={this.state.selectShow}
                    onPress={(e)=>this._onSelectPress(e)}
                    style={{}}
                    styleOption={{height:50}}
                    selectRef="SELECT"
                    overlayPageX={0}
                    overlayPageY={this.state.optionListPos}
                    optionListHeight={240}
                    optionListRef={()=> this._getOptionList('SHOP_CATEGORY_OPTION_LIST')}
                    defaultText={targetShopCategory.text ? targetShopCategory.text :'点击选择店铺类型'}
                    defaultValue={targetShopCategory.id}
                    onSelect={this._onSelectShopCategory.bind(this)}>
                    {this.renderShopCategoryOptions()}
                  </SelectInput>
                </View>
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>店铺标签</Text>
                </View>
                <View style={[styles.inputBox, styles.tagsBox]}>
                  <TagsInput
                    {...tagsInput}
                    onPress={()=>{this.toggleShopTagsSelectShow()}}
                    tags={this.state.selectedShopTags}
                    noCheckInput={true}
                  />
                </View>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>联系电话</Text>
                </View>
                <View style={styles.inputBox}>
                  <PhoneInput
                    {...servicePhoneInput}
                    placeholder="点击输入电话号码"
                    maxLength={15}
                    noFormatPhone={true}
                    outContainerWrap={{borderWidth: 0}}
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                    initValue={this.props.userOwnedShopInfo.contactNumber}
                  />
                </View>
              </View>

              {/*<View style={styles.inputWrap}>*/}
                {/*<View style={styles.inputLabelBox}>*/}
                  {/*<Text style={styles.inputLabel}>备用电话</Text>*/}
                {/*</View>*/}
                {/*<View style={styles.inputBox}>*/}
                  {/*<PhoneInput*/}
                    {/*{...servicePhone2Input}*/}
                    {/*placeholder="备用电话（选填）"*/}
                    {/*maxLength={15}*/}
                    {/*noFormatPhone={true}*/}
                    {/*outContainerWrap={{borderWidth: 0}}*/}
                    {/*containerStyle={styles.containerStyle}*/}
                    {/*inputStyle={styles.inputStyle}*/}
                    {/*initValue={this.props.userOwnedShopInfo.contactNumber2}*/}
                  {/*/>*/}
                {/*</View>*/}
              {/*</View>*/}

              <View style={[styles.inputWrap, styles.serviceTimeWrap]}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>营业时间</Text>
                </View>
                <View style={[styles.inputBox, styles.datePickerBox]}>
                  <ServiceTimePicker
                    {...serviceTimeInput}
                    initValue={this.props.userOwnedShopInfo.openTime}
                    inputStyle={{textAlign:'center'}}
                  />
                </View>
              </View>

              <View style={[styles.inputWrap, styles.ourSpecialWrap, {borderBottomWidth:0}]}>
                <View style={[styles.inputLabelBox, styles.ourSpecialInputLabelBox]}>
                  <Text style={styles.inputLabel}>本店特色</Text>
                </View>
              </View>

              <View style={[styles.inputWrap, {padding:15,paddingTop:0,borderBottomWidth:0}]}>
                <View style={[styles.inputBox]}>
                  <TextAreaInput
                    {...ourSpecialInput}
                    placeholder={"描述店铺特色、优势「小于100字」"}
                    clearBtnStyle={{right: 10,top: 30}}
                    inputStyle={{borderColor: '#bdc6cf', color: '#030303',paddingRight:30}}
                    maxLength={110}
                    initValue={this.props.userOwnedShopInfo.ourSpecial}
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.submitBtnWrap} onPress={() => this.onEditShopBtnPress()}>
                <Text style={styles.submitBtn}>完成</Text>
              </TouchableOpacity>
            </View>

          </KeyboardAwareScrollView>

          {this.state.shopTagsSelectShow &&
            <ShopTagsSelect
              show={this.state.shopTagsSelectShow}
              containerStyle={{top: this.state.shopTagsSelectTop+normalizeH(60)}}
              scrollViewStyle={{height:150}}
              onOverlayPress={()=>{this.toggleShopTagsSelectShow()}}
              tags={this.state.shopCategoryContainedTag}
              selectedTags={this.state.selectedShopTags}
              onTagPress={(tag, selected)=>{this.onTagPress(tag, selected)}}
            />
          }
          <OptionList ref="SHOP_CATEGORY_OPTION_LIST"/>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)
  const allShopCategories = selectShopCategories(state)
  const allShopTags = selectShopTags(state)
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  // console.log('userOwnedShopInfo===', userOwnedShopInfo)
  return {
    isUserLogined: isUserLogined,
    allShopCategories: allShopCategories,
    allShopTags: allShopTags,
    userOwnedShopInfo: userOwnedShopInfo
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitInputData,
  fetchShopCategories,
  fetchShopTags,
  fetchUserOwnedShopInfo,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EditShop)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green,
    paddingTop: 20,
    height: 64,
  },
  headerLeftStyle: {
    color: '#fff',
    fontSize: em(28)
  },
  headerTitleStyle: {
    color: '#fff',
  },
  completeBtnBox: {
    borderWidth: normalizeBorder(),
    borderColor: '#fff',
    padding: 5,
    marginRight: 12
  },
  completeBtn: {
    fontSize: em(17),
    color: '#fff'
  },
  body: {
    marginTop: 64,
    flex: 1,
  },
  inputsWrap: {
    marginBottom: 10,
  },
  inputWrap: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',

    paddingLeft: normalizeW(20),
    borderBottomWidth:normalizeBorder(1),
    borderTopWidth: normalizeBorder(1),
    borderColor: 'rgba(0,0,0,0.05)'
  },
  inputLabelBox: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  inputLabel: {
    fontSize: em(17),
    color: THEME.colors.inputLabel
  },
  inputBox: {
    flex: 1
  },
  tagsBox: {
    justifyContent: 'center',
  },
  containerStyle: {
    paddingRight:0,
  },
  inputInnerBox: {
    height: 50,
    paddingLeft: normalizeW(14),
    justifyContent: 'center'
  },
  inputInnerStyle:{
    fontSize: em(17),
    color: '#333'
  },
  inputStyle:{
    height: 50,
    fontSize: em(17),
    backgroundColor: '#fff',
    borderWidth: 0,
    paddingLeft: 0,
    color: '#333'
  },
  shopBaseInfoWrap: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth:normalizeBorder(1),
    borderTopWidth: normalizeBorder(1),
    borderColor: 'rgba(0,0,0,0.05)'
    // marginBottom: 10
  },
  shopBaseInfoLeftWrap: {
    flex: 1,
  },
  shopBaseInfoLeftTitle: {
    color: '#030303',
    fontSize: em(17),
    // fontStyle: 'boil'
    fontFamily:'.PingFangSC-Semibold',

  },
  shopBaseInfoLeftLocBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginRight:10
  },
  shopBaseInfoLeftLocTxt: {
    marginLeft: 5,
    color: '#8f8e94',
    fontSize: em(17)
  },
  shopBaseInfoRightWrap: {

  },
  defaultPickerStyle: {

  },
  serviceTimeWrap: {
    paddingTop: 5,
    paddingBottom: 5
  },
  datePickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
  },
  ourSpecialWrap: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingRight: 10,
  },
  ourSpecialInputLabelBox: {
    justifyContent: 'flex-start'
  },
  ourSpecialInputBox: {
    paddingLeft: 14,
  },
  albumWrap: {
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  albumTitle: {
    paddingTop: 10,
    paddingLeft: 10,
    fontSize: em(17),
    color: THEME.colors.inputLabel
  },
  uploadAlbum: {
    marginTop: 10
  },
  coverWrap: {
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  submitBtnWrap:{
    flex:1,
    marginTop:normalizeH(15),
    backgroundColor:'#FF7819',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: normalizeH(16),
    paddingBottom: normalizeH(16),
    marginLeft: normalizeW(15),
    marginRight: normalizeW(15),


  },
  submitBtn:{
    fontSize: em(18),
    letterSpacing: -normalizeW(0.4),
    color:'#FFFFFF',
  },


})