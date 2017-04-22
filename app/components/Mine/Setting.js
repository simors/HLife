/**
 * Created by yangyang on 2016/12/26.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  Linking
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {persistor} from '../../store/persistStore'
import * as reactInvokeMethod from '../../util/reactMethodUtils'
import RNRestart from 'react-native-restart'
import * as Toast from '../../components/common/Toast'
import Popup from '@zzzkk2009/react-native-popup'
import THEME from '../../constants/themes/theme1'
import {userLogOut} from '../../action/authActions'
import {NativeModules, NativeEventEmitter, DeviceEventEmitter} from 'react-native'
import {checkUpdate} from '../../api/leancloud/update'
const RNDeviceInfo = NativeModules.RNDeviceInfo

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height
const Emitter = (Platform.OS == 'ios' ? NativeEventEmitter : DeviceEventEmitter)
// const CommonNative = NativeModules.jsVersionUpdate

class Setting extends Component {
  constructor(props) {
    super(props)

  }

  clearApplication() {
    Popup.confirm({
      title: '提示',
      content: '确认清除缓存？',
      ok: {
        text: '确定',
        style: {color: THEME.base.mainColor},
        callback: ()=>{
          Actions.pop()
          persistor.purge()
          Toast.show('清除成功，应用重启！')
          setTimeout(() => {
            RNRestart.Restart()
          }, 1000)
        }
      },
      cancel: {
        text: '取消',
        callback: ()=>{
          // console.log('cancel')
        }
      }
    })
}

  clickListener(index, banners) {
    let banner = banners[index]
    let actionType = banner.actionType
    let action = banner.action
    let title = banner.title
    if(actionType == 'link') {
      let payload = {
        url: action,
        showHeader: !!title,
        headerTitle: title
      }
      return (
        Actions.COMMON_WEB_VIEW(payload)
      )
    }else if(actionType == 'toast') {
      Toast.show(action)
    }else if(actionType == 'action') {
      Actions[action]()
    }
  }
  checkIosUpdate(){
    // console.log('jhahahah',CommonNative)
    let platform = Platform.OS
    if(platform==='ios'){
      fetch('https://itunes.apple.com/lookup?id=1224852246',{
        method:'POST'
      }).then((data)=>{
        data.json().then((result)=>{
          // console.log('data',data)
          // console.log('result',result.results[0].version)
          // console.log('data',RNDeviceInfo.appVersion)
          let version = result.results[0].version
          if(version>RNDeviceInfo.appVersion){
            this.isUpdate(result.results[0])
          }
        })


      })
    }else if (platform==='android'){
      checkUpdate().then((result)=>{
        // console.log('result',result)
        // console.log('RNDeviceInfo.appVersion',RNDeviceInfo.appVersion)

        if(result.version>RNDeviceInfo.appVersion){
          this.isUpdate({trackViewUrl:result.fileUrl})
        }
      })
    }

  }

  isUpdate(result) {
    Popup.confirm({
      title: '版本更新',
      content: '是否更新？',
      ok: {
        text: '更新',
        style: {color: THEME.base.mainColor},
        callback: ()=> {
          // url='https://itunes.apple.com/app/id=1224852246'
          // console.log('result.trackViewUrl',result.trackViewUrl)
          let url= result.trackViewUrl
          Linking.openURL(url).catch(err => console.error('An error occurred', err));
        }
      },
      cancel: {
        text: '以后',
        callback: ()=> {
          // console.log('cancel')
        }
      }
    })
  }


  toUserGuide(){
    let payload = {
      url:'http://www.baidu.com',
      showHeader:true,
      headerTitle:'用户指南',
    }
    Actions.COMMON_WEB_VIEW(payload)
  }


  toAbout(){
    let payload = {
      url:'http://www.baidu.com',
      showHeader:true,
      headerTitle:'关于邻家优店',
    }
    Actions.COMMON_WEB_VIEW(payload)
  }

  clearUserInfo() {
    Popup.confirm({
      title: '提示',
      content: '确认退出登录吗？',
      ok: {
        text: '确定',
        style: {color: THEME.base.mainColor},
        callback: ()=>{
          this.props.userLogOut({
            success: () => {
              Toast.show('登出成功')
              Actions.HOME({type: 'reset'})
            }
          })
        }
      },
      cancel: {
        text: '取消',
        callback: ()=>{
          // console.log('cancel')
        }
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="设置"
        />
        <View style={styles.itemContainer}>

          <View style={{marginLeft:normalizeW(15),borderBottomWidth: 1, borderColor: '#F7F7F7'}}>
            <TouchableOpacity style={styles.selectItem} onPress={() => this.checkIosUpdate()}>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(15)}]}>版本更新</Text>
              <View style={styles.rightWrap}><Text style={{color:'#AAAAAA',fontSize:em(15),marginRight:normalizeW(6)}}>{'V'+RNDeviceInfo.appVersion}</Text>
                <Image source={require("../../assets/images/arrow_left.png")}/>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginLeft:normalizeW(15),borderBottomWidth: 1, borderColor: '#F7F7F7'}}>
            <TouchableOpacity style={styles.selectItem} onPress={() => this.toAbout()}>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(15)}]}>关于邻家优店</Text>
              <View style={styles.rightWrap}>
                <Image source={require("../../assets/images/arrow_left.png")}/>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginLeft:normalizeW(15),borderBottomWidth: 1, borderColor: '#F7F7F7'}}>
            <TouchableOpacity style={styles.selectItem} onPress={() => this.toUserGuide()}>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(15)}]}>用户指南</Text>
              <View style={styles.rightWrap}>
                <Image source={require("../../assets/images/arrow_left.png")}/>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginLeft:normalizeW(15),borderBottomWidth: 1, borderColor: '#F7F7F7'}}>
            <TouchableOpacity style={styles.selectItem} onPress={() => this.clearApplication()}>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(15)}]}>清空缓存</Text>
              <View style={styles.rightWrap}>
                <Image source={require("../../assets/images/arrow_left.png")}/>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginLeft:normalizeW(15),borderBottomWidth: 1,marginTop:normalizeH(30),backgroundColor:'#F5F5F5', borderColor: '#F7F7F7',width:normalizeW(345),height:normalizeH(50) }}>
            <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}} onPress={() => this.clearUserInfo()}>
              <Text style={[styles.textStyle,{color:'#FF7819',marginTop:normalizeH(16)}]}>退出登录</Text>

            </TouchableOpacity>
          </View>
          <View >
            <Text style={{fontSize:em(12),color:'#00BE96',marginLeft:normalizeW(138),marginTop:normalizeH(15)}}>邻家优店用户协议</Text>
          </View>
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
  userLogOut,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Setting)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        marginTop: normalizeH(65),
      },
      android: {
        marginTop: normalizeH(45)
      }
    }),
  },
  selectItem: {
    flexDirection: 'row',
    height: normalizeH(60),
    paddingLeft: normalizeW(0),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: normalizeH(2),
    marginTop: normalizeH(5),
  },
  textStyle: {
    fontSize: em(17),
    color: '#4A4A4A',
    letterSpacing: 0.43,
  },
  rightWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight:normalizeW(30)
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 12
  },
})