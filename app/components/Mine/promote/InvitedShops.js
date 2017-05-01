/**
 * Created by yangyang on 2017/4/11.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
  StatusBar,
  ListView,
  InteractionManager,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import THEME from '../../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import Header from '../../common/Header'
import CommonListView from '../../common/CommonListView'
import {getMyInvitedShops} from '../../../action/promoterAction'
import {getInvitedShop, activePromoter} from '../../../selector/promoterSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class InvitedShops extends Component {
  constructor(props) {
    super(props)
    this.lastCreatedAt = undefined
  }

  componentWillMount() {
    this.refreshData()
  }

  refreshData() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    if(this.isQuering) {
      return
    }
    this.isQuering = true

    InteractionManager.runAfterInteractions(()=>{
      this.props.getMyInvitedShops({
        limit: 10,
        more: !isRefresh,
        lastCreatedAt: !!isRefresh ? undefined : this.lastCreatedAt,
        success: (isEmpty) => {
          this.isQuering = false
          if(!this.listView) {
            return
          }
          this.listView.isLoadUp(!isEmpty)
        },
        error: (message) => {
          this.isQuering = false
        }
      })
    })
  }

  renderRow(shop, index) {
    this.lastCreatedAt = shop.createdAt
    return (
      <View>
        <TouchableOpacity style={styles.shopItemView} onPress={() => {Actions.SHOP_DETAIL({id: shop.id})}}>
          <View style={styles.shopCoverView}>
            <Image style={{width: normalizeW(100), height: normalizeH(75)}}
                  source={shop.coverUrl ? {uri: shop.coverUrl} : require('../../../assets/images/shop_defualt.png')}/>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.shopNameText}>{shop.shopName}</Text>
            <View style={{flexDirection: 'row', paddingTop: normalizeH(10)}}>
              {
                shop.containedTag[0] ? <Text style={[styles.tipText, {paddingRight: normalizeW(8)}]}>{shop.containedTag[0].name}</Text> : <View/>
              }
              <Text style={[styles.tipText, {paddingRight: normalizeW(8)}]}>{shop.geoDistrict}</Text>
              <Text style={[styles.tipText, {paddingRight: normalizeW(8)}]}>{shop.distance}{shop.distanceUnit}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: normalizeH(15), alignItems: 'center'}}>
              <Text style={{fontSize: em(12), color: THEME.base.mainColor}}>入驻费（元）</Text>
              <Text style={{fontSize: em(18), color: THEME.base.mainColor, fontWeight: 'bold', paddingRight: normalizeW(15)}}>¥ {shop.tenant}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderExplainBtn() {
    return (
      <TouchableOpacity style={styles.explainBtnStyle}
                        onPress={() => {}}>
        <Image style={{width: normalizeW(18), height: normalizeH(18)}} resizeMode="contain"
               source={require('../../../assets/images/explain_revernue.png')}/>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<StatusBar barStyle="dark-content" />*/}
        <Header leftType="icon"
                leftIconName="ios-arrow-back"
                leftPress={()=> {
                  Actions.pop()
                }}
                title="邀请店铺"
                rightComponent={() => {return this.renderExplainBtn()}}
        />
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={{backgroundColor: '#FFF'}}
            dataSource={this.props.dataSource}
            renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
            loadNewData={()=> {
              this.refreshData()
            }}
            loadMoreData={()=> {
              this.loadMoreData(false)
            }}
            ref={(listView) => this.listView = listView}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = undefined
  if (ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }

  let promoterId = activePromoter(state)
  let comps = getInvitedShop(state, promoterId)

  return {
    dataSource: ds.cloneWithRows(comps),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getMyInvitedShops,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InvitedShops)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    width: PAGE_WIDTH,
    backgroundColor: '#FFF',
  },
  explainBtnStyle: {
    width: normalizeW(40),
    height: normalizeH(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(5)
  },
  shopItemView: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: normalizeH(20),
    paddingBottom: normalizeH(15),
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  shopCoverView: {
    paddingLeft: normalizeW(20),
    paddingRight: normalizeW(15),
  },
  shopNameText: {
    fontSize: em(17),
    color: '#5a5a5a',
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: em(12),
    color: '#D8D8D8',
  },
})