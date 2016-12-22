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
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import { GiftedChat } from './GifedChat/GiftedChat'
import Header from '../common/Header'
import CustomInputToolbar from './CustomInputToolbar'
import CustomMessage from './CustomMessage'

const PAGE_WIDTH=Dimensions.get('window').width

class Chatroom extends Component {
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

  renderCustomInputToolbar(toobarProps) {
    return (
      <CustomInputToolbar {...toobarProps}/>
    )
  }

  renderCustomMessage(messageProps) {
    return (
      <CustomMessage {...messageProps}/>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title={this.props.title}
        />
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: 1,
            name: '杨阳',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          }}
          renderInputToolbar={(toobarProps) => this.renderCustomInputToolbar(toobarProps)}
          renderMessage={(messageProps) => this.renderCustomMessage(messageProps)}
        />
      </View>
    )
  }
}

Chatroom.defaultProps = {
  title: '聊天室'
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Chatroom)

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