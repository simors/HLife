/**
 * Created by wanpeng on 2017/6/8.
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
  Keyboard,
  TextInput,
  Modal,

} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImageInput from '../common/Input/ImageInput'
import CommonTextInput from '../common/Input/CommonTextInput'
import ArticleEditor from '../common/Input/ArticleEditor'
import Symbol from 'es6-symbol'
import Loading from '../common/Loading'
import {submitShopGood} from '../../action/shopAction'
import ViewPager from '../common/ViewPager'




let shopGoodForm = Symbol('shopGoodForm')
const shopGoodContent = {
  formKey: shopGoodForm,
  stateKey: Symbol('shopGoodContent'),
  type: 'shopGoodContent',
  checkValid: (data) => {
    let textLen = 0
    if (data && data.text) {
      data.text.forEach((content) => {
        if (content.type === 'COMP_TEXT') {
          textLen += content.text.length
        }
      })
    }
    if (textLen >= 20) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '产品介绍不少于20字'}
  },
}

const shopGoodCover = {
  formKey: shopGoodForm,
  stateKey: Symbol('shopGoodCover'),
  type: 'shopGoodCover',
  checkValid: (data) => {
    if (data && data.text) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '请输入封面'}
  },
}

const title = {
  formKey: shopGoodForm,
  stateKey: Symbol('title'),
  checkValid: (data) => {
    if (data && data.text) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '请输入标题'}
  },
  type: 'title',
}


const PAGE_WIDTH = Dimensions.get('window').width

const rteHeight = {
  height: normalizeH(64),
}

const wrapHeight = normalizeH(373)

class PublishShopGood extends Component {
  constructor(props) {
    super(props)
    this.localRichTextImagesUrls = []
    this.isPublishing = false
    this.albums = []
    this.state = {
      extraHeight: rteHeight.height,
      headerHeight: wrapHeight,
      showPriceModal: false,
      price: undefined,
      originalPrice: undefined,

    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.albums) {
      this.albums = nextProps.albums
    }
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

  getRichTextImages(images) {
    this.localRichTextImagesUrls = images
  }

  renderRichText() {
    return (
      <ArticleEditor
        {...shopGoodContent}
        wrapHeight={this.state.extraHeight}
        toolbarController={true}
        renderCustomToolbar={() => {
          return this.renderArticleEditorToolbar({
            flex:1,
            width:64,
          })
        }}
        getImages={(images) => this.getRichTextImages(images)}
        onFocusEditor={() => {this.setState({headerHeight: 0})}}
        onBlurEditor={() => {this.setState({headerHeight: wrapHeight})}}
        placeholder="描述一下商品详情"
        mode="modify"
      />
    )
  }

  submitForm() {
    if (this.albums.length == 0) {
      Toast.show('请设置商品相册')
      this.isPublishing = false
      return
    }
    if (this.state.price == undefined) {
      Toast.show('请输入商品价格')
      this.isPublishing = false
      return
    }
    if (this.state.originalPrice == undefined) {
      Toast.show('请输入商品原价')
      this.isPublishing = false
      return
    }
    this.loading = Loading.show()
    this.props.submitShopGood({
      shopId: this.props.shopId,
      formKey: shopGoodForm,
      localRichTextImagesUrls: this.localRichTextImagesUrls,
      albums: this.albums,
      price: this.state.price,
      originalPrice: this.state.originalPrice,
      success: ()=>{
        this.isPublishing = false
        Loading.hide(this.loading)
        Toast.show('商品发布成功')
        Actions.MY_SHOP_INDEX({type:'replace'})
      },
      error: (err)=>{
        this.isPublishing = false
        Loading.hide(this.loading)
        Toast.show(err.message)
      }
    })
  }

  publishGood() {
    if(this.isPublishing){
      return
    }
    this.isPublishing = true

    this.submitForm()
  }

  renderAlbum() {
    if(this.albums && this.albums.length > 0) {
      return(
        <TouchableOpacity onPress={()=>{Actions.UPDATE_SHOP_GOOD_ALBUM({albums: this.albums})}}>
          <Image style={{width:PAGE_WIDTH,height: normalizeH(264)}} source={{uri: this.albums[0]}}/>
        </TouchableOpacity>
      )
    } else {
      return(
        <View>
          <Image style={{width:PAGE_WIDTH,height: normalizeH(264)}} source={require('../../assets/images/background_good.png')}/>
          <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(90,90,90,0.5)'}}>
            <TouchableOpacity style={{flex:1}} onPress={()=>{Actions.UPDATE_SHOP_GOOD_ALBUM({albums: this.albums})}}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Image style={{width:44,height:44}} source={require("../../assets/images/edite_pic_44_white.png")}/>
                <Text style={{marginTop:15,fontSize:15,color:'#fff'}}>上传商品相册</Text>
              </View>
            </TouchableOpacity>

          </View>

        </View>
      )
    }
  }

  openPriceModal() {
    this.setState({showPriceModal: true})
  }

  renderPriceModal() {
    return (
      <View>
        <Modal
          visible={this.state.showPriceModal}
          transparent={true}
          animationType='fade'
          onRequestClose={()=>{this.setState({showPriceModal: false})}}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View style={{backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center'}}>
              <View style={{paddingBottom: normalizeH(20), paddingTop: normalizeH(20)}}>
                <Text style={{fontSize: em(20), color: '#5A5A5A', fontWeight: 'bold'}}>设置商品价格</Text>
              </View>
              <View style={{paddingBottom: normalizeH(15), flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: em(17), color: THEME.base.mainColor, paddingRight: 8}}>¥</Text>
                <TextInput
                  placeholder='价格'
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => this.setState({price: text})}
                  value={this.state.price}
                  keyboardType="numeric"
                  maxLength={6}
                  style={{
                    height: normalizeH(42),
                    fontSize: em(17),
                    textAlignVertical: 'center',
                    borderColor: '#0f0f0f',
                    width: normalizeW(100),
                  }}
                />
                <Text style={{fontSize: em(17), color: '#5A5A5A', paddingLeft: 8}}>元</Text>
              </View>
              <View style={{paddingBottom: normalizeH(15), flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: em(17), color: THEME.base.mainColor, paddingRight: 8}}>¥</Text>
                <TextInput
                  placeholder='原价'
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => this.setState({originalPrice: text})}
                  value={this.state.originalPrice}
                  keyboardType="numeric"
                  maxLength={6}
                  style={{
                    height: normalizeH(42),
                    fontSize: em(17),
                    textAlignVertical: 'center',
                    borderColor: '#0f0f0f',
                    width: normalizeW(100),
                  }}
                />
                <Text style={{fontSize: em(17), color: '#5A5A5A', paddingLeft: 8}}>元</Text>
              </View>
              <View style={{width: PAGE_WIDTH-100, height: normalizeH(50), padding: 0, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderColor: '#F5F5F5'}}>
                <View style={{flex: 1, borderRightWidth: 1, borderColor: '#F5F5F5'}}>
                  <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => this.setState({showPriceModal: false})}>
                    <Text style={{fontSize: em(17), color: '#5A5A5A'}}>取消</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => this.setState({showPriceModal: false})}>
                    <Text style={{fontSize: em(17), color: THEME.base.mainColor}}>确定</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => {Actions.pop()}}
          title="编辑商品"
          rightType="text"
          rightText="发布"
          rightPress={() => {this.publishGood()}}
        />
        <View style={styles.body}>

          <View style={{height: this.state.headerHeight, overflow: 'hidden'}}
                onLayout={(event) => {this.setState({extraHeight: rteHeight.height + event.nativeEvent.layout.height})}}>
            <KeyboardAwareScrollView
              style={{flex: 1}}
              automaticallyAdjustContentInsets={false}
              scrollEventThrottle={0}
              keyboardShouldPersistTaps={true}>
              {this.renderAlbum()}
              <View style={styles.introWrap}>
                <View style={styles.coverBox}>
                  <ImageInput
                    {...shopGoodCover}
                    imageWidth={Math.floor(normalizeW(169)) * 2}
                    imageHeight={Math.floor(normalizeW(169)) * 2}
                    containerStyle={{width: normalizeW(80), height: normalizeW(80),borderWidth:0}}
                    addImageBtnStyle={{top:0, left: 0, width: normalizeW(80), height: normalizeW(80)}}
                    choosenImageStyle={{width: normalizeW(80), height: normalizeW(80)}}
                    addImage={require('../../assets/images/upload_pic.png')}
                    closeModalAfterSelectedImg={true}
                  />
                </View>
                <View style={styles.introBox}>
                  <View style={styles.titleBox}>
                    <Text style={styles.titleLabel}>标题</Text>
                    <CommonTextInput
                      {...title}
                      placeholder='商品或服务名称(20字内)'
                      maxLength={120}
                      outerContainerStyle={[styles.titleInput, {backgroundColor: '#fff', borderWidth: 0}]}
                      inputStyle={{backgroundColor: '#fff'}}
                      showClear={false}
                    />
                  </View>
                  <TouchableOpacity style={styles.priceBox} onPress={() => {this.openPriceModal()}}>
                    <View style={styles.promotingPriceBox}>
                      <Text style={styles.priceLabel}>价格</Text>
                      <Text style={{color:'#F56A23',marginLeft:3}}>￥</Text>

                      <Text>
                        {this.state.price}
                      </Text>
                    </View>

                    <View style={styles.originalPriceBox}>
                      <Text style={styles.priceLabel}>原价</Text>
                      <Text style={{color:'#aaa',marginLeft:3}}>￥</Text>
                      <Text>
                        {this.state.originalPrice}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAwareScrollView>

          </View>
          {this.renderRichText()}

        </View>
        {this.renderPriceModal()}
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitShopGood
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishShopGood)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  introWrap: {
    flex: 1,
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
  priceBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: normalizeH(10)
  },
  priceLabel: {
    fontSize: em(15),
    color: '#aaa'
  },
  promotingPriceInput: {
    flex: 1,
    paddingLeft: 6,
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
