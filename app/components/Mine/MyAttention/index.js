/**
 * Created by lilu on 2017/1/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Platform,
  Modal,
  ScrollView,
  TouchableHighlight,
  WebView,
  InteractionManager,
  ListView,
  RefreshControl,
} from 'react-native'
import Header from '../../common/Header'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {selectUserFollowees} from '../../../selector/authSelector'
import {fetchUserFollowees} from '../../../action/authActions'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height


class MyAttention extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSrc: ds.cloneWithRows(props.userFollowees),
    }
  }

  refreshTopic() {
  }

  loadMoreData() {
  }

  render() {
    return (
      <View style={styles.container}>
        <Header headerContainerStyle={styles.header}
                leftType='icon'
                leftPress={() => Actions.pop()}
                title="我的关注"
                titleStyle={styles.title}>
        </Header>
        <View style={styles.body}>
          <View style={styles.tabBar}>
            <Text style={{fontSize: em(15), color: '#50E3C2', marginLeft: normalizeW(86)}}>吾友</Text>
            <Text style={{fontSize: em(15), color: '#4A4A4A', marginLeft: normalizeW(143)}}>店铺</Text>
          </View>
          <CommonListView
            contentContainerStyle={styles.itemLayout}
            dataSource={this.state.dataSrc}
            renderRow={(rowData, rowId) => this.renderTopicItem(rowData, rowId)}
            loadNewData={()=> {
              this.refreshTopic()
            }}
            loadMoreData={()=> {
              this.loadMoreData()
            }}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let userFollowees = selectUserFollowees(state)
  return {
    userFollowees: userFollowees,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserFollowees,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyAttention)


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#F9F9F9'
  },
  title: {
    fontSize: em(17),
    color: '#030303'
  },
  itemLayout: {
    width: PAGE_WIDTH,
    backgroundColor: '#ffffff',
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
    flex: 1,
    width: PAGE_WIDTH,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  tabBar: {
    height: normalizeH(44),
    width: PAGE_WIDTH,
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent:'center',
    backgroundColor: '#FFFFFF',
    marginBottom: normalizeH(15),
  },

})