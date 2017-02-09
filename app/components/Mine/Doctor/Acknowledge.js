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
  Image,
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

class Acknowledge extends Component {
  constructor(props) {
    super(props)
  }

  renderAcknowledge(rowData) {
    return (
      <View style={{flex: 1, flexDirection: 'row', width: PAGE_WIDTH, backgroundColor: '#FFFFFF', marginTop: normalizeH(10)}}>
        <View style={styles.itemHeader}>
          <Image style={{width: normalizeW(44), height: normalizeH(44), borderRadius: normalizeW(20), overflow: 'hidden'}}
                 source={require('../../../assets/images/defualt_portrait_archives.png')}/>
        </View>
        <View style={styles.itemBody}>
          <Text style={styles.nickname}>{rowData.nickname}</Text>
          <Text style={styles.comment}>{rowData.comment}</Text>
          <Text style={styles.time}>{rowData.createAt}</Text>
        </View>
        <View style={styles.amount}>
          <Text style={{color: '#FFFFFF'}}>5元</Text>
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
          title="答谢墙"
        />
        <View style={styles.itemContainer}>
          <ListView
            dataSource = {this.props.dataSource}
            renderRow = {(rowData) => this.renderAcknowledge(rowData)}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  let dataSource =[]
  dataSource.push({nickname: '李四', comment: '感谢白衣天使！！！！！！！！', createAt: '2016-11-15'})
  dataSource.push({nickname: '老五', comment: '不能再爱你了', createAt: '2016-12-15'})
  return {
    dataSource: ds.cloneWithRows(dataSource)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge)

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
        marginTop: normalizeH(65),
      },
      android: {
        marginTop: normalizeH(45)
      }
    }),
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  itemHeader: {
    marginTop: normalizeH(12),
    marginLeft: normalizeW(12),
    marginRight: normalizeW(10),
    marginBottom: normalizeH(29)
  },
  itemBody: {
    flex: 1,
    marginTop: normalizeH(14),
  },
  amount: {
    marginTop: normalizeH(10),
    marginRight: normalizeW(12),
    marginBottom: normalizeH(25),
    backgroundColor: '#50E3C2',
    width: normalizeW(50),
    height: normalizeH(50),
    borderRadius: normalizeW(25),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  nickname: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(15),
    color: '#A4AAB3',
  },
  comment: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(15),
    color: '#4A4A4A',
  },
  time: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: em(12),
    color: '#A4AAB3',
  }
})