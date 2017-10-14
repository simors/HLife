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
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {Actions} from 'react-native-router-flux'
import THEME from '../../../constants/themes/theme1'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import Popup from '@zzzkk2009/react-native-popup'
import * as AVUtils from '../../../util/AVUtils'
import * as authSelector from '../../../selector/authSelector'
import {selectUserOwnedShopInfo} from '../../../selector/shopSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const shopInfoForm = Symbol('shopInfoForm')

class CompleteShopCover extends PureComponent {
  constructor(props) {
    super(props)
    this.localCoverImgUri = ''
  }

  componentDidMount() {
    setTimeout(() => {
      Popup.confirm({
        title: '系统提示',
        content: '未完善店铺资料将无法在店铺列表中显示',
        ok: {
          text: '确定',
          style: {color: THEME.base.mainColor},
          callback: ()=> {
          }
        },
      })
    }, 1000)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.localCoverImgUri) {
      this.localCoverImgUri = nextProps.localCoverImgUri
    }
  }

  goBack() {
    AVUtils.switchTab('MINE')
  }

  editShopCover(){
    Popup.confirm({
      title: '系统提示',
      content: '不要使用个人二维码作为店铺封面，如有违规店铺将被封闭，敬请遵守平台规则！',
      ok: {
        text: '确定',
        style: {color: THEME.base.mainColor},
        callback: ()=> {
        }
      },
    })
    Actions.UPDATE_SHOP_COVER_FOR_EDIT_SHOP({
      localCoverImgUri: this.localCoverImgUri
    })
  }

  render() {
    const userOwnedShopInfo = this.props.userOwnedShopInfo
    let shopCover = require('../../../assets/images/background_shop.png')
    if(userOwnedShopInfo.coverUrl) {
      shopCover = {uri: userOwnedShopInfo.coverUrl}
    }

    if(this.localCoverImgUri) {
      shopCover = {uri: this.localCoverImgUri}
    }
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
          <Image style={{width:PAGE_WIDTH, height: normalizeH(300)}} source={shopCover}>
            <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,}}>
              <TouchableOpacity style={{flex:1}} onPress={()=>{this.editShopCover()}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <Image style={{width:44,height:44}} source={require("../../../assets/images/upload_pic_44_yellow.png")}/>
                  <Text style={{marginTop:15,fontSize:15,color:'#FF7819'}}>上传封面</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Image>
          <View style={styles.tipView}>
            <Text style={styles.tipText}>点击上方区域，完成店铺封面上传！店铺封面是店铺的脸面，上传漂亮的图片可以给顾客留下好印象哦^_^</Text>
          </View>
          <View style={{marginTop: normalizeH(50)}}>
            <CommonButton title="下一步" onPress={() => Actions.COMPLETE_SHOP_ABLUM({form: shopInfoForm, cover: this.localCoverImgUri})}/>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  return {
    isUserLogined: isUserLogined,
    userOwnedShopInfo: userOwnedShopInfo
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