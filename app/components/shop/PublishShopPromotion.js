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
  TextInput
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import * as authSelector from '../../selector/authSelector'
import Symbol from 'es6-symbol'
import {} from '../../action/shopAction'
import {submitFormData,INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import CommonTextInput from '../common/Input/CommonTextInput'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import ImageInput from '../common/Input/ImageInput'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class PublishShopPromotion extends Component {
  constructor(props) {
    super(props)

    this.toolBarContentTypes = {
      DEFAULT: 'DEFAULT_TYPE_INPUT',
      CUSTOM: 'CUSTOM_TYPE_INPUT',
    }

    this.state = {
      form: {
        type: '折扣',
        typeDesc: '',
        coverUrl: '',
        title: '',
        promotingPrice: 0.00,
        originalPrice: 0.00,

      },
      typeDescPlaceholder: '例:店庆活动,全场七折起(15字内)',
      toolBarContentType: this.toolBarContentTypes.DEFAULT,
      toolBarInputFocusNum: 0,
      shouldUploadCover: false,
      types: [
        {
          id: 0,
          type: '折扣',
          containerStyle: 'activeType',
          textStyle: 'activeTypeTxt',
          placeholderText: '例:店庆活动,全场七折起(15字内)'
        },
        {
          id: 1,
          type: '预售',
          containerStyle: 'defaultType',
          textStyle: 'defaultTypeTxt',
          placeholderText: '例:3月15号到货(15字内)'
        },
        {
          id: 2,
          type: '限时购',
          containerStyle: 'defaultType',
          textStyle: 'defaultTypeTxt',
          placeholderText: '例:每天下午18:00~22:00(15字内)'
        },
        {
          id: 3,
          type: '自定义',
          containerStyle: 'customType',
          textStyle: 'customTypeTxt',
          placeholderText: '用简短的文字描述活动(15字内)'
        },
      ]
    }

  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentDidMount() {
    this.showToolBarInput()
  }

  componentWillReceiveProps(nextProps) {

  }

  showToolBarInput(type) {
    if(this.state.toolBarInputFocusNum) {
      if(type == this.toolBarContentTypes.CUSTOM) {
        this.showCustomTypeInputToolbar(()=>{
          setTimeout(()=>{
            if(this.state.toolBarInputFocusNum > 1) {
              this.subtractToolBarInputFocusNum()
            }
          }, 100)
        })
      }else {
        this.showDefaultTypeInputToolbar(()=>{
          setTimeout(()=>{
            if(this.state.toolBarInputFocusNum > 1) {
              this.subtractToolBarInputFocusNum()
            }
          }, 100)
        })
      }
    }else {
      this.addToolBarInputFocusNum(()=>{
        if(type == this.toolBarContentTypes.CUSTOM) {
          this.showCustomTypeInputToolbar(()=>{
            setTimeout(()=>{
              if(this.state.toolBarInputFocusNum > 1) {
                this.subtractToolBarInputFocusNum()
              }
            }, 100)
          })
        }else {
          this.showDefaultTypeInputToolbar(()=>{
            setTimeout(()=>{
              if(this.state.toolBarInputFocusNum > 1) {
                this.subtractToolBarInputFocusNum()
              }
            }, 100)
          })
        }
      })
    }
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
        item.containerStyle = 'activeType'
        item.textStyle = 'activeTypeTxt'

        if(item.id == 3) {
          this.setState({
            form: {
              ...this.state.form,
              type: item.type,
              typeDesc: ''
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
              type: item.type,
              typeDesc: ''
            },
            toolBarContentType: this.toolBarContentTypes.DEFAULT,
            typeDescPlaceholder: item.placeholderText
          }, ()=>{
            this.showToolBarInput()
          })
        }
      }else {
        if(item.id == 3) {
          item.type = '自定义'
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
    dismissKeyboard()
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
    }else if(this.state.form.typeDesc.length > 15) {
      Toast.show('类型描述长度不能超过15个字')
      return false
    }
    return true
  }

  renderToolBarContent() {
    // console.log('renderToolBarContent===', this.state.toolBarInputFocusNum)
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
    return null
  }

  addToolBarInputFocusNum(callback, num=1) {
    this.setState({
      toolBarInputFocusNum: this.state.toolBarInputFocusNum + num
    }, ()=>{
      // console.log('addToolBarInputFocusNum.this.state=', this.state)
      callback && callback()
    })
  }

  subtractToolBarInputFocusNum(callback, num=1) {
    this.setState({
      toolBarInputFocusNum: this.state.toolBarInputFocusNum - num
    },()=>{
      // console.log('subtractToolBarInputFocusNum.this.state=', this.state)
      callback && callback()
    })
  }

  renderToolBarDefaultTypeInput() {
    return (
      <View style={styles.toolbarDefaultTypeInputContainer}>
        <TextInput
          ref={(input) =>{this._typeDefaultDescInput = input}}
          placeholder={this.state.typeDescPlaceholder}
          maxLength={90}
          style={styles.toolbarInputStyle}
          enablesReturnKeyAutomatically={true}
          blurOnSubmit={true}
          underlineColorAndroid="transparent"
          onBlur={()=>{this.subtractToolBarInputFocusNum()}}
          onFocus={()=>{this.addToolBarInputFocusNum()}}
          onChangeText={(text) => {
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
              style={[styles.toolbarInputStyle, styles.typeNameInputStyle]}
              enablesReturnKeyAutomatically={true}
              blurOnSubmit={true}
              underlineColorAndroid="transparent"
              onBlur={()=>{this.subtractToolBarInputFocusNum()}}
              onFocus={()=>{this.addToolBarInputFocusNum()}}
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
            maxLength={90}
            style={[styles.toolbarInputStyle, styles.typeDescInputStyle]}
            enablesReturnKeyAutomatically={true}
            blurOnSubmit={true}
            underlineColorAndroid="transparent"
            onBlur={()=>{this.subtractToolBarInputFocusNum()}}
            onFocus={()=>{this.addToolBarInputFocusNum()}}
            onChangeText={(text) => {
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

  onShowTypeDescPress() {
    this.state.types.map((item, index) => {
      if(item.containerStyle == 'activeType' && item.id == 3) { //自定义
        this.showToolBarInput(this.toolBarContentTypes.CUSTOM)
      }else {
        this.showToolBarInput()
      }
    })
  }

  uploadCoverCallback(leanHeadImgUrl) {

  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="发布活动"
          headerContainerStyle={{backgroundColor:'#f9f9f9'}}
        />
        <View style={styles.body}>
          <View style={styles.contentContainer}>
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
                  addImage={require('../../assets/images/upload_pic.png')}
                  closeModalAfterSelectedImg={true}
                  imageSelectedChangeCallback={(localImgUri)=>{this.localCoverImgUri = localImgUri}}
                  shouldUploadImage={this.state.shouldUploadCover}
                  uploadImageCallback={(leanCoverImgUrl)=>{this.uploadCoverCallback(leanCoverImgUrl)}}
                />
              </View>
              <View style={styles.introBox}>
                <View style={styles.titleBox}>
                  <Text style={styles.titleLabel}>标题</Text>
                  <TextInput
                    placeholder='商品或服务名称(20字内)'
                    maxLength={120}
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
                    <TextInput
                      placeholder='￥0.00'
                      placeholderTextColor="#F56A23"
                      maxLength={7}
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
                    <TextInput
                      placeholder='￥0.00'
                      placeholderTextColor="#aaa"
                      maxLength={7}
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
        </View>

        <KeyboardAwareToolBar
          initKeyboardHeight={-100}
        >
          {this.renderToolBarContent()}
        </KeyboardAwareToolBar>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)

  return {
    isUserLogined: isUserLogined
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishShopPromotion)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
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
    borderWidth: normalizeBorder(),
    borderColor: '#b2b2b2'
  },
  typeDescTxt: {
    color: '#b2b2b2',
    fontSize: 15
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
    fontSize: 15
  },
  activeType: {
    backgroundColor: '#FF7819'
  },
  activeTypeTxt: {
    color: 'white',
    fontSize: 15
  },
  defaultType: {
    backgroundColor: '#aaa'
  },
  defaultTypeTxt: {
    color: 'white',
    fontSize: 15
  },
  customType: {
    backgroundColor: '#f5f5f5'
  },
  customTypeTxt: {
    color: '#aaa',
    fontSize: 15
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
    fontSize: 15
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
    fontSize: 17,
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
    fontSize: 15,
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