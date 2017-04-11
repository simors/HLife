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
  Dimensions,
  Platform,
  ScrollView,
  InteractionManager,
  ListView,
  RefreshControl,
  StatusBar,
} from 'react-native'
import Header from '../../common/Header'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {selectUserFollowees, activeUserId} from '../../../selector/authSelector'
import {selectUserFollowedShopList} from '../../../selector/shopSelector'
import {fetchUserFollowees} from '../../../action/authActions'
import {fetchUserFollowShops} from '../../../action/shopAction'
import CommonListView from '../../common/CommonListView'
import * as Toast from '../../common/Toast'
import THEME from '../../../constants/themes/theme1'
import UserFolloweesView from './UserFolloweesView'
import ShopFolloweesView from './ShopFolloweesView'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

class MyAttention extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabType: props.tabType ? 1 : 0
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      //this.toggleTab(this.props.tabType ? 1 : 0)
      if(0 == this.state.tabType) {
        this.refreshFollowees()
      } else if(1 == this.state.tabType) {
        this.refreshShopList()
      }
    })
  }

  componentWillReceiveProps(nextProps) {

  }

  refreshFollowees() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    let payload = {
      lastCreatedAt: this.props.userFolloweesLastCreatedAt,
      isRefresh: !!isRefresh,
      success: (isEmpty) => {
        if(!this.followeeListView) {
          return
        }
        if(isEmpty) {
          this.followeeListView.isLoadUp(false)
        }
      },
      error: (err)=>{
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.fetchUserFollowees(payload)
  }

  renderFollowees(value, key) {
    return (
      <View key={key} style={{borderBottomWidth: 1, borderColor: '#F5F5F5',}}>
        <UserFolloweesView userInfo={value} />
      </View>
    )
  }

  renderAttentionList() {
    return (
      <CommonListView
        contentContainerStyle={styles.itemLayout}
        dataSource={this.props.userFollowees}
        renderRow={(rowData, rowId) => this.renderFollowees(rowData, rowId)}
        loadNewData={()=> {
          this.refreshFollowees()
        }}
        loadMoreData={()=> {
          this.loadMoreData()
        }}
        ref={(listView) => this.followeeListView = listView}
      />
    )
  }

  refreshShopList() {
    this.loadMoreShopListData(true)
  }

  loadMoreShopListData(isRefresh) {
    let payload = {
      lastCreatedAt: this.props.lastCreatedAt,
      isRefresh: !!isRefresh,
      success: (isEmpty) => {
        if(!this.shopListView) {
          return
        }
        if(isEmpty) {
          this.shopListView.isLoadUp(false)
        }
      },
      error: (err)=>{
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.fetchUserFollowShops(payload)
  }

  renderShopItem(rowData) {
    return (
      <ShopFolloweesView shopInfo={rowData} />
    )
  }

  renderShopList() {
    return (
      <CommonListView
        contentContainerStyle={styles.shopContentContainerStyle}
        dataSource={this.props.userFollowedShopList}
        renderRow={(rowData, rowId) => this.renderShopItem(rowData, rowId)}
        loadNewData={()=> {
          this.refreshShopList()
        }}
        loadMoreData={()=> {
          this.loadMoreShopListData()
        }}
        ref={(listView) => this.shopListView = listView}
      />
    )
  }

  toggleTab(type) {
    this.setState({tabType: type}, ()=>{
      if(0 == type) {
        this.refreshFollowees()
      } else if(1 == type) {
        this.refreshShopList()
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header headerContainerStyle={styles.header}
                leftType='icon'
                leftStyle={{color: '#FFFFFF'}}
                leftPress={() => {Actions.pop()}}
                title="我的关注"
                titleStyle={styles.title}>
        </Header>
        <View style={styles.body}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
              onPress={()=> {
                this.toggleTab(0)
              }}>
              <View style={[{width: normalizeW(100), height: normalizeH(44), justifyContent: 'flex-end', alignItems: 'center'},
                this.state.tabType == 0 ?
                {
                  borderBottomWidth: 3,
                  borderColor: THEME.base.mainColor
                } : {}]}>
                <Text style={[{fontSize: em(17), paddingBottom: normalizeH(8)},
                  this.state.tabType == 0 ?
                  {
                    color: THEME.base.mainColor,
                    fontWeight: 'bold',
                  } : {color: '#4A4A4A'}]}
                >邻友</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
              onPress={()=> {
              this.toggleTab(1)
              }}>
              <View style={[{width: normalizeW(100), height: normalizeH(44), justifyContent: 'flex-end', alignItems: 'center'},
                this.state.tabType == 1 ?
                {
                  borderBottomWidth: 3,
                  borderColor: THEME.base.mainColor
                } : {}]}>
                <Text style={[{fontSize: em(17), paddingBottom: normalizeH(8)},
                  this.state.tabType == 1 ?
                  {
                    color: THEME.base.mainColor,
                    fontWeight: 'bold',
                  } : {color: '#4A4A4A'}]}
                >店铺</Text>
              </View>
            </TouchableOpacity>
          </View>
          {this.state.tabType == 0?this.renderAttentionList():this.renderShopList()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let userFollowees = selectUserFollowees(state)
  let userFolloweesLastCreatedAt = ''
  if(userFollowees && userFollowees.length) {
    userFolloweesLastCreatedAt = userFollowees[userFollowees.length-1].createdAt
  }
  // console.log('userFollowees===', userFollowees)
  const userFollowedShopList = selectUserFollowedShopList(state, activeUserId(state))
  let lastCreatedAt = ''
  if(userFollowedShopList && userFollowedShopList.length) {
    lastCreatedAt = userFollowedShopList[userFollowedShopList.length-1].createdAt
  }
  return {
    userFollowees: ds.cloneWithRows(userFollowees),
    userFolloweesLastCreatedAt: userFolloweesLastCreatedAt,
    userFollowedShopList: ds.cloneWithRows(userFollowedShopList),
    lastCreatedAt: lastCreatedAt
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserFollowees,
  fetchUserFollowShops
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyAttention)


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: THEME.base.mainColor,
  },
  title: {
    fontSize: em(17),
    color: '#FFF'
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
  shopContentContainerStyle: {
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  tabBar: {
    height: normalizeH(44),
    width: PAGE_WIDTH,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
  },
  //用户、时间、地点信息
  introWrapStyle: {
    marginTop: normalizeH(12),
    marginBottom: normalizeH(12),
    backgroundColor: '#ffffff',
  },

  positionStyle: {
    marginRight: normalizeW(4),
    width: normalizeW(8),
    height: normalizeH(12)
  },
})