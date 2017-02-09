/**
 * Created by wanpeng on 2017/1/17.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ListView,
  Platform,
  Image,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Symbol from 'es6-symbol'
import Header from '../../common/Header'
import {activeDoctorInfo} from '../../../selector/doctorSelector'
import {em, normalizeW, normalizeH,} from '../../../util/Responsive'
import {activeUserInfo} from '../../../selector/authSelector'


const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height


class Doctor extends Component {
  constructor(props) {
    super(props)
  }

  renderInfoStatus () {
    let integrity = true
    for (let i in this.props.doctorInfo) {
      if (!this.props.doctorInfo[i])
        integrity = false
    }
    if (integrity) {
      return (
        <View style={{marginLeft: normalizeW(3), width: normalizeW(47), height: normalizeH(17), backgroundColor: '#50E3C2', borderRadius: normalizeH(5), justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.statusText}>完整</Text>
        </View>
      )
    } else {
      return (
        <View style={{marginLeft: normalizeW(3), width: normalizeW(47), height: normalizeH(17), backgroundColor: '#50E3C2', borderRadius: normalizeH(5), justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.statusText}>待完善</Text>
        </View>
      )
    }
  }

  renderComment(rowData) {
    return(
      <View style={styles.itemView}>
        <View style={styles.itemHeader}>
          <Image style={{width: normalizeW(35), height: normalizeH(35), borderRadius: normalizeW(17), overflow: 'hidden'}}
                 source={require('../../../assets/images/defualt_portrait_archives.png')}/>
        </View>
        <View style={styles.itemBody}>
          <Text style={{fontFamily: 'PingFangSC-Regular', fontSize: em(15), color: '#50E3C2', marginBottom: normalizeH(10)}}>{rowData.nickname}</Text>
          <Text style={{fontFamily: 'PingFangSC-Regular', fontSize: em(17), color: '#4A4A4A', marginBottom: normalizeH(14)}}>{rowData.comment}</Text>
          <View style={styles.tipWrap}>
            <View>
              <Text style={styles.triptext}>刚刚</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image source={require("../../../assets/images/writer_loaction.png")}/>
              <Text style={styles.triptext}>长沙</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image  source={require("../../../assets/images/artical_like_unselect.png")}/>
              <Text style={styles.triptext}>28</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image  source={require("../../../assets/images/comments_unselect.png")}/>
              <Text style={styles.triptext}>回复</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="text"
          leftStyle={styles.left}
          leftText="取消"
          leftPress={()=> Actions.pop()}
          title="医生角色"
          titleStyle={styles.left}
          rightType="icon"
          rightIconName="ios-menu"
          rightStyle={styles.left}
          rightPress={() => {}}
        />
        <View style={styles.body}>
          <ScrollView keyboardShouldPersistTaps= {true} keyboardDismissMode= {'on-drag'}>
            <View style={styles.base}>
              <View style={styles.info}>
                <View style={{width: normalizeW(115), justifyContent: 'center', alignItems: 'center'}}>
                  <Image style={{width: normalizeW(50), height: normalizeH(50), borderRadius: normalizeW(25), overflow: 'hidden'}}
                         source={{uri: this.props.userInfo.avatar}}/>

                </View>
                <View style={{flex: 1, height: normalizeH(112)}}>
                  <Text style={{fontFamily: 'PingFangSC-Regular', fontSize: em(17), color: '#030303', marginTop: normalizeH(26)}}>
                    {this.props.doctorInfo.name}
                  </Text>
                  <Text style={{fontFamily: 'PingFangSC-Regular', fontSize: em(15), color: '#9B9B9B'}}>{this.props.doctorInfo.department}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'PingFangSC-Regular', fontSize: em(15), color: '#9B9B9B'}}>基本信息</Text>
                    {this.renderInfoStatus()}
                  </View>
                </View>
                <TouchableOpacity style={{width: normalizeW(50), height: normalizeH(112)}} onPress={() => Actions.BASIC_DOCTOR_INFO()}>
                  <Image style={{position: 'absolute', right: normalizeW(12), top: normalizeH(22)}} source={require('../../../assets/images/view.png')}/>
                </TouchableOpacity>
              </View>
              <View style={styles.attr}>
                <View style={{height: normalizeH(37), flexDirection: 'row', borderBottomColor: '#E6E6E6', borderBottomWidth: 1}}>
                  <View style={{flex: 1, flexDirection: 'row',justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#E6E6E6'}}>
                    <Text style={styles.title}>服务次数 </Text>
                    <Text style={[styles.title, {color: '#F6A623'}]}>111</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.title}>好评率 </Text>
                    <Text style={[styles.title, {color: '#F6A623'}]}>98%</Text>
                  </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <TouchableOpacity style={styles.action} onPress={() => Actions.INQUIRY_MESSAGE_BOX()}>
                    <Image style={{width: 35, height: 35, marginBottom: normalizeH(9)}}
                           source={require('../../../assets/images/home_question.png')}/>
                    <Text style={styles.title}>问诊咨询</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() => Actions.ACKNOWLEDGE()}>
                    <Image style={{width: 35, height: 35, marginBottom: normalizeH(9)}}
                           source={require('../../../assets/images/in_return.png')}/>
                    <Text style={styles.title}>病友问答</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() => Actions.EARNINGS()}>
                    <Image style={{width: 35, height: 35, marginBottom: normalizeH(9)}}
                           source={require('../../../assets/images/in_return.png')}/>
                    <Text style={styles.title}>收益记录</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.fans}>
              <Text style={{fontFamily: 'PingFangSC-Regular', fontSize: em(15), color: '#9B9B9B', marginTop: normalizeH(12)}}>
                我的病人
              </Text>
              <View style={{flex: 1, marginTop: normalizeH(9)}}>
                <Image style={{width: normalizeW(35), height: normalizeH(35), borderRadius: normalizeW(17), overflow: 'hidden'}}
                       source={require('../../../assets/images/default_portrait.png')}/>

              </View>

            </View>
            <View style={styles.comments}>
              <View style={{height: normalizeH(38), borderBottomWidth: 1, borderBottomColor: '#E6E6E6', marginTop: normalizeH(12), paddingLeft: normalizeW(12), backgroundColor: '#FFFFFF',}}>
                <Text style={{fontFamily: 'PingFangSC-Regular', fontSize: em(15), color: '#9B9B9B'}}>用户评价</Text>
              </View>
              <View >
                <ListView
                  dataSource = {this.props.dataSource}
                  renderRow = {(rowData) => this.renderComment(rowData)}
                />
              </View>
            </View>

          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let userInfo = activeUserInfo(state)
  let doctorInfo = activeDoctorInfo(state)
  let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  let dataSource = []
  dataSource.push({avatar: undefined, nickname: '阿彪', comment: '这个医生是华佗在世'})
  dataSource.push({avatar: undefined, nickname: '李四', comment: '就是一坨屎'})

  return{
    userInfo: userInfo,
    doctorInfo: doctorInfo,
    dataSource: ds.cloneWithRows(dataSource)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Doctor)

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
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44),
      }
    })
  },
  base: {
    height: normalizeH(250),
    backgroundColor: '#FFFFFF',

  },
  info: {
    height: normalizeH(112),
    flexDirection: 'row',
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  attr: {
    flex: 1,

  },
  fans: {
    height: normalizeH(182),
    paddingLeft: normalizeW(12),
    backgroundColor: '#FFFFFF',
    marginTop: normalizeH(10),
  },
  comments: {
    marginTop: normalizeH(10),
  },
  title: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(17),
    color: '#4A4A4A',

  },
  action: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E6E6E6',
  },
  statusText: {
    width: normalizeW(36),
    height: normalizeH(14),
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(12),
    color: '#FFFFFF'
  },
  itemView: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#FFFFFF'
  },
  itemHeader: {
    marginTop: normalizeH(10),
    marginLeft: normalizeW(12),
    marginRight: normalizeW(10),
  },
  itemBody: {
    marginTop: normalizeH(10),

  },
  tipWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalizeH(10),
    width: normalizeW(300),
  },
  triptext: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(12),
    color: '#B6B6B6',
  },
  positionStyle: {
    marginRight: normalizeW(4),
    width: normalizeW(8),
    height: normalizeH(12)
  },



})