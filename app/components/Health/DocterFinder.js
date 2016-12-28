/**
 * Created by yangyang on 2016/12/27.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Header from '../common/Header'
import {getDocterList} from '../../action/authActions'

class DocterFinder extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getDocterList({})
    })
  }

  render() {
    return (
      <View>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="找名医"
        />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDocterList,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DocterFinder)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
})