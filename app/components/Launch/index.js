import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions
} from 'react-native'
import {Actions} from 'react-native-router-flux'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

export default class Launch extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    setTimeout(() => {
      Actions.HOME()
    }, 3000)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{flex:1, borderWidth: 5}}>
          Welcome
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    // width: PAGE_WIDTH,
    // height: PAGE_HEIGHT
  },
})