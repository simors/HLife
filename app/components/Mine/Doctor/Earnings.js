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

  renderEarning(rowData) {
    return (
      <View style={styles.itemView}>
        <View style={{flex: 1, marginTop: normalizeH(10)}}>
          <Text style={styles.itemText}>{rowData.createAt}</Text>
          <Text style={styles.itemText}>简单提问</Text>
        </View>
        <View style={{marginRight: normalizeW(12), marginTop: normalizeH(10)}}>
          <Text style={styles.numText}>+{rowData.amount} 元</Text>
        </View>
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
            <ListView
            dataSource={this.props.dataSource}
            renderRow={(rowData) => this.renderEarning(rowData)}
            />
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  let dataSource =[]
  dataSource.push({amount: 50, createAt: '2017-01-12'})
  dataSource.push({amount: 100, createAt: '2017-02-12'})

  return {
    dataSource: ds.cloneWithRows(dataSource)
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
    marginTop: normalizeH(65),
  },
  itemView: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#EFEFF4',
    backgroundColor: '#FFFFFF',
    height: normalizeH(63),
    marginLeft: normalizeW(20),
    marginRight: normalizeW(12),
    marginBottom: normalizeH(14)
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