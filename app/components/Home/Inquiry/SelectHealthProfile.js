/**
 * Created by wanpeng on 2017/1/13.
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
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Symbol from 'es6-symbol'
import {em, normalizeH, normalizeW} from '../../../util/Responsive'
import Header from '../../common/Header'
import {CheckBox} from 'react-native-elements'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import CommonTextInput from '../../common/Input/CommonTextInput'
import DateTimeInput from '../../common/Input/DateTimeInput'
import GenderSelector from '../../common/Input/GenderSelector'
import CommonButton from '../../common/CommonButton'
import {inputFormOnDestroy} from '../../../action/inputFormActions'
import * as Toast from '../../common/Toast'
import {getHealthProfileList} from '../../../selector/authSelector'
import {submitFormData} from '../../../action/inquiryAction'
import {getAgeFromBirthday} from '../../../util/dateUtils'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class SelectHealthProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      healthProfileChecked: [],
    }
  }

  componentWillReceiveProps(newProps) {
    console.log("componentWillReceiveProps newProps:", newProps)
    let healthProfileChecked = new Array()
    for (let i = 0; i < newProps.healthProfiles.length; i++) {
      healthProfileChecked[i] = false
    }
    this.setState({healthProfileChecked})
  }

  submitSuccessCallback = (record) => {
    let payload = {
      questionId: record.question.id,
    }
    Actions.SELECT_DOCTOR(payload)
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  onButtonPress = () => {
    let selectedHealthProfile
    let healthProfileChecked = this.state.healthProfileChecked
    for (let i = 0; i < healthProfileChecked.length; i++) {
      if (healthProfileChecked[i] == true) {
        selectedHealthProfile = this.props.healthProfiles[i]
        break
      }
    }
    if (selectedHealthProfile) {
      this.props.submitFormData({
        formKey: this.props.formKey,
        id: this.props.userId,
        healthProfile: selectedHealthProfile,
        success: this.submitSuccessCallback,
        error: this.submitErrorCallback,
      })
    } else {
      Toast.show("请选择档案")
    }

  }

  onPressCheckBox(key) {
    let healthProfileChecked = this.state.healthProfileChecked
    healthProfileChecked[key] = !healthProfileChecked[key]
    healthProfileChecked.forEach((value, index) => {
      if (index != key && healthProfileChecked[key] == true) {
         healthProfileChecked[index] = !healthProfileChecked[key]
      }
    })
    this.setState({healthProfileChecked})
  }

  renderHealthProfile() {
    return(
      this.props.healthProfiles.map((value, key) => {
        return(
          <View key={key} style={styles.healthProfile}>
            <TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: normalizeW(35)}} onPress={() => this.onPressCheckBox(key)}>
              <Image style={{width: normalizeW(35), height: normalizeH(35), borderRadius: normalizeW(17), overflow: 'hidden'}}
                     source={value.avatar? {uri: value.avatar}: require('../../../assets/images/defualt_portrait_archives.png')}/>
              <View style={styles.profile}>
                <Text style={styles.profileText}>
                  {value.nickname}
                </Text>
                <Text style={[styles.profileText, {flex: 2}]}>
                  {'(' + (value.gender == 'female'? '女':'男') + ',   ' + getAgeFromBirthday(value.birthday) + '岁)'}
                </Text>
              </View>
              <CheckBox
                right
                containerStyle={{position: 'absolute', right: 0, bottom: normalizeH(15), margin: 0, padding: 0, borderWidth: 0,backgroundColor: '#FFFFFF'}}
                checked={this.state.healthProfileChecked[key]}
                onPress = {() => this.onPressCheckBox(key)}
              />
            </TouchableOpacity>
          </View>
        )
      })
    )
  }

  addHealthProfile= () => {
    let payload = {
      interKey: 'select_health_profile'
    }
    Actions.HEALTH_PROFILE(payload)
  }

  render() {
    return(
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress = {()=> {Actions.pop()}}
          title="选择健康档案"
          titleStyle={styles.titile}
          rightType="text"
          rightText="编辑"
          rightPress = {() => {}}
        />
        <View style={styles.body}>
          <View style={styles.trip}>
            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => this.addHealthProfile()}>
              <Text style={{fontSize: em(15), color: '#50E3C2'}}>新增健康档案</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{marginTop: normalizeH(8), backgroundColor: '#FFFFFF'}}>
            <View style={{paddingLeft: normalizeW(35), justifyContent: 'center', height: normalizeH(40), borderBottomWidth: 1, borderBottomColor: '#F4F4F4'}}>
              <Text style={{fontSize: em(15), color: '#B2B2B2'}}>选择为谁提问</Text>
            </View>

            {this.renderHealthProfile()}

          </ScrollView>

          <View style={{flex: 1, marginTop: normalizeH(49)}}>
            <CommonButton title="完成" onPress={() => this.onButtonPress()}/>
          </View>

        </View>
      </View>
      )
  }

}

const mapStateToProps = (state, ownProps) => {
  let healthProfileList = getHealthProfileList(state)
  return {
    healthProfiles: healthProfileList,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  inputFormOnDestroy
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SelectHealthProfile)


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
    backgroundColor: 'rgba(0, 0, 0, 0.05)F',
  },
  trip: {
    height: normalizeH(35),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',

  },
  healthProfile: {
    height: normalizeH(55),
    borderBottomColor: '#F4F4F4',
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  profileText: {
    flex: 1,
    marginLeft: normalizeW(10),
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(17),
    color: '#030303',
  },
  profile: {
    width: normalizeW(240),
    flexDirection: 'row',
    alignItems: 'center',
  }


})