/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
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
import Icon from 'react-native-vector-icons/Ionicons'


const PAGE_WIDTH = Dimensions.get('window').width;
const PAGE_HEIGHT = Dimensions.get('window').height;
const SIM_PAGE_WIDTH = PAGE_WIDTH / 375;
const SIM_PAGE_HEIGHT = PAGE_HEIGHT / 667;




class HideOrShow extends Component{
  constructor(props){
    super(props)
  }

}

export default class register_1 extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/*<View style={styles.top}>*/}
        {/*</View>*/}
        <View style={styles.setPsw}>

          <Icon
            name='ios-arrow-back'
            style={styles.chevronLeft}/>
          <Text style={styles.title}>找回密码</Text>

        </View>
        <View style={styles.pswView}>
          {/*<Text style={styles.pswText}></Text>*/}
          <TextInput
            placeholder={'重设密码（6～10位数字或密码）'}
            style={styles.pswText}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={(text) => {
              this.changeUserState('userName', text)
            }}
          />
          <Image source={require('../../../assets/images/code_close_eye.png')} style={styles.pswEye}></Image>

        </View>
        <View style={styles.start}>
          <Text style={styles.startText}>开始使用</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  pswView: {
    //left:14*SIM_PAGE_WIDTH,
    marginTop: 47 * SIM_PAGE_HEIGHT,
    height: 50 * SIM_PAGE_HEIGHT,
    width: 341 * SIM_PAGE_WIDTH,
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    flexDirection: 'row',
  },
  top: {
    left: 1,
    top: -1,
    width: PAGE_WIDTH,
    height: 20,
    backgroundColor: '#F3F3F3'
  },
  setPsw: {
    backgroundColor: '#f3f3f3',
    paddingTop: 20 * SIM_PAGE_HEIGHT,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#B2B2B2'

  },
  start: {
    marginTop: 31 * SIM_PAGE_HEIGHT,
    //left:14*SIM_PAGE_WIDTH,
    //top:31*SIM_PAGE_HEIGHT,
    width: 341 * SIM_PAGE_WIDTH,
    height: 50 * SIM_PAGE_HEIGHT,
    backgroundColor: '#50E3C2'
  },
  chevronLeft: {
    // left:12*SIM_PAGE_WIDTH,
    // top:31*SIM_PAGE_HEIGHT,
    // width:13*SIM_PAGE_WIDTH,
    // height:21*SIM_PAGE_HEIGHT,
    // //color:'#50E3C2'
    position: 'absolute',
    left: 9,
    bottom: 14,
    width: 13,
    height: 21,
    zIndex: 10,
    //fontSize: em(24),
    fontSize: 24 * SIM_PAGE_HEIGHT,
    color: '#50E3C2'
  },
  title: {
    flex: 1,
    lineHeight: 44,
    fontSize: 17 * SIM_PAGE_WIDTH,
    color: '#030303',
    textAlign: 'center',
    letterSpacing: -1,
  },
  setPswText: {

    left: 154 * SIM_PAGE_WIDTH,
    top: 33 * SIM_PAGE_HEIGHT,
    width: 68 * SIM_PAGE_WIDTH,
    height: 36 * SIM_PAGE_HEIGHT,
    color: '#030303',
    fontSize: 17 * SIM_PAGE_WIDTH,
    letterSpacing: -1,

  },
  pswText: {

    marginTop:19*SIM_PAGE_HEIGHT,
    marginLeft:5*SIM_PAGE_WIDTH,
    marginBottom:5*SIM_PAGE_HEIGHT,
    padding:5*SIM_PAGE_HEIGHT,
    fontSize:17*SIM_PAGE_HEIGHT,
    width:200*SIM_PAGE_WIDTH,
    height:26*SIM_PAGE_HEIGHT,
    color: '#666',
    //flex:5,
  },
  pswEye: {
    left: 60 * SIM_PAGE_WIDTH,
    top: 19,
    width: 35 * SIM_PAGE_WIDTH,
    height: 12 * SIM_PAGE_HEIGHT,
    //color:'#50E3C2'
    //flex:1,
  },
  startText: {
    top: 19 * SIM_PAGE_HEIGHT,
    left: 132 * SIM_PAGE_WIDTH,
    height: 18 * SIM_PAGE_HEIGHT,
    width: 72 * SIM_PAGE_WIDTH,
    fontSize: 18 * SIM_PAGE_WIDTH,
    color: '#FFFFFF',
    letterSpacing: -1,
  }
});

AppRegistry.registerComponent('register_1', () => register_1);
