/**
 * Created by wanpeng on 2017/1/5.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  InteractionManager,
  Image,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {CheckBox} from 'react-native-elements'
import Symbol from 'es6-symbol'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import {em, normalizeH, normalizeW} from '../../../util/Responsive'
import {getDocterList} from '../../../action/doctorAction'
import {getDoctorList} from '../../../selector/doctorSelector'
import {activeUserId} from '../../../selector/authSelector'
import {INQUIRY_CONVERSATION, PERSONAL_CONVERSATION} from '../../../constants/messageActionTypes'
import * as Toast from '../../common/Toast'



const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class SelectDoctor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      doctorChecked: [],
    }
  }

  componentWillUnmount() {
    console.log("SelectDoctor: componentWillUnmount")
    // this.props.inputFormOnDestroy(this.props.formKey)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getDocterList({})
    })
  }

  componentWillReceiveProps(newProps) {
    console.log("componentWillReceiveProps newProps:", newProps)
    let doctorChecked = new Array()
    for (let i = 0; i < newProps.doctors.length; i++) {
      doctorChecked[i] = false
    }
    this.setState({doctorChecked})
  }

  onPressCheckBox(key) {
    let doctorChecked = this.state.doctorChecked
    doctorChecked[key] = !doctorChecked[key]
    this.setState({doctorChecked})
  }

  onButtonPress = () => {
    let selectedDoctor = new Array()
    let doctorChecked = this.state.doctorChecked
    for (let i = 0; i < doctorChecked.length; i++) {
      if (doctorChecked[i] == true) {
        selectedDoctor.push(this.props.doctors[i])
      }
    }

    if (selectedDoctor.length == 1){
      let payload = {
        name: selectedDoctor[0].phone,
        members: [this.props.currentUser, selectedDoctor[0].userId],
        questionId: this.props.questionId,
        conversationType: INQUIRY_CONVERSATION,
        title: selectedDoctor[0].username,
      }
      Actions.CHATROOM(payload)

    } else if(selectedDoctor.length >= 1) {
      let payload = {
        doctors: selectedDoctor,
      }
      Actions.QA_LIST(payload)
    } else {
      Toast.show("请选择医生")
    }

  }

  renderDocs() {
    return (
      this.props.doctors.map((value, key) => {
        return (
          <View key={key} style={styles.doctor}>
            <TouchableOpacity style={styles.touch} onPress={() => this.onPressCheckBox(key)}>
              <View style={{flex: 5, flexDirection: 'row'}}>
                <View style={{flex: 1, paddingTop: normalizeH(10)}}>
                  <Image style={{width: normalizeW(46), height: normalizeH(46), borderRadius: normalizeW(23), overflow: 'hidden'}}
                         source={{uri: value.avatar}}/>
                </View>
                <View style={{flex: 6, paddingLeft: normalizeW(5), borderBottomWidth: 1, borderBottomColor: '#C8C7CC'}}>
                  <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Text style={[styles.titile, {fontSize: em(15)}]}>{value.username}</Text>
                    <Text style={{marginLeft: normalizeW(5)}}>主治医生</Text>
                  </View>
                  <Text style={styles.tripText}>{value.department} </Text>
                  <Text style={styles.tripText}>擅长：{value.spec}</Text>
                </View>
              </View>
              <View style={{flex: 2, flexDirection: 'row', paddingLeft: normalizeW(53), alignItems: 'center'}}>
                <Text style={styles.tripText}>88人咨询</Text>
                <Text style={[styles.tripText, {color: 'red', marginLeft: normalizeW(5)}]}>12元／次</Text>
                <CheckBox
                  right
                  containerStyle={{position: 'absolute', right: 0, bottom: 0, margin: 0, padding: 0, borderWidth: 0,backgroundColor: '#FFFFFF'}}
                  checked={this.state.doctorChecked[key]}
                  onPress = {() => this.onPressCheckBox(key)}
                />
              </View>
            </TouchableOpacity>
          </View>
        )
      })
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress = {()=> {Actions.pop()}}
          title="选医生"
          titleStyle={styles.titile}
        />
        <View style={styles.body}>
          <View style={styles.trip}>
            <Text style={{fontSize: 12}}>您可选择多位医生问诊</Text>
          </View>
          <View style={{height: normalizeH(480)}}>
            <ScrollView >
              {this.renderDocs()}
            </ScrollView>
          </View>

          <View style={styles.submit}>
            <CommonButton title="提问"
                          onPress={this.onButtonPress}
            />
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let doctors = getDoctorList(state)
  return {
    currentUser: activeUserId(state),
    doctors: doctors,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDocterList,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SelectDoctor)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  header: {
    backgroundColor: '#F9F9F9',
  },
  titile: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(17),
    color: '#030303',
    letterSpacing: -0.41,
  },
  body: {
    flex: 1,
    width: PAGE_WIDTH,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
  },
  trip: {
    height: normalizeH(44),
    paddingLeft: normalizeW(20),
    backgroundColor: 'rgba(80, 226, 193, 0.23)',
    justifyContent: 'center',
    alignItems: 'flex-start'

  },
  doctor: {
    height: normalizeH(140),
    width: PAGE_WIDTH,
    borderBottomWidth: 1,
    borderBottomColor: '#C8C7CC'
  },
  touch: {
    flex:1,
    paddingTop: normalizeH(10),
    paddingBottom: normalizeH(10),
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(10)
  },
  submit: {
    position: 'absolute',
    left: 0,
    bottom:0,
    width: PAGE_WIDTH,
    height: normalizeH(60),
  },
  tripText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(12),
    color: '#8F8E94',
  },
})