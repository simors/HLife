/**
 * Created by wanpeng on 2016/12/29.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'
import {em, normalizeH, normalizeW} from '../../../util/Responsive'
import Header from '../../common/Header'
import TextAreaInput from '../../common/Input/TextAreaInput'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import MultilineText from '../../common/Input/MultilineText'
import ImageGroupInput from '../../common/Input/ImageGroupInput'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')
const multiInput = {
  formKey: commonForm,
  stateKey: Symbol('multiInput'),
  type: 'content'
}

const imageGroupInput = {
  formKey: commonForm,
  stateKey: Symbol('imageGroupInput'),
  type: 'imgGroup'
}



export default class Inguiry extends Component {
  constructor(props) {
    super(props)
  }
  onButtonPress= () => {

  }

  render(){
    return (
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress = {()=> {Actions.pop()}}
          title="快速问诊"
          titleStyle={styles.titile}
          rightType="text"
          rightText="下一步"
          rightPress={this.onButtonPress()}
        />
        <View style={styles.body}>
          <KeyboardAwareScrollView style={styles.scrollViewStyle} contentContainerStyle={{flex: 1}}>
            <View>
              <MultilineText containerStyle={{height: normalizeH(232)}}
                             placeholder="请详细描述您的症状和身体状况，便于医生更准确的分析，我们将确保您的隐私安全。为了描述清楚，描述字数应至少12个字符。"
                             inputStyle={{height: normalizeH(232)}}
                             {...multiInput}/>
            </View>
            <View style={{flex: 1,backgroundColor: 'rgba(0, 0, 0, 0.05)'}}>
              <Text style={styles.trip}>病症部位、检查报告或其他病情资料</Text>

              <View style={{position: 'absolute', left: normalizeW(0), top: normalizeH(0), backgroundColor: 'rgba(0, 0, 0, 0)'}}>
                <ImageGroupInput {...imageGroupInput}
                                 number={9}
                                 addImage={require('../../../assets/images/upload_picture.png')}
                                 imageLineCnt={4}/>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  header: {
    backgroundColor: '#F9F9F9',
  },
  left: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: -0.41,
  },
  body: {
    flex: 1,
    width: PAGE_WIDTH,
    // paddingLeft: normalizeW(20),
    // paddingRight: normalizeW(20),
    marginTop: normalizeH(64),
    backgroundColor: '#FFFFFF',
  },
  scrollViewStyle: {
    flex: 1,
    width: PAGE_WIDTH,
  },
  titile: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(17),
    color: '#030303',
    letterSpacing: -0.41,
  },
  trip: {
    marginTop: normalizeH(46),
    marginLeft: normalizeW(102),
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(12),
    color: '#BEBEBE'
  }
})