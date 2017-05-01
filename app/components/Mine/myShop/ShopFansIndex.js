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
  StatusBar,
} from 'react-native'
import Header from '../../common/Header'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../../constants/themes/theme1'
import CommonListView from '../../common/CommonListView'
import {fetchShopFollowers} from '../../../action/shopAction'
import {selectShopFollowers} from '../../../selector/shopSelector'
import ShopFollowersView from './ShopFollowersView'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopFansIndex extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.refreshFollowers()
    })
  }

  renderFollowers(value, key) {
    return (
      <View key={key} style={{borderBottomWidth: 1, borderColor: '#F5F5F5'}}>
        <ShopFollowersView userInfo={value} shopId={this.props.shopId}/>
      </View>
    )
  }

  refreshFollowers() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    let payload = {
      lastCreatedAt: this.props.userFollowersLastCreatedAt,
      isRefresh: !!isRefresh,
      id: this.props.shopId,
      success: (isEmpty) => {
        if(!this.followerListView) {
          return
        }
        if(isEmpty) {
          this.followerListView.isLoadUp(false)
        }
      },
      error: (err)=>{
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.fetchShopFollowers(payload)
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<StatusBar barStyle="light-content" />*/}
        <Header headerContainerStyle={styles.header}
                leftType='icon'
                leftStyle={{color: '#FFFFFF'}}
                leftPress={() => Actions.pop()}
                title="店铺粉丝"
                titleStyle={styles.title}>
        </Header>
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={styles.itemLayout}
            dataSource={this.props.shopFollowers}
            renderRow={(rowData, rowId) => this.renderFollowers(rowData, rowId)}
            loadNewData={()=> {
              this.refreshFollowers()
            }}
            loadMoreData={()=> {
              this.loadMoreData()
            }}
            ref={(listView) => this.followerListView = listView}
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
  let shopId = ownProps.shopId
  let shopFollowers = selectShopFollowers(state, shopId)
  // console.log('shopFollowers: ', shopFollowers)
  let lastCreatedAt = ''
  if(shopFollowers && shopFollowers.length) {
    lastCreatedAt = shopFollowers[shopFollowers.length-1].createdAt
  }
  
  return {
    shopFollowers: ds.cloneWithRows(shopFollowers),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopFollowers,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopFansIndex)


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
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    width: PAGE_WIDTH,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  itemLayout: {
    width: PAGE_WIDTH,
    backgroundColor: '#ffffff',
  },
})