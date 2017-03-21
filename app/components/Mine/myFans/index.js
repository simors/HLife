/**
 * Created by yangyang on 2017/3/20.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  ScrollView,
  InteractionManager,
  ListView,
  RefreshControl,
} from 'react-native'
import Header from '../../common/Header'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../../constants/themes/theme1'
import CommonListView from '../../common/CommonListView'
import {fetchUserFollowers} from '../../../action/authActions'
import {activeUserId, selectUserFollowers} from '../../../selector/authSelector'
import UserFollowersView from './UserFollowersView'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class MyFans extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchUserFollowers()
    })
  }

  renderFollowers(value, key) {
    return (
      <View key={key} style={{borderBottomWidth: 1, borderColor: '#F5F5F5'}}>
        <UserFollowersView userInfo={value} />
      </View>
    )
  }

  refreshFollowers() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchUserFollowers()
    })
  }

  loadMoreData() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Header headerContainerStyle={styles.header}
                leftType='icon'
                leftPress={() => Actions.pop()}
                title="我的粉丝"
                titleStyle={styles.title}>
        </Header>
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={styles.itemLayout}
            dataSource={this.props.userFollowers}
            renderRow={(rowData, rowId) => this.renderFollowers(rowData, rowId)}
            loadNewData={()=> {
              this.refreshFollowers()
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
  let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 != r2,
  })
  let currentUserId = activeUserId(state)
  let userFollowers = selectUserFollowers(state, currentUserId)
  console.log('userFollowers: ', userFollowers)
  return {
    userFollowers: ds.cloneWithRows(userFollowers),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserFollowers,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyFans)


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
  itemLayout: {
    width: PAGE_WIDTH,
    backgroundColor: '#ffffff',
  },
})