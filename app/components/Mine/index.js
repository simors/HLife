/**
<<<<<<< HEAD
 * Created by wanpeng on 2016/12/6.
=======
 * Created by zachary on 2016/12/9.
>>>>>>> 2068daffc8b00d46d574ae33b7081e94f254619a
 */
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
    

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{}}>
          Welcome HLife Mine Page
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

