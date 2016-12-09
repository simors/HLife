/**
 * Created by wanpeng on 2016/12/6.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import SnsLogin from '../common/SnsLogin'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import {
  Button
} from 'react-native-elements'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class Mine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: "",
      password: ""
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>

        </View>
        <View style={styles.body}>

        </View>

      </View>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    'userName': 'Z',
    'password': '1',
    'isLogin': true
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Mine)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#50E3C2',
    opacity: 0.19,
    height: normalizeH(125),
    marginTop: normalizeH(20),
  },
  body: {
    borderWidth: 1,
    borderColor: 'red',

  }

})
