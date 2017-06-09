/**
 * Created by wanpeng on 2017/6/9.
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
  TextInput
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as Toast from '../../common/Toast'
import ImageInput from '../../common/Input/ImageInput'
import CommonTextInput from '../../common/Input/CommonTextInput'
import ArticleEditor from '../../common/Input/ArticleEditor'
import Symbol from 'es6-symbol'
import Loading from '../../common/Loading'
import {modifyShopGoods} from '../../../action/shopAction'
import {selectGoodsById} from '../../../selector/shopSelector'



let shopGoodEditForm = Symbol('shopGoodEditForm')
const shopGoodContent = {
  formKey: shopGoodEditForm,
  stateKey: Symbol('shopGoodContent'),
  type: 'shopGoodContent',
}

const shopGoodCover = {
  formKey: shopGoodEditForm,
  stateKey: Symbol('shopGoodCover'),
  type: 'shopGoodCover',
}

const title = {
  formKey: shopGoodEditForm,
  stateKey: Symbol('title'),
  type: 'title',
}

const price = {
  formKey: shopGoodEditForm,
  stateKey: Symbol('price'),
  type: 'price',
}
const originalPrice = {
  formKey: shopGoodEditForm,
  stateKey: Symbol('originalPrice'),
  type: 'originalPrice',
}

const PAGE_WIDTH = Dimensions.get('window').width

const rteHeight = {
  height: normalizeH(64),
}

const wrapHeight = 373

class EditShopGood extends Component {
  constructor(props) {
    super(props)
    this.localRichTextImagesUrls = []
    this.isPublishing = false
    this.state = {
      extraHeight: rteHeight.height,
      headerHeight: wrapHeight,
    }
  }

  componentDidMount() {
    this.albums = this.props.goodInfo.album
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
    // console.log('getRichTextImages.localRichTextImagesUrls==', this.localRichTextImagesUrls)
  }

  renderRichText(initValue) {
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
        onBlurEditor={() => {this.setState({headerHeight: 373})}}
        placeholder="描述一下商品详情"
        initValue={JSON.parse(initValue)}
      />
    )
  }

  submitForm() {
    this.loading = Loading.show()
    this.props.modifyShopGoods({
      goodsId: this.props.goodsId,
      formKey: shopGoodEditForm,
      localRichTextImagesUrls: this.localRichTextImagesUrls,
      albums: this.albums,
      success: ()=>{
        this.isPublishing = false
        Loading.hide(this.loading)
        Toast.show('商品更新成功')
        Actions.MY_SHOP_INDEX()

      },
      error: ()=>{
        this.isPublishing = false
        Loading.hide(this.loading)
        Toast.show('商品更新失败')
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
          <Image style={{width:PAGE_WIDTH,height: normalizeH(264)}} source={require('../../../assets/images/background_good.png')}/>
          <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(90,90,90,0.5)'}}>
            <TouchableOpacity style={{flex:1}} onPress={()=>{Actions.UPDATE_SHOP_GOOD_ALBUM({albums: this.albums})}}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Image style={{width:44,height:44}} source={require("../../../assets/images/edite_pic_44_white.png")}/>
                <Text style={{marginTop:15,fontSize:15,color:'#fff'}}>上传商品相册</Text>
              </View>
            </TouchableOpacity>

          </View>

        </View>
      )
    }
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
          rightText="更新"
          rightPress={() => {this.publishGood()}}
        />
        <View style={styles.body}>
          <View style={{height: this.state.headerHeight, overflow:'hidden'}}
                onLayout={(event) => {this.setState({extraHeight: rteHeight.height + event.nativeEvent.layout.height})}}>
            {this.renderAlbum()}
            <View style={styles.introWrap}>
              <View style={styles.coverBox}>
                <ImageInput
                  {...shopGoodCover}
                  containerStyle={{width: 80, height: 80,borderWidth:0}}
                  addImageBtnStyle={{top:0, left: 0, width: 80, height: 80}}
                  choosenImageStyle={{width: 80, height: 80}}
                  addImage={require('../../../assets/images/upload_pic.png')}
                  closeModalAfterSelectedImg={true}
                  initValue={this.props.goodInfo.coverPhoto}
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
                    initValue={this.props.goodInfo.goodsName}
                  />
                </View>
                <View style={styles.priceBox}>
                  <View style={styles.promotingPriceBox}>
                    <Text style={styles.priceLabel}>价格</Text>
                    <Text style={{color:'#F56A23',marginLeft:3}}>￥</Text>
                    <CommonTextInput
                      {...price}
                      placeholder='0.00'
                      placeholderTextColor="#F56A23"
                      maxLength={4}
                      keyboardType="numeric"
                      outerContainerStyle={[styles.promotingPriceInput, {backgroundColor: '#fff', borderWidth: 0}]}
                      inputStyle={{backgroundColor: '#fff', color: '#FF7819'}}
                      showClear={false}
                      initValue={this.props.goodInfo.price}
                    />
                  </View>

                  <View style={styles.originalPriceBox}>
                    <Text style={styles.priceLabel}>原价</Text>
                    <Text style={{color:'#aaa',marginLeft:3}}>￥</Text>
                    <CommonTextInput
                      {...originalPrice}
                      placeholder='0.00'
                      placeholderTextColor="#aaa"
                      maxLength={4}
                      keyboardType="numeric"
                      outerContainerStyle={[styles.originalPriceBox, {backgroundColor: '#fff', borderWidth: 0}]}
                      inputStyle={{backgroundColor: '#fff'}}
                      showClear={false}
                      initValue={this.props.goodInfo.originalPrice}
                    />
                  </View>
                </View>
              </View>
            </View>

          </View>
          {this.renderRichText(this.props.goodInfo.detail)}

        </View>

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const goodInfo = selectGoodsById(state, ownProps.shopId, ownProps.goodsId)
  console.log("EditShopGood info:", goodInfo)
  return {
    goodInfo: goodInfo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modifyShopGoods
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EditShopGood)

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
    flexDirection: 'row',
    backgroundColor: 'white',
    height: normalizeH(109),
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
