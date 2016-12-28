/**
 * Created by wanpeng on 2016/12/13.
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
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'

import Header from '../common/Header'
import CommonButton from '../common/CommonButton'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {activeDoctorInfo} from '../../selector/doctorSelector'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class DoctorChecking extends Component {
  constructor(props) {
    super(props)
  }

  onButtonPress = () => {
    Actions.DCTOR_INFO()
  }

  doctorCheckStatus(status) {
    if (status === undefined)
      return(
        <View>
          <Text style={styles.mainText}>审核状态异常，请联系客服</Text>
        </View>
      )
    switch (status)
    {
      case 0: //审核失败
        return(
          <View>
            <Text style={styles.mainText}>认证失败，请查看</Text>
            <TouchableOpacity onPress={()=>{}}>
              <Text style={styles.mainText}>《认证说明》</Text>
            </TouchableOpacity>
          </View>
        )
      case 1: //审核成功
        return
      case 2: //审核中
        return(
          <View>
            <Text style={styles.mainText}>资料已提交审核，请耐心等待审核结果</Text>
          </View>
        )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="text"
          leftStyle={styles.left}
          leftText="取消"
          leftPress = {()=> {Actions.pop()}}
          title="医生认证"
          titleStyle={styles.left}
          rightType=""
        />
        <View style={styles.body}>
          <ScrollView keyboardShouldPersistTaps= {true} keyboardDismissMode= {'on-drag'}>
            <View style={styles.trip}>
              <Text style={{fontSize: em(12)}}>欢迎加入近来医生，完成认证可使用完整功能</Text>
            </View>

            <Image style={styles.image} source={require('../../assets/images/review_data.png')}/>

            {/*<Text style={styles.mainText}>{this.doctorCheckStatus(this.props.doctorInfo.status)}</Text>*/}
            {/*<Text style={styles.mainText}>资料已提交审核，请耐心等待审核结果</Text>*/}
            {this.doctorCheckStatus(this.props.doctorInfo.status)}

            <CommonButton buttonStyle={{marginBottom: normalizeH(6), marginTop: normalizeH(100)}}
                          title="查看我的认证资料"
                          onPress={this.onButtonPress}
            />
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let doctorInfo = activeDoctorInfo(state)
  return{
    doctorInfo: doctorInfo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DoctorChecking)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  header: {
    backgroundColor: '#50E3C2',
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
  },
  trip: {
    height: normalizeH(44),
    backgroundColor: 'rgba(80, 226, 193, 0.23)',
    justifyContent: 'center',
    alignItems: 'center'

  },
  image: {
    marginTop: normalizeH(116),
    marginLeft: normalizeW(138),

  },
  mainText: {
    marginTop: normalizeH(37),
    marginLeft: normalizeW(35),
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(18),
    color: '#656565',
    letterSpacing: -0.45,
  }
})