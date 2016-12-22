/**
 * Created by yangyang on 2016/12/22.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'

export default class CustomNameView extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles[this.props.position].container}>
        <View style={styles[this.props.position].wrapper}>
          <Text style={nameStyles.nameText}>{this.props.currentMessage.user.name}</Text>
        </View>
      </View>
    )
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
    },
    wrapper: {
      marginLeft: 60,
      marginBottom: 5,
      justifyContent: 'flex-end',
    },
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-end',
    },
    wrapper: {
      marginRight: 60,
      marginBottom: 5,
      justifyContent: 'flex-end',
    },
  }),
};

const nameStyles = StyleSheet.create({
  nameText: {
    fontSize: 11,
    color: '#9B9B9B'
  }
})