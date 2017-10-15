/**
 * Created by yangyang on 2017/10/12.
 */
import React, {PureComponent} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Symbol from 'es6-symbol'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import {Actions} from 'react-native-router-flux'
import THEME from '../../../constants/themes/theme1'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import Popup from '@zzzkk2009/react-native-popup'
import * as AVUtils from '../../../util/AVUtils'
import ImageInput from '../../common/Input/ImageInput'
import {getInputData} from '../../../selector/inputFormSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const shopInfoForm = Symbol('shopInfoForm')
const coverStateKey = Symbol('shopCoverInput')

const shopCoverInput = {
  formKey: shopInfoForm,
  stateKey: coverStateKey,
  type: 'shopCoverInput'
}

const shopAlbumInput = {
  formKey: shopInfoForm,
  stateKey: Symbol('shopAlbumInput'),
  type: 'shopAlbumInput'
}

const serviceTimeInput = {
  formKey: shopInfoForm,
  stateKey: Symbol('serviceTimeInput'),
  type: "serviceTimeInput",
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '服务时间为空'}
  },
}

const servicePhoneInput = {
  formKey: shopInfoForm,
  stateKey: Symbol('servicePhoneInput'),
  type: "servicePhoneInput",
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '服务电话为空'}
  },
}

const ourSpecialInput = {
  formKey: shopInfoForm,
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

const shopCategoryInput = {
  formKey: shopInfoForm,
  stateKey: Symbol('shopCategoryInput'),
  type: "shopCategoryInput",
  checkValid: (data)=>{
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '店铺类型为空'}
  },
}

const tagsInput = {
  formKey: shopInfoForm,
  stateKey: Symbol('tagsInput'),
  type: 'tagsInput',
  checkValid: (data)=>{
    return {isVal: true, errMsg: '验证通过'}
  },
}

class CompleteShopCover extends PureComponent {
  constructor(props) {
    super(props)
    this.localCoverImgUri = ''
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.localCoverImgUri) {
      this.localCoverImgUri = nextProps.localCoverImgUri
    }
  }

  goBack() {
    AVUtils.switchTab('MINE')
  }

  jumpNext() {
    if (!this.localCoverImgUri || this.localCoverImgUri == "") {
      Popup.confirm({
        title: '系统提示',
        content: '请选择一个图片作为店铺封面',
        ok: {
          text: '确定',
          style: {color: THEME.base.mainColor},
          callback: ()=> {
          }
        },
      })
      return
    }
    let payload = {
      form: shopInfoForm,
      inputs: {
        shopCoverInput: shopCoverInput,
        shopAlbumInput: shopAlbumInput,
        serviceTimeInput: serviceTimeInput,
        servicePhoneInput: servicePhoneInput,
        ourSpecialInput: ourSpecialInput,
        shopCategoryInput: shopCategoryInput,
        tagsInput: tagsInput,
      },
    }
    Actions.COMPLETE_SHOP_ABLUM(payload)
  }

  render() {
    let {coverUrl} = this.props
    return (
      <View style={styles.container}>
        <Header
          leftType="text"
          leftText="取消"
          leftPress={() => this.goBack()}
          title="上传店铺封面"
          rightType="none"
        />
        <View style={styles.body}>
          <ImageInput
            {...shopCoverInput}
            containerStyle={{width: PAGE_WIDTH, height: normalizeH(300),borderWidth:0}}
            addImageBtnStyle={{top:0, left: 0, width: PAGE_WIDTH, height: normalizeH(300)}}
            choosenImageStyle={{width: PAGE_WIDTH, height: normalizeH(300)}}
            imageWidth={PAGE_WIDTH*2}
            imageHeight={normalizeH(300)*2}
            addImage={require('../../../assets/images/default_upload.png')}
            closeModalAfterSelectedImg={true}
            initValue={this.localCoverImgUri || coverUrl}
            imageSelectedChangeCallback={(localImgUri)=>{this.localCoverImgUri = localImgUri}}
          />
          <View style={styles.tipView}>
            <Text style={styles.tipText}>点击上方区域，完成店铺封面上传！店铺封面是店铺的脸面，上传漂亮的图片可以给顾客留下好印象哦^_^未完善店铺资料将无法在店铺列表中显示!</Text>
          </View>
          <View style={{marginTop: normalizeH(50)}}>
            <CommonButton title="下一步" onPress={() => this.jumpNext()}/>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, shopInfoForm, coverStateKey)
  return {
    coverUrl: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CompleteShopCover)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
  },
  tipView: {
    marginTop: normalizeH(30),
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
  },
  tipText: {
    fontSize: em(15),
    color: THEME.base.deepColor,
    lineHeight: normalizeH(25),
  },
})