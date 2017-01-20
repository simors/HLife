import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {activeUserInfo} from '../../selector/authSelector'
import {activeDoctorInfo} from '../../selector/doctorSelector'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {fetchUserFollowees} from '../../action/authActions'
import {fetchDoctorInfo} from '../../action/doctorAction'
import {selectUserOwnedShopInfo} from '../../selector/shopSelector'
import {fetchUserOwnedShopInfo} from '../../action/shopAction'
import * as authSelector from '../../selector/authSelector'


const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class Mine extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      if(this.props.isUserLogined) {
        this.props.fetchUserOwnedShopInfo()
        this.props.fetchDoctorInfo({id: this.props.userInfo.id})
        this.props.fetchUserFollowees()
      }
    })
  }

  componentDidMount() {

  }

  _onRefresh() {
    this.props.fetchDoctorInfo({id: this.props.userInfo.id})
    this.props.fetchUserOwnedShopInfo()
  }

  doctorCertificationImage(status) {
    if (status === undefined)
      return require('../../assets/images/main_doctor.png')
    switch (status)
    {
      case 0: //审核失败
        return require('../../assets/images/doctor_not_pass.png')
      case 1: //审核成功
        return require('../../assets/images/doctor_approved.png')
      case 2: //审核中
        return require('../../assets/images/doctor_in_review.png')
    }
  }
  doctorCertificationAction= (status)=> {
    // console.log("doctorCertificationAction start status:", status)
    if (status === undefined)
      Actions.DCTOR_CERTIFICATION()
    switch (status)
    {
      case 0:
        Actions.DCTOR_REVISE()
        break
      case 1:
        if (this.props.doctorInfo.desc && this.props.doctorInfo.spec) {
          Actions.DOCTOR()
        } else if (!this.props.doctorInfo.desc) {
          Actions.DOCTOR_INTRO({interKey: 'mine'})
        } else if (this.props.doctorInfo.desc && !this.props.doctorInfo.spec) {
          Actions.DOCTOR_SPEC({interKey: 'mine'})
        }
        break
      case 2:
        Actions.DCTOR_CHECKING()
        break
      default:
        break
    }
  }

  shopManage() {
    // console.log('mine.index...this.props.userOwnedShopInfo===', this.props.userOwnedShopInfo)
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
    }else {
      if(this.props.userOwnedShopInfo.id) {
        Actions.SHOP_MANAGE_INDEX()
      }else {
        Actions.SHOPR_EGISTER()
      }

    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.left}>
            <TouchableOpacity style={{marginTop: normalizeH(14), marginLeft: normalizeW(12)}} onPress={() => Actions.SETTING()}>
              <Text style={styles.texts}>设置</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.middle}>
            <TouchableOpacity style={{alignItems: 'center', marginTop: normalizeH(26)}} onPress={() => Actions.PROFILE()}>
              <Image style={{width: normalizeW(46), height: normalizeH(46), borderRadius: normalizeW(23), overflow: 'hidden'}}
                     source={this.props.userInfo.avatar? {uri: (this.props.userInfo.avatar)}: require('../../assets/images/login_qq@1x.png')}/>
              <Text style={styles.texts}>{this.props.userInfo.nickname? this.props.userInfo.nickname: '我爱我家'}</Text>
            </TouchableOpacity>
            <View style={styles.credits}>
              {/*<Image source={require('../../assets/images/mine_wallet.png')}></Image>*/}
              <Text>积分</Text>
              <Text>335</Text>
            </View>
          </View>
          <View style={styles.right}>
            <TouchableOpacity style={{marginTop: normalizeH(16), marginRight: normalizeW(25), alignItems: 'flex-end'}}>
              <Image style={{width: 20, height: 20}}  source={require('../../assets/images/扫一扫.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={{marginTop: normalizeH(14), marginRight: normalizeW(12), alignItems: 'flex-end'}}>
              <Image style={{width: 20, height: 23}}  source={require('../../assets/images/home_message.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView refreshControl={
                      <RefreshControl
                        refreshing={false}
                        onRefresh={() => {this._onRefresh()}}
                        colors={['#ff0000', '#00ff00','#0000ff','#3ad564']}
                        progressBackgroundColor="#ffffff"
                      /> }>
          <View style={styles.azone}>
            <View style={{flex: 1}} >
              <TouchableOpacity style={styles.aindex} onPress= {() => this.doctorCertificationAction(this.props.doctorInfo.status)}>
                <Image source={this.doctorCertificationImage(this.props.doctorInfo.status)}/>
                <Text style={styles.textStyle}>医生认证</Text>
              </TouchableOpacity>

            </View>
            <View style={{flex: 1}}>
              <TouchableOpacity style={styles.aindex} onPress= {()=> {Actions.PROMOTER_AUTH()}}>
                <Image source={require('../../assets/images/mine_promote.png')}/>
                <Text style={styles.textStyle}>推广招聘</Text>
              </TouchableOpacity>

            </View>
            <View style={{flex: 1}}>
              <TouchableOpacity style={styles.aindex} onPress= {()=> {this.shopManage()}}>
                <Image source={require('../../assets/images/mine_store.png')}/>
                <Text style={styles.textStyle}>我的店铺</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              <TouchableOpacity style={styles.aindex} onPress= {()=> {}}>
                <Image source={require('../../assets/images/mine_prize.png')}/>
                <Text style={styles.textStyle}>推荐有奖</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bzone}>
            <View style={styles.bheader}>
              <View style={{marginTop: normalizeH(8), marginLeft: normalizeW(19), marginBottom: normalizeH(3)}}>
                <Text style={[styles.textStyle, {fontSize: 12, letterSpacing: 0.34}]}>我的互动</Text>
              </View>

            </View>
            <View style={styles.bbody}>
              <View style={styles.bindex}>
                <Image source={require('../../assets/images/mine_ask.png')}/>
                <Text style={[styles.textStyle, {color: '#636363', letterSpacing: 0.18}]}>提问</Text>
              </View>
              <TouchableOpacity style={styles.bindex} onPress= {()=> {Actions.MYATTENTION()}}>
                <Image source={require('../../assets/images/mine_focuson.png')}/>
                <Text style={[styles.textStyle, {color: '#636363', letterSpacing: 0.18}]}>关注</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bindex} onPress= {()=> {Actions.MYTOPIC()}}>
                <Image source={require('../../assets/images/mine_artical.png')}/>
                <Text style={[styles.textStyle, {color: '#636363', letterSpacing: 0.18}]}>帖子</Text>
              </TouchableOpacity>
              <View style={styles.bindex}>

                <TouchableOpacity onPress={()=>{Actions.FAVORITE_ARTICLES()}}>
                <Image source={require('../../assets/images/favorite.png')}/>
                <Text style={[styles.textStyle, {color: '#636363', letterSpacing: 0.18}]}>收藏</Text>
                  </TouchableOpacity>
              </View>

            </View>
          </View>
          <View style={styles.czone}>
            <View style={styles.cindex}>
              <Image source={require('../../assets/images/mine_wallet.png')}/>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>钱包</Text>
            </View>
            <View style={styles.cindex}>
              <Image source={require('../../assets/images/mine_signin.png')}/>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>每日签到</Text>
            </View>
            <View style={styles.cindex}>
              <Image source={require('../../assets/images/mine_service.png')}/>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>联系客服</Text>
            </View>
            <View style={styles.cindex}>
              <Image source={require('../../assets/images/mine_feedback.png')}/>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>意见反馈</Text>
            </View>
          </View>

        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let userInfo = activeUserInfo(state)
  let doctorInfo = activeDoctorInfo(state)
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  const isUserLogined = authSelector.isUserLogined(state)
  return {
    userInfo: userInfo,
    doctorInfo: doctorInfo,
    userOwnedShopInfo: userOwnedShopInfo,
    isUserLogined: isUserLogined
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchDoctorInfo,
  fetchUserOwnedShopInfo,
  fetchUserFollowees
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Mine)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    // backgroundColor: '#F5FCFF',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  },
  header: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(20)
      }
    }),
    width: PAGE_WIDTH,
    height: normalizeH(125),
    backgroundColor: 'rgba(80, 227, 194, 0.19)',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  left: {
    flex: 1,

  },
  middle: {
    flex:3,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
  },
  credits: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: normalizeW(91),
    height: normalizeH(19),
    borderRadius: 5,
    backgroundColor: 'rgba(80, 227, 194, 1)',
  },
  texts: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#686868',
    letterSpacing: 0.4,

  },
  azone: {
    flexDirection: 'row',
    width: PAGE_WIDTH,
    height: normalizeH(80),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  aindex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bzone: {
    marginTop: normalizeH(15),
    width: PAGE_WIDTH,
    height: normalizeH(119),
    backgroundColor: '#FFFFFF',
  },
  bheader: {
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#F4F4F4',
  },
  bbody: {
    flexDirection: 'row',
  },
  bindex: {
    flex: 1,
    alignItems: 'center',
    marginTop: normalizeH(11),
    borderRightWidth: 1,
    borderRightColor: '#F4F4F4',
  },
  czone: {
    width: PAGE_WIDTH,
    marginTop: normalizeH(15),
    height: normalizeH(175),
  },
  cindex: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: normalizeW(25),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: normalizeH(2),

  },
  textStyle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 17,
    color: '#686868',
    letterSpacing: 0.43,
  }

})

