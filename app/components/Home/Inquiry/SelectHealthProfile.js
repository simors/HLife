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

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class SelectHealthProfile extends Component {
  constructor(props) {
    super(props)
  }

  submitSuccessCallback = () => {

  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }
  onButtonPress = () => {

  }

  renderHealthProfile() {
    return(
      this.props.healthProfiles.map((value, key) => {
        return(
          <View key={key} style={styles.healthProfile}>
            <Image style={{width: normalizeW(35), height: normalizeH(35), borderRadius: normalizeW(17), overflow: 'hidden'}}
                   source={value.avatar? {uri: value.avatar}: require('../../../assets/images/defualt_portrait_archives.png')}/>
            <Text style={styles.profileText}>
              {value.nickname + '  (' + value.gender + ', ' + value.birthday + ')' }
            </Text>
            <CheckBox
              right
              containerStyle={{position: 'absolute', right: 0, bottom: 0, margin: 0, padding: 0, borderWidth: 0,backgroundColor: '#FFFFFF'}}

            />
          </View>
        )
      })
    )
  }

  addHealthProfile() {
    Actions.HEALTH_PROFILE()
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
    flexDirection: 'row',
    height: normalizeH(55),
    alignItems: 'center',
    paddingLeft: normalizeW(35),
    borderBottomColor: '#F4F4F4',
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  profileText: {
    marginLeft: normalizeW(10),
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(17),
    color: '#030303',
  }


})