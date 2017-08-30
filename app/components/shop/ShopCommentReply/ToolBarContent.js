/**
 * Created by zachary on 2017/1/3.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'

export default class ToolBarContent extends Component {

  static defaultProps = {
    placeholder: '回复:',
    multiline: true
  }

  constructor(props) {
    super(props)

    this.state = {
      content: '',
      height: 50,
    }
  }

  onSend() {
    this.props.onSend(this.state.content)
    if(this.input) {
      this.input.setNativeProps({text: ''})
    }
  }

  onChangeText(text) {
    this.setState({
      content: text
    })
    if(this.props.onChangeText){
      this.props.onChangeText(text)
    }
  }

  refFunc(input) {
    this.input = input
    this.props.replyInputRefCallBack(input)
  }

  _onChange(event) {
    const textInputContentHeight = event.nativeEvent.contentSize.height
    if(textInputContentHeight < 80) {
      this.setState({
        height: textInputContentHeight,
      })
    }

    if(this.props.onChange) {
      this.props.onChange(event)
    }
  }

  render() {
    return (
      <View style={[styles.container, {height: this.state.height}]}>
        <TextInput
          ref={(input) =>{this.refFunc(input)}}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          multiline={this.props.multiline}
          numberOfLines={this.props.numberOfLines || 1}
          onChange={this._onChange.bind(this)}
          onChangeText={this.onChangeText.bind(this)}
          style={[styles.textInput, this.props.textInputStyle]}
          value={this.props.initValue}
          enablesReturnKeyAutomatically={true}
          underlineColorAndroid="transparent"
          keyboardType={this.props.keyboardType || 'default'}
          {...this.props.textInputProps}
        />

        <TouchableOpacity
          style={[styles.btnContainer, this.props.btnContainerStyle]}
          onPress={() => {this.onSend()}}
        >
          <Text style={[styles.btnText, this.props.btnTextStyle]}>{this.props.label || '发表'}</Text>
        </TouchableOpacity>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    margin:0,
    padding: 10,
    fontSize: em(16),
  },
  btnContainer: {
    padding: 5,
    width: 60,
    backgroundColor: THEME.colors.green,
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: em(16),
  }
})
