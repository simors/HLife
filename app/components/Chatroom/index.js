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
import {Actions} from 'react-native-router-flux'
import { GiftedChat } from 'react-native-gifted-chat'
import Header from '../common/Header'

const PAGE_WIDTH=Dimensions.get('window').width

export default class Chatroom extends Component {
  constructor(props) {
    super(props)
    this.state = {messages: []}
    this.onSend = this.onSend.bind(this)
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="聊天室"
        />
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: 1,
            name: '杨阳'
          }}
          loadEarlier={true}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    marginTop: 20,
    height: 40,
  },
  conversationView: {

  },
})