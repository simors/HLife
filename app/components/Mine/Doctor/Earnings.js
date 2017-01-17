/**
 * Created by wanpeng on 2017/1/17.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  InteractionManager,
  ScrollView,
  ListView,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Earnings extends Component {
  constructor(props) {
    super(props)
  }

  renderAcknowledge(rowData) {
    return (
      <View style={{backgroundColor: '#FFFFFF', height: normalizeH(85), width: PAGE_WIDTH, marginBottom: normalizeH(14)}}>

      </View>
    )

  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="icon"
          leftStyle={styles.left}
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="收益记录"
        />
        <View style={styles.itemContainer}>
          <ScrollView style={{height: PAGE_HEIGHT}}>
            {/*<ListView*/}
            {/*dataSource={this.props.dataSource}*/}
            {/*renderRow={(rowData) => this.renderAcknowledge(rowData)}*/}
            {/*/>*/}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds
  return {
    dataSource: ds,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Earnings)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#50E3C2',
  },
  left: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: -0.41,
  },
  itemContainer: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
  },
})