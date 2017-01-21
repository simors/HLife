import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar,
  Image,
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
      Actions.HOME({type:'replace'})
    }, 1000)
  }

  render() {
    return (
        <Image source={require('../../assets/images/start_page.png')} style={styles.imageStyle}>

        </Image>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  imageStyle: {
    flex: 1,
    width: null,
    height: null,
  }
})