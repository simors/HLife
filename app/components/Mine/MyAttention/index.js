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
import * as AVUtils from '../../../util/AVUtils'
import ScrollableTabView, {ScrollableTabBar} from '../../common/ScrollableTableView'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

class MyAttention extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabType: props.tabType ? 1 : 0,
      showNoUserFolloweesView: false,
      showNoShopFolloweesView: false,
    }

    this.tabs = ['邻友', '店铺']
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      //this.toggleTab(this.props.tabType ? 1 : 0)
      this.refresh()
    })
  }

  componentWillReceiveProps(nextProps) {

  }

  refresh() {
    if(0 == this.state.tabType) {
      this.refreshFollowees()
    } else if(1 == this.state.tabType) {
      this.refreshShopList()
    }
  }

  refreshFollowees() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    // console.log('loadMoreData.isRefresh=', isRefresh)

    const userFolloweesLastCreatedAt = this.props.userFolloweesLastCreatedAt

    if(!isRefresh && !userFolloweesLastCreatedAt) {
      return
    }

    if(this.isQuering) {
      return
    }
    this.isQuering = true
    let payload = {
      lastCreatedAt: userFolloweesLastCreatedAt,
      isRefresh: !!isRefresh,
      success: (isEmpty) => {
        // console.log('loadMoreData.isEmpty===', isEmpty)
        // console.log('loadMoreData.this.followeeListView===', this.followeeListView)
        this.isQuering = false
        if(!this.followeeListView) {
          return
        }

        if(isEmpty) {
          this.followeeListView.isLoadUp(false)

          if(isRefresh) {
            this.setState({
              showNoUserFolloweesView: true
            })
          }
        }
      },
      error: (err)=>{
        this.isQuering = false
        console.log('loadMoreData.err===', err)
        Toast.show(err.message, {duration: 1000})
      }
    }
    // console.log('loadMoreData.fetchUserFollowees.isRefresh=', isRefresh)
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
    let userFolloweesDs = ds.cloneWithRows(this.props.userFollowees)
    return (
      <CommonListView
        dataSource={userFolloweesDs}
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

  renderNoUserFolloweesView() {
    if(this.state.showNoUserFolloweesView && this.state.tabType == 0) {
      return (
        <View style={{position:'absolute',left:0,right:0,top:44,bottom:0,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
          <Image style={{marginBottom:20}} source={require('../../../assets/images/sad.png')}/>
          <Text style={{color:'#b2b2b2',fontSize:17,marginBottom:15}}>一个关注的人都没有</Text>
          <Text style={{color:'#ff7819',fontSize:17,marginBottom:60}}>远亲不如近邻，找找附近的邻友吧</Text>
          <TouchableOpacity style={{backgroundColor:'#ff7819',borderRadius:5,padding:12,paddingLeft:30,paddingRight:30}} 
            onPress={()=>{
              AVUtils.switchTab('FIND')
            }}>
              <Text style={{color:'white',fontSize:17}}>进入邻家话题</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return null
  }

  refreshShopList() {
    this.loadMoreShopListData(true)
  }

  loadMoreShopListData(isRefresh) {

    const lastCreatedAt = this.props.lastCreatedAt

    if(!isRefresh && !lastCreatedAt) {
      return
    }

    if(this.isQuering) {
      return
    }
    this.isQuering = true

    let payload = {
      lastCreatedAt: lastCreatedAt,
      isRefresh: !!isRefresh,
      success: (isEmpty) => {
        this.isQuering = false
        if(!this.shopListView) {
          return
        }
        if(isEmpty) {
          this.shopListView.isLoadUp(false)

          if(isRefresh) {
            this.setState({
              showNoShopFolloweesView: true
            })
          }
        }
      },
      error: (err)=>{
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }
    // console.log('loadMoreShopListData===payload====', payload)
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

  renderNoShopFolloweesView() {
    if(this.state.showNoShopFolloweesView && this.state.tabType == 1) {
      return (
        <View style={{position:'absolute',left:0,right:0,top:44,bottom:0,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
          <Image style={{marginBottom:20}} source={require('../../../assets/images/sad.png')}/>
          <Text style={{color:'#b2b2b2',fontSize:17,marginBottom:15}}>一个关注的店铺都没有</Text>
          <Text style={{color:'#ff7819',fontSize:17,marginBottom:60}}>为了生活更方便，去看看周边的店铺吧</Text>
          <TouchableOpacity style={{backgroundColor:'#ff7819',borderRadius:5,padding:12,paddingLeft:30,paddingRight:30}} 
            onPress={()=>{
              AVUtils.switchTab('LOCAL')
            }}>
              <Text style={{color:'white',fontSize:17}}>进入邻家店铺</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return null
  }

  renderTabBar() {
    return (
      <ScrollableTabBar
        activeTextColor={THEME.base.mainColor}
        inactiveTextColor={'#686868'}
        style={{height:44}}
        underlineStyle={{height: 2, backgroundColor:THEME.base.mainColor}}
        textStyle={{fontSize: em(16), paddingBottom: 11}}
        tabStyle={{paddingBottom: 0, paddingLeft: 12, paddingRight: 12}}
        backgroundColor={'white'}
      />
    )
  }

  // toggleTab(type) {
  //   this.setState({tabType: type}, ()=>{
  //     if(0 == type) {
  //       this.refreshFollowees()
  //     } else if(1 == type) {
  //       this.refreshShopList()
  //     }
  //   })
  // }

  onChangeTab(payload) {
    this.setState({
      tabType: payload.i
    }, ()=>{
      this.refresh()
    })
  }

  renderScrollTabsContent() {
    return this.tabs.map((item, index)=>{
      return (
        <View key={index} tabLabel={item}
              style={[{flex:1}]}>
          {index == 0 ? this.renderAttentionList() : this.renderShopList()}
        </View>
      )
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header 
          headerContainerStyle={styles.header}
          leftType='icon'
          leftStyle={{color: '#FFFFFF'}}
          leftPress={() => {Actions.pop()}}
          title="我的关注"
          titleStyle={styles.title}
        />
        <View style={styles.body}>
          <ScrollableTabView 
            style={[{flex:1}]}
            page={this.state.tabType}
            initialPage={this.state.tabType}
            scrollWithoutAnimation={true}
            renderTabBar={()=> this.renderTabBar()}
            onChangeTab={(payload) => this.onChangeTab(payload)}>
            {this.renderScrollTabsContent()}
          </ScrollableTabView>
          {this.renderNoUserFolloweesView()}
          {this.renderNoShopFolloweesView()}
        </View>
      </View>
    )
  }

  // render() {
  //   return (
  //     <View style={styles.container}>
  //       <StatusBar barStyle="light-content" />
  //       <Header headerContainerStyle={styles.header}
  //               leftType='icon'
  //               leftStyle={{color: '#FFFFFF'}}
  //               leftPress={() => {Actions.pop()}}
  //               title="我的关注"
  //               titleStyle={styles.title}>
  //       </Header>
  //       <View style={styles.body}>
  //         <View style={styles.tabBar}>
  //           <TouchableOpacity
  //             style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
  //             onPress={()=> {
  //               this.toggleTab(0)
  //             }}>
  //             <View style={[{width: normalizeW(100), height: normalizeH(44), justifyContent: 'flex-end', alignItems: 'center'},
  //               this.state.tabType == 0 ?
  //               {
  //                 borderBottomWidth: 3,
  //                 borderColor: THEME.base.mainColor
  //               } : {}]}>
  //               <Text style={[{fontSize: em(17), paddingBottom: normalizeH(8)},
  //                 this.state.tabType == 0 ?
  //                 {
  //                   color: THEME.base.mainColor,
  //                   fontWeight: 'bold',
  //                 } : {color: '#4A4A4A'}]}
  //               >邻友</Text>
  //             </View>
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
  //             onPress={()=> {
  //             this.toggleTab(1)
  //             }}>
  //             <View style={[{width: normalizeW(100), height: normalizeH(44), justifyContent: 'flex-end', alignItems: 'center'},
  //               this.state.tabType == 1 ?
  //               {
  //                 borderBottomWidth: 3,
  //                 borderColor: THEME.base.mainColor
  //               } : {}]}>
  //               <Text style={[{fontSize: em(17), paddingBottom: normalizeH(8)},
  //                 this.state.tabType == 1 ?
  //                 {
  //                   color: THEME.base.mainColor,
  //                   fontWeight: 'bold',
  //                 } : {color: '#4A4A4A'}]}
  //               >店铺</Text>
  //             </View>
  //           </TouchableOpacity>
  //         </View>
  //         {this.state.tabType == 0?this.renderAttentionList():this.renderShopList()}
  //       </View>
  //     </View>
  //   )
  // }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('MyAttention.mapStateToProps.state===', state)
  let userFollowees = selectUserFollowees(state)
  // userFollowees = []
  let userFolloweesLastCreatedAt = ''
  if(userFollowees && userFollowees.length) {
    userFolloweesLastCreatedAt = userFollowees[userFollowees.length-1].createdAt
  }
  // console.log('userFollowees===', ds.cloneWithRows(userFollowees))
  const userFollowedShopList = selectUserFollowedShopList(state, activeUserId(state))
  let lastCreatedAt = ''
  if(userFollowedShopList && userFollowedShopList.length) {
    lastCreatedAt = userFollowedShopList[userFollowedShopList.length-1].createdAt
  }
  return {
    userFollowees: userFollowees,
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