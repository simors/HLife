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
  Text,
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
          <View style={{height: normalizeH(85), backgroundColor: '#FFFFFF', flexDirection: 'row', }}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: normalizeW(20)}}>
              <Text style={styles.itemText}>本月收益 （元）</Text>
              <Text style={styles.numText}>+50.0</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: normalizeW(20)}}>
              <Text style={styles.itemText}>累计收益 （元）</Text>
              <Text style={styles.numText}>3423.0</Text>
            </View>
          </View>
          <ScrollView style={{height: PAGE_HEIGHT, marginTop: normalizeH(13), backgroundColor: '#FFFFFF'}}>
            <View style={{height: normalizeH(43), paddingLeft: normalizeW(20), paddingTop: normalizeH(14), borderBottomWidth: 1, borderBottomColor: '#EFEFF4'}}>
              <Text style={styles.itemText}>收益记录</Text>
            </View>
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
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
  itemText: {
    fontFamily:'PingFangSC-Regular',
    fontSize: em(15),
    color: '#9B9B9B'
  },
  numText: {
    fontFamily:'PingFangSC-Semibold',
    fontSize: em(17),
    color: '#F6A623'
  }
})