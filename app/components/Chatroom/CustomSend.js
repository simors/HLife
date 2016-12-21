/**
 * Created by yangyang on 2016/12/21.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native'

export default class CustomSend extends Component {
  render() {
    if (this.props.text.trim().length > 0) {
      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
            this.props.onSend({text: this.props.text.trim()}, true);
          }}
        >
          <Text style={[styles.text, this.props.textStyle]}>{this.props.label}</Text>
        </TouchableOpacity>
      );
    }
    return <View/>;
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
    backgroundColor: '#50E3C2',
    borderRadius: 5,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: 'transparent',
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
});

CustomSend.defaultProps = {
  text: '',
  onSend: () => {},
  label: '发送',
  containerStyle: {},
  textStyle: {},
};