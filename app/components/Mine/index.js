import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,

} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../util/Responsive'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height


export default class Launch extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.left}>
            <Text style={styles.texts}>设置</Text>
          </View>
          <View style={styles.middle}>
            <Image style={{width: 46, height: 46}}  source={require('../../assets/images/find_happy.png')}></Image>
            <Text style={styles.texts}>我爱我家</Text>
            <View style={styles.credits}>
              <Image source={require('../../assets/images/mine_wallet.png')}></Image>
              <Text>积分</Text>
              <Text>335</Text>
            </View>
          </View>
          <View style={styles.right}>
            <TouchableOpacity>
              <Image style={{width: 20, height: 23}}  source={require('../../assets/images/home_message.png')} ></Image>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.azone}>
          <View style={styles.aindex}>
            <Image source={require('../../assets/images/mine_doctor.png')}></Image>
            <Text style={styles.atext}>医生认证</Text>
          </View>
          <View style={styles.aindex}>
            <Image source={require('../../assets/images/mine_promote.png')}></Image>
            <Text style={styles.atext}>推广招聘</Text>
          </View>
          <View style={styles.aindex}>
            <Image source={require('../../assets/images/mine_store.png')}></Image>
            <Text style={styles.atext}>我的店铺</Text>
          </View>
          <View style={styles.aindex}>
            <Image source={require('../../assets/images/mine_prize.png')}></Image>
            <Text style={styles.atext}>推荐有奖</Text>
          </View>
        </View>
        <View style={styles.bzone}>
          <View style={styles.bheader}>
            <View style={{marginTop: normalizeH(8), marginLeft: normalizeW(19), marginBottom: normalizeH(3)}}>
              <Text style={styles.atext}>我的互动</Text>
            </View>

          </View>
          <View style={styles.bbody}>
            <View style={styles.bindex}>
              <Image source={require('../../assets/images/mine_promote.png')}></Image>
              <Text style={styles.btext}>提问</Text>
            </View>
            <View style={styles.bindex}>
              <Image source={require('../../assets/images/mine_promote.png')}></Image>
              <Text style={styles.btext}>关注</Text>
            </View>
            <View style={styles.bindex}>
              <Image source={require('../../assets/images/mine_promote.png')}></Image>
              <Text style={styles.btext}>帖子</Text>
            </View>
            <View style={styles.bindex}>
              <Image source={require('../../assets/images/mine_promote.png')}></Image>
              <Text style={styles.btext}>评论</Text>
            </View>

          </View>
        </View>
        <View style={styles.czone}>
          <View style={styles.cindex}>
            <Image source={require('../../assets/images/mine_wallet.png')}></Image>
            <Text style={styles.ctext}>钱包</Text>
          </View>
          <View style={styles.cindex}>
            <Image source={require('../../assets/images/mine_collection.png')}></Image>
            <Text style={styles.ctext}>收藏</Text>
          </View>
          <View style={styles.cindex}>
            <Image source={require('../../assets/images/mine_signin.png')}></Image>
            <Text style={styles.ctext}>每日签到</Text>
          </View>
          <View style={styles.cindex}>
            <Image source={require('../../assets/images/mine_service.png')}></Image>
            <Text style={styles.ctext}>联系客服</Text>
          </View>
          <View style={styles.cindex}>
            <Image source={require('../../assets/images/mine_feedback.png')}></Image>
            <Text style={styles.ctext}>意见反馈</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  },
  header: {
    marginTop: normalizeH(20),
    width: PAGE_WIDTH,
    height: normalizeH(125),
    backgroundColor: 'rgba(80, 227, 194, 0.19)',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  left: {
    marginLeft: normalizeW(17),
    marginTop: normalizeH(15),
  },
  middle: {
    marginTop: normalizeH(26),
    marginBottom: normalizeH(12),
    alignItems: 'center'


  },
  credits: {
    flexDirection: 'row',
    width: 91,
    height: 17,
    borderRadius: 5,
    backgroundColor: 'rgba(80, 227, 194, 1)',
  },
  right: {
    marginRight: normalizeW(12),
    marginTop: normalizeH(14),
    opacity: 1,
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
    alignItems: 'center'
  },
  aindex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  atext: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#686868',
    letterSpacing: 0.34,
  },
  bzone: {
    width: PAGE_WIDTH,
    height: normalizeH(119),
  },
  bheader: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
  },
  bbody: {
    flexDirection: 'row',


  },
  bindex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalizeH(7),
    marginBottom: normalizeH(11),
    borderRightWidth: 1,
    borderRightColor: '#F4F4F4',
  },
  btext: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#636363',
    letterSpacing: 0.19,
  },
  czone: {
    width: PAGE_WIDTH,
    marginTop: normalizeH(15),
    height: normalizeH(206),
  },
  cindex: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: normalizeW(25),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7F7',
  },
  ctext: {
    paddingLeft: normalizeW(20),
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#686868',
    letterSpacing: 0.34,
  },

})

