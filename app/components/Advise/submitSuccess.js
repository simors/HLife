/**
 * Created by lilu on 2017/4/8.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Button
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import THEME from '../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Header from '../common/Header'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height


export default class SubmitAdviseSuccess extends Component{
  constructor(props){
    super(props)
  }
  jumpToLogin(){
    // Actions.HOME_INDEX()
    Actions.pop({popNum:2})
    // Actions.pop()

  }
  render(){
    return(
      <View style={styles.container}>

        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="意见反馈"

        />

        <View style={styles.body}>
          <Image style={styles.imageStyle} source={require("../../assets/images/submit_success.png")}/>
          <Text style={{marginTop:normalizeH(20),fontSize:em(28),color:'#FF7819',fontFamily:'PingFangSC-Semibold'}}>提交成功</Text>
          <Text style={{marginTop:normalizeH(10),fontSize:em(12),color:'#5A5A5A',fontFamily:'PingFangSC-Regular'}}>非常感谢您提出宝贵意见</Text>
          <Text style={{marginTop:normalizeH(30),fontSize:em(17),color:'#AAAAAA',fontFamily:'PingFangSC-Regular'}}>我们将不断改进产品的服务和体</Text>
          <Text style={{fontSize:em(17),color:'#AAAAAA'}}>验，给用户带来满意的服务</Text>
          <TouchableOpacity style={{marginTop:normalizeH(132),borderWidth:em(1),borderColor:'#FF7819',borderRadius:em(5),width:normalizeW(165),height:normalizeH(40),alignItems:'center',justifyContent:'center'}}
                            onPress={() => this.jumpToLogin()}>
            <Text style={{fontSize:em(17),color:'#FF7819',fontFamily:'PingFangSC-Regular'}}>返回首页</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    height: PAGE_HEIGHT,
    width: PAGE_WIDTH,
    alignItems:'center'
  },

  //选择话题的对话框的样式
  toSelectContainer: {
    height: normalizeH(59),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  selectBtnView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedTopicStyle: {
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'white',
    height: normalizeH(29),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: THEME.base.mainColor,
  },
  selectedTopicTextStyle: {
    fontSize: em(15),
    color: THEME.base.mainColor,
    marginLeft: normalizeW(16),
    marginRight: normalizeW(16),
    alignSelf: 'center',
  },
  imageStyle: {
    marginTop: normalizeH(19),
    width: normalizeW(152),
    height: normalizeH(116),
  },
  titleContainerStyle: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#F5F5F5',
  },
  titleInputStyle: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    color: '#5a5a5a',
  },
  titleCleanBtnStyle: {
    position: 'absolute',
    right: normalizeW(25),
    top: normalizeH(17),
  },
  topicTypeTitleStyle: {
    fontSize: em(15),
    color: '#5a5a5a',
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(18),
    alignSelf: 'center',
  },
  //modal 所有子组件的样式
  modalStyle: {
    width: PAGE_WIDTH,
    backgroundColor: '#f5f5f5',
    height: PAGE_HEIGHT,
    alignItems: 'flex-start',
  },
  modalTextStyle: {
    marginTop: normalizeH(17),
    marginBottom: normalizeH(18),
    alignSelf: 'center',
    color: "#5a5a5a",
    fontSize: em(12)
  },
  modalShowTopicsStyle: {
    marginTop: normalizeH(17),
    marginBottom: normalizeH(18),
    alignSelf: 'center',
    color: "#4a4a4a",
    fontSize: em(12)
  },
  modalTopicButtonStyle: {
    alignItems: 'flex-start',
    marginLeft: normalizeW(15),
    marginBottom: normalizeH(20)
  },
  modalTopicStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E9E9E9',
    height: normalizeH(41),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 5
  },
  ModalTopicTextStyle: {
    fontSize: em(17),
    color: "#5a5a5a",
    paddingLeft: normalizeW(16),
    paddingRight: normalizeW(16),
    justifyContent: 'center',
    alignItems: 'center',
  },

})