/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'

import Header from '../common/Header'
import CommonListView from '../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import {fetchShopCommentList} from '../../action/shopAction'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees} from '../../action/authActions'
import {selectUserIsFollowShop, selectShopComments} from '../../selector/shopSelector'
import ShopComment from './ShopComment'

import * as ShopDetailTestData from './ShopDetailTestData'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopCommentList extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentWillReceiveProps(nextProps) {

  }

  renderRow(rowData, rowId) {

    return (
      <ShopComment
        userId={rowData.user.id}
        userNickname={rowData.user.nickname}
        avatar={rowData.user.avatar}
        score={rowData.score}
        content={rowData.content}
        createdDate={rowData.createdDate}
        blueprints={rowData.blueprints}
      />
    )
  }

  refreshData() {

  }

  loadMoreData(isRefresh) {

  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="全部评价"
          rightType="none"
        />
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={{backgroundColor: 'rgba(0,0,0,0.05)'}}
            dataSource={this.props.ds}
            renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
            loadNewData={()=>{this.refreshData()}}
            loadMoreData={()=>{this.loadMoreData()}}
            ref={(listView) => this.listView = listView}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = undefined
  if(ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }

  const shopCommentList = ShopDetailTestData.shopComments

  return {
    ds: ds.cloneWithRows(shopCommentList),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopCommentList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
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
  },

})