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
      content: ''
    }
  }

  onSend() {
    this.props.onSend(this.state.content)
  }

  onChangeText(text) {
    this.setState({
      content: text
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          ref={(input) =>{this.props.replyInputRefCallBack(input)}}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          multiline={this.props.multiline}
          onChange={this.props.onChange}
          onChangeText={this.onChangeText.bind(this)}
          style={[styles.textInput, this.props.textInputStyle]}
          value={this.props.text}
          enablesReturnKeyAutomatically={true}
          underlineColorAndroid="transparent"
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
    height: 40,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 16,
    marginTop: Platform.select({
      ios: 6,
      android: 0,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
    }),
  },
  btnContainer: {
    padding: 5,
    backgroundColor: THEME.colors.green,
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: em(12),
  }
})
