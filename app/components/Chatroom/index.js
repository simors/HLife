/**
 * Created by yangyang on 2016/12/19.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native'

const PAGE_WIDTH=Dimensions.get('window').width

export default class Chatroom extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
          </View>
        </View>
        <View style={styles.conversationView}></View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    marginTop: 20,
    height: 40,
  },
  conversationView: {

  },
})