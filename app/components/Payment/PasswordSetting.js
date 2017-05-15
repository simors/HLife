/**
 * Created by wanpeng on 2017/4/18.
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
  InteractionManager,
  NativeModules
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import * as authSelector from '../../selector/authSelector'
import Header from '../common/Header'
import THEME from '../../constants/themes/theme1'

class PasswordSetting extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title='取款设置'
        />
        <View style={styles.body}>
          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <Text style={styles.itemText}>修改取款密码</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <Text style={styles.itemText}>找回取款密码</Text>
          </TouchableOpacity>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(PasswordSetting)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainerStyle: {
    borderBottomWidth: 1,
    backgroundColor: '#F9F9F9'
  },
  headerLeftStyle: {
    color: THEME.colors.green,
    fontSize: 24
  },
  headerTitleStyle: {
    color: '#030303',
    fontSize: 17,
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
  },
  item: {
    paddingLeft: normalizeW(30),
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: normalizeH(63),
    borderBottomWidth: 1,
    borderColor: '#AAAAAA'
  },
  itemText: {
    fontSize: 17,
    color: '#5A5A5A'
  }
})


