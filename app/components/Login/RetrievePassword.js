/**
 * Created by wanpeng on 2016/12/2.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import {
  Button
} from 'react-native-elements'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class RetrievePassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Verify_code: "",
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            name='ios-arrow-back'
            style={styles.chevronLeft}/>
          <Text style={styles.title}>找回密码</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.titleinfo}>填写注册时的手机号码并验证</Text>
          <TextInput
            placeholder={'输入手机号'}
            style={styles.inputField}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={(text) => {
              this.changeUserState('userName', text)
            }}
          />
          <View style={styles.inputField}>
            <TextInput
              placeholder={'输入验证码'}
              style={styles.inputverifycode}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={(text) => {
                this.changeUserState('userName', text)
              }}
            />
            <Button
              buttonStyle={styles.getverifycodebtn}
              onPress={this.onButtonPress}
              title="获取验证码"
            />
          </View>

        </View>
        <Button
          buttonStyle={styles.btn}
          onPress={this.onButtonPress}
          title="下一步"
        />

      </View>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    Verify_code: "8888",
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RetrievePassword)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#f3f3f3',
    paddingTop: normalizeH(20),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#B2B2B2'
  },
  chevronLeft: {
    position: 'absolute',
    left: 9,
    bottom: 14,
    width: 13,
    height: 21,
    zIndex: 10,
    fontSize: em(24),
    color: '#50E3C2'
  },
  title: {
    flex: 1,
    lineHeight: 44,
    fontSize: em(17),
    color: '#030303',
    textAlign: 'center'
  },
  body: {
    paddingTop: normalizeH(64),
    width: PAGE_WIDTH,
    paddingLeft: normalizeW(18),
    paddingRight: normalizeW(17),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  inputField: {
    height: normalizeH(50),
    paddingLeft: normalizeW(10),
    marginBottom: normalizeH(31),
    paddingRight: normalizeW(10),
    borderWidth: 1,
    borderColor: '#E9E9E9',
    backgroundColor: '#F3F3F3',
    color: '#666',
    fontSize: em(16),flexDirection:'row',
  },
  btn: {
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    backgroundColor: '#50E3C2',
    marginBottom: normalizeH(24)
  },
  inputverifycode:{
    height:normalizeH(50),
    width:normalizeW(196),
  },
  getverifycodebtn:{
    marginLeft:0,
    marginTop:0,
    height:normalizeH(50),
    width:normalizeW(134),
    backgroundColor:'#50E3C2',
  },
  titleinfo: {
    color: '#50E3C2',
    fontSize: em(18),
    alignSelf: 'flex-start',
    marginBottom: normalizeH(35)
  }

})