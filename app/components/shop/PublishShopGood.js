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
  TextInput
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
import ArticleEditor from '../common/Input/ArticleEditor'
import Symbol from 'es6-symbol'



let shopGoodForm = Symbol('shopGoodForm')
const shopGood = {
  formKey: shopGoodForm,
  stateKey: Symbol('shopGood'),
  type: 'shopGood',
}

const PAGE_WIDTH = Dimensions.get('window').width

const rteHeight = {
  height: normalizeH(64),
}

const wrapHeight = 214

class PublishShopGood extends Component {
  constructor(props) {
    super(props)
    this.localRichTextImagesUrls = []

    this.state = {
      extraHeight: rteHeight.height,
      headerHeight: wrapHeight,
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

  renderRichText() {
    return (
      <ArticleEditor
        {...shopGood}
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
        onBlurEditor={() => {this.setState({headerHeight: 214})}}
        placeholder="描述一下商品详情"
      />
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
          rightText="完成"
          rightPress={() => {}}
        />
        <View style={styles.body}>
          <KeyboardAwareScrollView
            automaticallyAdjustContentInsets={false}
            onScroll={() => {}}
            scrollEventThrottle={0}
            keyboardShouldPersistTaps={true}
          >
            <View>
              <Image style={{width:PAGE_WIDTH,height: normalizeH(264)}} source={require('../../assets/images/background_good.png')}/>
              <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(90,90,90,0.5)'}}>
                <TouchableOpacity style={{flex:1}} onPress={()=>{Actions.UPDATE_SHOP_GOOD_ALBUM()}}>
                  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:44,height:44}} source={require("../../assets/images/edite_pic_44_white.png")}/>
                    <Text style={{marginTop:15,fontSize:15,color:'#fff'}}>上传封面</Text>
                  </View>
                </TouchableOpacity>

              </View>

            </View>

            <View style={styles.introWrap}>
              <View style={styles.coverBox}>
                <ImageInput
                  containerStyle={{width: 80, height: 80,borderWidth:0}}
                  addImageBtnStyle={{top:0, left: 0, width: 80, height: 80}}
                  choosenImageStyle={{width: 80, height: 80}}
                  addImage={require('../../assets/images/upload_pic.png')}
                  closeModalAfterSelectedImg={true}
                  imageSelectedChangeCallback={(localImgUri)=>{}}
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
                      keyboardType="numeric"
                      style={[styles.promotingPriceInput]}
                      enablesReturnKeyAutomatically={true}
                      underlineColorAndroid="transparent"
                      onChangeText={(text) => {
                        this.setState({
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
                      keyboardType="numeric"
                      style={[styles.originalPriceInput]}
                      enablesReturnKeyAutomatically={true}
                      underlineColorAndroid="transparent"
                      onChangeText={(text) => {
                        this.setState({
                        })
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>

            {this.renderRichText()}
          </KeyboardAwareScrollView>
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

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
