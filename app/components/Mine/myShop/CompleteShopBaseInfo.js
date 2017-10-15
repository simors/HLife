/**
 * Created by yangyang on 2017/10/14.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  InteractionManager,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {Actions} from 'react-native-router-flux'
import THEME from '../../../constants/themes/theme1'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import {Option, OptionList, SelectInput} from '../../common/CommonSelect'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TagsInput from '../../common/Input/TagsInput'
import ShopTagsSelect from './ShopTagsSelect'
import PhoneInput from '../../common/Input/PhoneInput'
import TextAreaInput from '../../common/Input/TextAreaInput'
import ServiceTimePicker from '../../common/Input/ServiceTimePicker'
import {selectShopCategories} from '../../../selector/configSelector'
import {selectShopTags} from '../../../selector/shopSelector'
import {getInputData} from '../../../selector/inputFormSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class CompleteShopBaseInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectShow: false,
      shopTagsSelectShow: false,
      optionListPos: normalizeH(50),
      shopTagsSelectTop: normalizeH(100),
      selectedShopTags: [],
      shopCategoryContainedTag: [],
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

  updateShopCategoryContainedTags(shopCategoryId) {
    let shopCategoryContainedTag = []
    if(this.props.allShopCategories && this.props.allShopCategories.length) {
      for(let i = 0; i < this.props.allShopCategories.length; i++) {
        let shopCategory = this.props.allShopCategories[i]
        if(shopCategory.id == shopCategoryId) {
          shopCategoryContainedTag = shopCategory.containedTag
          this.setState({
            shopCategoryContainedTag: shopCategoryContainedTag,
          })
          break
        }
      }
    }
  }

  render() {
    let {inputs, serviceTimeInput, servicePhoneInput, ourSpecialInput} = this.props
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="设置店铺基本信息"
          rightType="none"
        />
        <View style={styles.body}>
          <KeyboardAwareScrollView
            automaticallyAdjustContentInsets={false}
            keyboardShouldPersistTaps={true}
            scrollEventThrottle={0}
            keyboardDismissMode="interactive"
            style={{flex: 1}}
          >
            <View style={styles.inputWrap}>
              <View style={styles.inputLabelBox}>
                <Text style={styles.inputLabel}>店铺类型</Text>
              </View>
              <View style={styles.inputBox}>
                <SelectInput
                  {...inputs.shopCategoryInput}
                  show={this.state.selectShow}
                  onPress={(e)=>this._onSelectPress(e)}
                  styleOption={{height:normalizeH(50)}}
                  selectRef="SELECT"
                  overlayPageX={0}
                  overlayPageY={this.state.optionListPos}
                  optionListHeight={normalizeH(260)}
                  optionListRef={()=> this._getOptionList('SHOP_CATEGORY_OPTION_LIST')}
                  defaultText={'点击选择店铺类型'}
                  defaultValue={0}
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
                  {...inputs.tagsInput}
                  onPress={()=>{this.toggleShopTagsSelectShow()}}
                  tags={this.state.selectedShopTags}
                  containerStyle={{height:50}}
                  noCheckInput={true}
                />
              </View>
            </View>

            <View style={styles.inputWrap}>
              <View style={styles.inputLabelBox}>
                <Text style={styles.inputLabel}>服务电话</Text>
              </View>
              <View style={styles.inputBox}>
                <PhoneInput
                  {...inputs.servicePhoneInput}
                  placeholder="点击店铺电话号码"
                  maxLength={15}
                  noFormatPhone={true}
                  outContainerWrap={{borderWidth: 0}}
                  containerStyle={styles.containerStyle}
                  inputStyle={styles.inputStyle}
                  initValue={servicePhoneInput || undefined}
                />
              </View>
            </View>

            <View style={[styles.inputWrap, styles.serviceTimeWrap]}>
              <View style={styles.inputLabelBox}>
                <Text style={styles.inputLabel}>营业时间</Text>
              </View>
              <View style={[styles.inputBox, styles.datePickerBox]}>
                <ServiceTimePicker
                  {...inputs.serviceTimeInput}
                  initValue={serviceTimeInput || undefined}
                />
              </View>
            </View>

            <View style={[styles.inputWrap, styles.ourSpecialWrap, {borderBottomWidth:0}]}>
              <View style={[styles.inputLabelBox, styles.ourSpecialInputLabelBox]}>
                <Text style={styles.inputLabel}>本店特色</Text>
              </View>
            </View>

            <View style={[styles.inputWrap, styles.inputArea]}>
              <View style={[styles.inputBox]}>
                <TextAreaInput
                  {...inputs.ourSpecialInput}
                  placeholder={"描述店铺特色、优势「小于100字」"}
                  clearBtnStyle={{right: 10,top: 30}}
                  inputStyle={{borderColor: '#bdc6cf', color: '#030303',paddingRight:normalizeW(30)}}
                  maxLength={110}
                  initValue={ourSpecialInput || undefined}
                />
              </View>
            </View>

          </KeyboardAwareScrollView>

          <View style={styles.nextBtnView}>
            <CommonButton title="提交" />
          </View>

          {this.state.shopTagsSelectShow &&
            <ShopTagsSelect
              show={this.state.shopTagsSelectShow}
              containerStyle={{top: this.state.shopTagsSelectTop}}
              scrollViewStyle={{height: normalizeH(150)}}
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
  let {inputs} = ownProps
  let serviceTimeInput = getInputData(state, ownProps.form, inputs.serviceTimeInput.stateKey)
  let servicePhoneInput = getInputData(state, ownProps.form, inputs.servicePhoneInput.stateKey)
  let ourSpecialInput = getInputData(state, ownProps.form, inputs.ourSpecialInput.stateKey)

  const allShopCategories = selectShopCategories(state)
  const allShopTags = selectShopTags(state)
  return {
    allShopCategories: allShopCategories,
    allShopTags: allShopTags,
    serviceTimeInput: serviceTimeInput.text,
    servicePhoneInput: servicePhoneInput.text,
    ourSpecialInput: ourSpecialInput.text,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CompleteShopBaseInfo)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    justifyContent: 'space-between',
  },
  nextBtnView: {
    height: normalizeH(80),
    marginBottom: 0,
    justifyContent: 'center',
  },
  inputWrap: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#F5F5F5',
    paddingLeft: normalizeW(20),
    height: normalizeH(50),
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
  inputStyle:{
    height: normalizeH(50),
    fontSize: em(17),
    backgroundColor: '#fff',
    borderWidth: 0,
    paddingLeft: 0,
    color: '#333'
  },
  datePickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: normalizeW(14),
  },
  ourSpecialWrap: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingRight: 10,
  },
  ourSpecialInputLabelBox: {
    justifyContent: 'flex-start'
  },
  inputArea: {
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    paddingTop:0,
    borderBottomWidth:0,
    height: normalizeH(120),
  },
})