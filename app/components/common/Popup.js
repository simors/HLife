/**
 * Created by yangyang on 2016/12/26.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native'
import Button from 'react-native-button'
import {Actions} from "react-native-router-flux"

export default class Popup extends Component {
  constructor(props) {
    super(props)
  }

  renderContent = () => {
    let {content} = this.props
    if (content instanceof Array) {
      return content.map((item)=> {
        return (<Text style={styles.info}>
            {item}
          </Text>
        )
      })
    } else {
      return (
        <Text style={styles.info}>
          {content}
        </Text>
      )
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={styles.statusHeader}>
            <Image source={require('../../assets/images/Alert_bg.png')}
                   style={styles.headerImg}>
              <Text style={styles.title}>
                {this.props.title ? this.props.title : '状态更换提示'}
              </Text>
            </Image>
          </View>
          <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 126,
          }}>
            {this.renderContent()}
          </View>
          <View style={styles.btnGroup}>
            <Button
              containerStyle={styles.cancelBtn}
              style={{fontSize: 16, color: '#757575'}}
              onPress={()=> {
                this.props.cancelAction ? this.props.cancelAction() : Actions.pop()
              }}>取消</Button>
            <Button
              containerStyle={styles.comfirmBtn}
              style={{fontSize: 16, color: '#FFFFFF'}}
              onPress={()=> {
                this.props.comfirmAction ? this.props.comfirmAction() : ''
              }}>确定</Button>
          </View>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
    width: 305,
    minHeight: 238,
    borderRadius: 5,
  },
  statusHeader: {
    width: 305,
    height: 48,
    flexDirection: 'row',
    backgroundColor: '#0081F0',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'center',
  },
  headerImg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 17,
    color: '#ffffff',
    fontFamily: 'PingFangSC-Medium',
  },
  info: {
    fontSize: 16,
    color: '#384548',
    fontFamily: 'PingFangSC-Regular',
    alignItems: 'center',
  },
  btnGroup: {
    marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 64,
  },
  cancelBtn: {
    width: 125,
    justifyContent: 'center',
    borderRadius: 4,
    height: 44,
    backgroundColor: '#F5F5F5'
  },
  comfirmBtn: {
    width: 125,
    marginLeft: 17,
    justifyContent: 'center',
    borderRadius: 4,
    height: 44,
    backgroundColor: '#0081F0'
  },
})