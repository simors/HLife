/**
 * Created by lilu on 2017/1/12.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import ShareModal from '../../common/ShareModal'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as appConfig from '../../../constants/appConfig'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import * as authSelector from '../../../selector/authSelector'

class GetInviteCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible : false
    }
  }

  completeShopInfo() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
    }else {
      Actions.COMPLETE_SHOP_INFO()
    }
  }
  openModel(callback) {
    this.setState({
      modalVisible: true
    })
    if(callback && typeof callback == 'function'){
      callback()
    }
  }
  closeModel(callback) {
    this.setState({
      modalVisible: false
    })
    if(callback && typeof callback == 'function'){
      callback()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="text"
          leftText="x"
          leftPress={() => Actions.pop()}
          title="邀请码获取方式"
        />
        <View style={styles.body}>
          <ScrollView>
            <View>
              <Image style={styles.image} source={require("../../../assets/images/shop_congratuation.png")} />
              <Text style={styles.title}>加入{appConfig.APP_NAME}推广</Text>
            </View>

            <View style={styles.illustration}>
              <Text style={styles.text}>尊敬的用户：</Text>
              <Text style={styles.text}>&nbsp;&nbsp;&nbsp;&nbsp;为完善推广系统，方便玩家推荐好友享受游戏的乐趣，波克城市介绍人系统说明。</Text>
              <Text style={styles.text}>&nbsp;&nbsp;&nbsp;&nbsp;1、等级为2级及以上的玩家，只要玩波克平台下的游戏（除推推乐、杀闪封神以及明星山庄出售的元宝），都有机会获得“明信片”，获得的“明信片”可以在大厅背包中查看。</Text>
              <Text style={styles.text}>&nbsp;&nbsp;&nbsp;&nbsp;2、您可以将“明信片”赠送给朋友，朋友用手机号注册波克城市帐号即可获得一级礼包。同时，您与朋友建立牌友关系。</Text>
            </View>

            <CommonButton
              buttonStyle={{marginTop:normalizeH(20)}}
              title="邀请好友"
              onPress={()=>{this.openModel()}}
            />
            <CommonButton
              buttonStyle={{marginTop:normalizeH(15)}}
              title="超值购买"
              onPress={()=>{}}
            />
          </ScrollView>

        </View>
        <ShareModal  modalVisible={this.state.modalVisible}
                     modalTitle="精选栏目"
                     closeModal={() => this.closeModel()}/>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)
  return {
    isUserLogined: isUserLogined,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GetInviteCode)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green
  },
  headerLeftStyle: {
    color: '#fff',
    fontSize: em(26)
  },
  headerTitleStyle: {
    color: '#fff',
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
  },
  image: {
    height:normalizeH(200)
  },
  title: {
    position: 'absolute',
    left: normalizeW(36),
    bottom: normalizeH(25),
    fontSize: em(28),
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'transparent'
  },
  illustration: {
    padding: 15
  },
  text: {
    color: THEME.colors.lighter,
    lineHeight: em(20),
    fontSize: em(15),
    letterSpacing: 1
  }

})