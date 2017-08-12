/**
 * Created by yangyang on 2017/8/11.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Platform,
  InteractionManager,
  StatusBar,
  NativeModules
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../constants/themes/theme1'
import * as authSelector from '../../selector/authSelector'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class Mine extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      // if(this.props.isUserLogined) {
      //   this.props.fetchUserFollowees()
      // }
    })
  }

  renderHeaderView() {
    return (
      <View style={styles.header}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: normalizeH(20)}}>
          <TouchableOpacity onPress={()=> {}} style={{flexDirection: 'row'}}>
            <Text>ff</Text>
            <Text>设置</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderBodyView() {
    return (
      <View style={{marginTop: normalizeH(15)}}>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, marginBottom: normalizeH(45)}}>
          <ScrollView style={{flex: 1}}>
            {this.renderHeaderView()}
            {this.renderBodyView()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Mine)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
  },
  header: {
    width: PAGE_WIDTH,
    height: normalizeH(129),
    backgroundColor: THEME.base.mainColor,
  },
})