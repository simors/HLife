/**
 * Created by yangyang on 2016/12/26.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Platform,
  TouchableOpacity
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {persistor} from '../../store/persistStore'
import * as reactInvokeMethod from '../../util/reactMethodUtils'
import RNRestart from 'react-native-restart'
import * as Toast from '../../components/common/Toast'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class Setting extends Component {
  constructor(props) {
    super(props)
  }

  clearApplication() {
    // persistor.purge()
    // Toast.show('清除成功')
    // setTimeout(() => {
    //   Actions.HOME_INDEX()
    //   if (Platform.OS == 'ios') {
    //     reactInvokeMethod.reload()
    //   } else {
    //     RNRestart.Restart()
    //   }
    // }, 2000)

    Actions.POPUP({
      title: '提示',
      content: ['确认清除缓存？'],
      comfirmAction: () => {
        Actions.pop()
        persistor.purge()
        Toast.show('清除成功')
        setTimeout(() => {
          if (Platform.OS == 'ios') {
            reactInvokeMethod.reload()
          } else {
            RNRestart.Restart()
          }
        }, 2000)
      }
    })
  }

  clearUserInfo() {
    persistor.purge(['AUTH'])
    Toast.show('清除成功')
    setTimeout(() => {
      Actions.HOME_INDEX()
      // if (Platform.OS == 'ios') {
      //   reactInvokeMethod.reload()
      // } else {
      //   RNRestart.Restart()
      // }
    }, 2000)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="设置"
        />
        <View style={styles.itemContainer}>
          <View style={{borderBottomWidth: 1, borderColor: '#F7F7F7'}}>
            <TouchableOpacity style={styles.selectItem} onPress={() => this.clearApplication()}>
              <Image source={require('../../assets/images/mine_collection.png')}></Image>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>清空缓存</Text>
            </TouchableOpacity>
          </View>
          <View style={{borderBottomWidth: 1, borderColor: '#F7F7F7'}}>
            <TouchableOpacity style={styles.selectItem} onPress={() => this.clearUserInfo()}>
              <Image source={require('../../assets/images/mine_collection.png')}></Image>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>退出登录</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Setting)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
  },
  selectItem: {
    flexDirection: 'row',
    height: normalizeH(45),
    paddingLeft: normalizeW(25),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: normalizeH(2),
    marginTop: normalizeH(5),
  },
  textStyle: {
    fontSize: 17,
    color: '#4A4A4A',
    letterSpacing: 0.43,
  }
})