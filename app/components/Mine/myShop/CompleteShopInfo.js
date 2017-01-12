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
import {bindActionCreators} from 'redux'
import Symbol from 'es6-symbol'
import {Actions} from 'react-native-router-flux'
import {
  Option,
  OptionList,
  SelectInput
} from '../../common/CommonSelect'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DatePicker from 'react-native-datepicker'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as appConfig from '../../../constants/appConfig'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import PhoneInput from '../../common/Input/PhoneInput'
import TextAreaInput from '../../common/Input/TextAreaInput'
import Checkbox from '../../common/Input/Checkbox'
import TagsInput from '../../common/Input/TagsInput'
import ShopTagsSelect from './ShopTagsSelect'
import CommonTextInput from './ShopTagsSelect'
import * as MyShopTestData from './MyShopTestData'
import ImageGroupInput from '../../common/Input/ImageGroupInput'
import ServiceTimePicker from '../../common/Input/ServiceTimePicker'
import {fetchShopTags, fetchUserOwnedShopInfo} from '../../../action/shopAction'
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import * as Toast from '../../common/Toast'
import * as authSelector from '../../../selector/authSelector'
import {selectShopCategories} from '../../../selector/configSelector'
import {selectShopTags, selectUserOwnedShopInfo} from '../../../selector/shopSelector'
import {fetchShopCategories} from '../../../action/configAction'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')

const shopCategoryInput = {
  formKey: commonForm,
  stateKey: Symbol('shopCategoryInput'),
  type: "shopCategoryInput",
}
const serviceTimeInput = {
  formKey: commonForm,
  stateKey: Symbol('serviceTimeInput'),
  type: "serviceTimeInput",
}
const servicePhoneInput = {
  formKey: commonForm,
  stateKey: Symbol('servicePhoneInput'),
  type: "servicePhoneInput",
}
const ourSpecialInput = {
  formKey: commonForm,
  stateKey: Symbol('ourSpecialInput'),
  type: 'ourSpecialInput'
}
const shopAlbumInput = {
  formKey: commonForm,
  stateKey: Symbol('shopAlbumInput'),
  type: 'shopAlbumInput'
}
const shopCoverInput = {
  formKey: commonForm,
  stateKey: Symbol('shopCoverInput'),
  type: 'shopCoverInput'
}

const tagsInput = {
  formKey: commonForm,
  stateKey: Symbol('tagsInput'),
  type: 'tagsInput'
}

class CompleteShopInfo extends Component {
  constructor(props) {
    super(props)

    if(Platform.OS == 'ios') {
      this.state = {
        selectShow: false,
        shopTagsSelectShow: false,
        optionListPos: 179,
        shopTagsSelectTop: 219,
        selectedShopTags: []
      }
    }else{
      this.state = {
        selectShow: false,
        shopTagsSelectShow: false,
        optionListPos: 159,
        shopTagsSelectTop: 199,
        selectedShopTags: []
      }
    }

    this.headerHeight = 44
    if(Platform.OS == 'ios') {
      this.headerHeight = 64
    }
    this.shopBaseInfoWrapHeight = 64
    this.scrollOffSet = 0

  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.fetchUserOwnedShopInfo()
      this.props.fetchShopCategories()
      this.props.fetchShopTags()
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {

    })
  }

  submitSuccessCallback() {
    Actions.MINE()
  }

  submitErrorCallback(error) {

    Toast.show(error.message)
  }

  onButtonPress = () => {
    this.props.submitFormData({
      formKey: commonForm,
      shopId: this.props.userOwnedShopInfo.id,
      submitType: INPUT_FORM_SUBMIT_TYPE.COMPLETE_SHOP_INFO,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  rightComponent() {
    return (
      <View style={styles.completeBtnBox}>
        <Text style={styles.completeBtn}>完成</Text>
      </View>
    )
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
    this.setState({
      selectShow: !this.state.selectShow
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

  onShopBaseInfoWrapLayout(event) {
    if(event.nativeEvent.layout.height) {
      this.shopBaseInfoWrapHeight = event.nativeEvent.layout.height
      this.calNewPos()
    }
  }

  calNewPos() {
    const marginBottomHeight = 10
    const inputWrapHeight = 40
    if(Platform.OS == 'ios') {
      this.setState({
        optionListPos: this.headerHeight + this.shopBaseInfoWrapHeight + inputWrapHeight + marginBottomHeight - this.scrollOffSet + 1,
        shopTagsSelectTop: this.headerHeight + this.shopBaseInfoWrapHeight + inputWrapHeight*2 + marginBottomHeight - this.scrollOffSet + 1
      })
    }else{
      this.setState({
        optionListPos: this.headerHeight + this.shopBaseInfoWrapHeight + inputWrapHeight + marginBottomHeight - this.scrollOffSet + 1,
        shopTagsSelectTop: this.headerHeight + this.shopBaseInfoWrapHeight + inputWrapHeight*2 + marginBottomHeight - this.scrollOffSet + 1
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

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="text"
          leftText="取消"
          leftPress={() => Actions.pop()}
          title="完善店铺资料"
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
          rightComponent={()=>this.rightComponent()}
          rightPress={()=>{this.onButtonPress()}}
        />
        <View style={styles.body}>

          <KeyboardAwareScrollView
            keyboardDismissMode='on-drag'
            automaticallyAdjustContentInsets={false}
            onScroll={e => this.handleOnScroll(e)}
            scrollEventThrottle={0}
          >
            <View onLayout={this.onShopBaseInfoWrapLayout.bind(this)} style={styles.shopBaseInfoWrap}>
              <View style={styles.shopBaseInfoLeftWrap}>
                <Text numberOfLines={1} style={styles.shopBaseInfoLeftTitle}>{this.props.userOwnedShopInfo.shopName}</Text>
                <View style={styles.shopBaseInfoLeftLocBox}>
                  <Image source={require("../../../assets/images/shop_loaction.png")}/>
                  <Text numberOfLines={2} style={styles.shopBaseInfoLeftLocTxt}>{this.props.userOwnedShopInfo.shopAddress}</Text>
                </View>
              </View>
              <View style={styles.shopBaseInfoRightWrap}>
                <Image source={require("../../../assets/images/shop_certified.png")}/>
              </View>
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
                    selectRef="SELECT"
                    overlayPageX={0}
                    overlayPageY={this.state.optionListPos}
                    optionListHeight={240}
                    optionListRef={()=> this._getOptionList('SHOP_CATEGORY_OPTION_LIST')}
                    defaultText='点击选择店铺类型'
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
                  />
                </View>
              </View>

              <View style={[styles.inputWrap, styles.serviceTimeWrap]}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>营业时间</Text>
                </View>
                <View style={[styles.inputBox, styles.datePickerBox]}>
                  <ServiceTimePicker 
                    {...serviceTimeInput}
                  />
                </View>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.inputLabelBox}>
                  <Text style={styles.inputLabel}>服务电话</Text>
                </View>
                <View style={styles.inputBox}>
                  <PhoneInput
                    {...servicePhoneInput}
                    placeholder="点击输入电话号码"
                    containerStyle={styles.containerStyle}
                    inputStyle={styles.inputStyle}
                    clearBtnStyle={{top:6}}
                  />
                </View>
              </View>

              <View style={[styles.inputWrap, styles.ourSpecialWrap]}>
                <View style={[styles.inputLabelBox, styles.ourSpecialInputLabelBox]}>
                  <Text style={styles.inputLabel}>本店特色</Text>
                </View>
                <View style={[styles.inputBox, styles.ourSpecialInputBox]}>
                  <TextAreaInput
                    {...ourSpecialInput}
                    placeholder={"描述店铺特色、优势「小于100字」"}
                    clearBtnStyle={{right: 10,top: 30}}
                    inputStyle={{borderColor: '#bdc6cf', color: '#030303',paddingRight:30}}
                    maxLength={100}
                  />
                </View>
              </View>

            </View>

            <View style={styles.coverWrap}>
              <Text style={styles.albumTitle}>封面图片</Text>
              <View style={styles.uploadAlbum}>
                <ImageGroupInput
                  {...shopCoverInput}
                  number={1}
                  imageLineCnt={3}
                />
              </View>
            </View>

            <View style={styles.albumWrap}>
              <Text style={styles.albumTitle}>店铺相册</Text>
              <View style={styles.uploadAlbum}>
                <ImageGroupInput
                  {...shopAlbumInput}
                  number={9}
                  imageLineCnt={3}
                />
              </View>
            </View>

          </KeyboardAwareScrollView>

          <OptionList ref="SHOP_CATEGORY_OPTION_LIST"/>

          <ShopTagsSelect
            show={this.state.shopTagsSelectShow}
            containerStyle={{top: this.state.shopTagsSelectTop}}
            tagsContainerStyle={{height:280}}
            onOverlayPress={()=>{this.toggleShopTagsSelectShow()}}
            tags={this.props.allShopTags}
            selectedTags={this.state.selectedShopTags}
            onTagPress={(tag, selected)=>{this.onTagPress(tag, selected)}}
          />

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
  console.log('userOwnedShopInfo===', userOwnedShopInfo)
  console.log('isUserLogined===', isUserLogined)
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
  fetchUserOwnedShopInfo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CompleteShopInfo)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green,
    ...Platform.select({
      ios: {
        paddingTop: 20,
        height: 64
      },
      android: {
        height: 44
      }
    }),
  },
  headerLeftStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  headerTitleStyle: {
    color: '#fff',
  },
  completeBtnBox: {
    borderWidth: normalizeBorder(),
    borderColor: '#fff',
    padding: 5,
  },
  completeBtn: {
    fontSize: em(17),
    color: '#fff'
  },
  body: {
    ...Platform.select({
      ios: {
        paddingTop: 64,
      },
      android: {
        paddingTop: 44
      }
    }),
    flex: 1,
  },
  inputsWrap: {
    marginBottom: 10,
  },
  inputWrap: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.gray,
    paddingLeft: normalizeW(20),
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
  containerStyle: {
    paddingRight:0,
  },
  inputStyle:{
    height: normalizeH(44),
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
    marginBottom: 10
  },
  shopBaseInfoLeftWrap: {
    flex: 1,
  },
  shopBaseInfoLeftTitle: {
    color: '#030303',
    fontSize: em(17)
  },
  shopBaseInfoLeftLocBox: {
    flexDirection: 'row',
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
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
  },
  ourSpecialInputLabelBox: {
    justifyContent: 'flex-start'
  },
  ourSpecialInputBox: {
    paddingLeft: 14,
  },
  albumWrap: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  albumTitle: {
    fontSize: em(17),
    color: THEME.colors.inputLabel
  },
  uploadAlbum: {
    marginTop: 10
  },
  coverWrap: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff'
  },


})