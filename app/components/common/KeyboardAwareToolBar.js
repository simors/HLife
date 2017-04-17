/**
 * Created by zachary on 2017/1/3.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  Keyboard,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'

import dismissKeyboard from 'react-native-dismiss-keyboard'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class KeyboardAwareToolBar extends Component {

  static defaultProps = {
    isAnimated : true
  }

  constructor(props) {
    // console.log('constructor.props=====', props)
    super(props)
    this._keyboardHeight = new Animated.Value(this.props.initKeyboardHeight || 0)
    this._isTypingDisabled = false
    this._touchStarted = false

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this)
    this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this)
    this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this)
    this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this)

    this.state = {
      showOverlay: false,
      top: PAGE_HEIGHT
    }
  }

  componentDidMount() {
    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow)
      Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide)
    }
  }

  componentWillUnmount() {
    if (Platform.OS == 'ios') {
      Keyboard.removeListener('keyboardWillShow', this.onKeyboardWillShow)
      Keyboard.removeListener('keyboardWillHide', this.onKeyboardWillHide)
    } else {
      Keyboard.removeListener('keyboardDidShow', this.onKeyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', this.onKeyboardDidHide)
    }
  }

  componentWillReceiveProps(nextProps = {}) {
    // console.log('componentWillReceiveProps.nextProps=====', nextProps)
  }

  componentWillUnmount() {

  }

  getKeyboardHeight() {
    return this._keyboardHeight
  }

  setKeyboardHeight(height) {
    if (this.props.isAnimated === true) {
      Animated.timing(this._keyboardHeight, {
        toValue: height,
        duration: 260,
      }).start()
    }else {
      this._keyboardHeight = height
    }

  }

  getIsTypingDisabled(){
    return this._isTypingDisabled
  }

  setIsTypingDisabled(value) {
    this._isTypingDisabled = value
  }

  rePosition() {
    return this.getKeyboardHeight()
  }

  onKeyboardWillShow(e) {
    // console.log('onKeyboardWillShow.e=', e)
    // console.log('onKeyboardWillShow.e.endCoordinates=', e.endCoordinates)
    // console.log('onKeyboardWillShow. e.end=',  e.end)
    // console.log('onKeyboardWillShow. Platform.Version=',  Platform.Version)
    this.setIsTypingDisabled(true)
    if (Platform.OS === 'android') {
      this.setKeyboardHeight(0)
    }else{
      this.setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : e.end.height)
    }
    this.setState({
      top: 0,
      showOverlay: true
    })
  }

  onKeyboardWillHide() {
    this.setIsTypingDisabled(true)
    this.setKeyboardHeight(this.props.initKeyboardHeight || 0)
    this.setState({
      top: PAGE_HEIGHT,
      showOverlay: false
    })
  }

  onKeyboardDidShow(e) {
    if (Platform.OS === 'android') {
      this.onKeyboardWillShow(e)
    }
    this.setIsTypingDisabled(false)
  }

  onKeyboardDidHide(e) {
    if (Platform.OS === 'android') {
      this.onKeyboardWillHide(e)
    }
    this.setIsTypingDisabled(false)
  }

  onTouchStart() {
    this._touchStarted = true
  }

  onTouchMove() {
    this._touchStarted = false
  }

  // handle Tap event to dismiss keyboard
  onTouchEnd() {
    if (this._touchStarted === true) {
      dismissKeyboard()
    }
    this._touchStarted = false
  }

  render() {
    return (
      <View style={[{position:'absolute',left:0,height:PAGE_HEIGHT,width: PAGE_WIDTH}, {top:this.state.top}]}>
        {this.state.showOverlay
          ? <TouchableWithoutFeedback onPress={()=>{this.onKeyboardWillHide();dismissKeyboard()}}>
              <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}/>
            </TouchableWithoutFeedback>
          : null
        }
        <Animated.View style={[styles.container, {bottom: this.rePosition()}, this.props.containerStyle]}>
          {this.props.children}
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
    backgroundColor: '#FFFFFF',
  },
})
