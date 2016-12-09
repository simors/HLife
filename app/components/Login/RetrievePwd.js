/**
 * Created by lilu on 2016/12/2.
 * Modified by wuxingyu on 2016/12/8.
 */

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';

import Header from '../common/Header'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import PasswordInput from '../common/Input/PasswordInput'
import {normalizeW, normalizeH} from '../../util/Responsive'
import {
  Button,
} from 'react-native-elements'

let commonForm = Symbol('commonForm')
const passwordInput = {
  formKey: commonForm,
  stateKey: Symbol('passwordInput')
}

const PAGE_WIDTH = Dimensions.get('window').width;

export class RetrievePwd extends Component {

  constructor(props) {
    super(props)
  }
  onButtonPress = () => {
    Actions.REG4VERIFYCODE()
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.RETRIEVE_PASSWORD()}
          title="找回密码"
          rightType=""
        />
        <View style={styles.body}>
          <PasswordInput {...passwordInput} containerStyle={styles.inputBox}/>
          <Button
            buttonStyle={styles.btn}
            onPress={this.onButtonPress}
            title="开始使用"
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  body: {
    paddingTop: normalizeH(64),
    width: PAGE_WIDTH,
  },
  inputBox: {
    marginBottom: normalizeW(25)
  },
  btn: {
    height: normalizeH(50),
    marginLeft: normalizeW(17),
    marginRight: normalizeW(17),
    backgroundColor: '#50E3C2',
    marginBottom: normalizeH(24)
  },
});

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RetrievePwd)