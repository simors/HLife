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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import CommonTextInput from '../../common/Input/CommonTextInput'
import DateTimeInput from '../../common/Input/DateTimeInput'
import GenderSelector from '../../common/Input/GenderSelector'
import CommonButton from '../../common/CommonButton'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let profileForm = Symbol('commonForm')
const nicknameInput = {
  formKey: profileForm,
  stateKey: Symbol('nicknameInput'),
  type: "nicknameInput",
}

const genderInput = {
  formKey: profileForm,
  stateKey: Symbol('genderInput'),
  type: "genderInput",
}

const dtPicker = {
  formKey: profileForm,
  stateKey: Symbol('dtPicker'),
  type: "dtPicker",
}


export default class HealthRecord extends Component {
  constructor(props) {
    super(props)
  }
  onButtonPress = () => {

  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress = {()=> {Actions.pop()}}
          title="新增健康档案"
          titleStyle={styles.titile}
        />
        <View style={styles.body}>
          <KeyboardAwareScrollView style={styles.scrollViewStyle} contentContainerStyle={{flex: 1}}>
            <View style={styles.zone}>
              <View style={styles.tab}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.mainText}>昵称</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center'}}>
                  <CommonTextInput {...nicknameInput}
                                   containerStyle={{height: normalizeH(38), }}
                                   inputStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, paddingLeft: 0,}}/>
                </View>

              </View>
              <View style={styles.tab}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.mainText}>性别</Text>
                </View>
                <View style={{flex: 2, paddingLeft: normalizeW(30)}}>
                  <GenderSelector {...genderInput}/>
                </View>
              </View>
              <View style={styles.tab}>
                <View style={{flex: 1, justifyContent: 'center', }}>
                  <Text style={styles.mainText}>出生年月</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center', }}>
                  <DateTimeInput {...dtPicker}
                                 value="2016-05-18" PickerStyle={{backgroundColor: '#FFFFFF', width: normalizeW(140), borderWidth: 0}}/>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>

          <View style={{flex: 1, marginTop: normalizeH(49)}}>
            <CommonButton title="创建档案并提交" onPress={() => this.onButtonPress()}/>
          </View>

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
  zone: {
    height: normalizeH(170),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4'
  },
  mainText: {
    marginLeft: normalizeW(25),
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(17),
    color: '#030303',
    letterSpacing: -0.41,
  },
})
