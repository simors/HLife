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
  Animated
} from 'react-native'

import dismissKeyboard from 'react-native-dismiss-keyboard'

export default class KeyboardAwareToolBar extends Component {

  static defaultProps = {
    isAnimated : true
  }

  constructor(props) {
    super(props)

    this.state = {
      keyboardHeight : new Animated.Value(0),
      isTypingDisabled : false,
      touchStarted : false
    }

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this)
    this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this)
    this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this)
    this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this)
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

  }

  componentWillUnmount() {

  }

  setKeyboardHeight(height) {
    if (this.props.isAnimated === true) {
      Animated.timing(this.state.keyboardHeight, {
        toValue: height,
        duration: 210,
      }).start()
    }else {
      this.setState({
        ...this.state,
        keyboardHeight : height
      })
    }
  }

  setIsTypingDisabled(value) {
    this.setState({
      ...this.state,
      isTypingDisabled : value
    })
  }

  onKeyboardWillShow(e) {
    this.setIsTypingDisabled(true)
    this.setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : e.end.height)
  }

  onKeyboardWillHide() {
    this.setIsTypingDisabled(true)
    this.setKeyboardHeight(0)
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
      <Animated.View style={[styles.container, {bottom: this.state.keyboardHeight}, this.props.containerStyle]}>
        {this.props.children}
      </Animated.View>
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
