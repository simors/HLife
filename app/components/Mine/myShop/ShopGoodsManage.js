/**
 * Created by wanpeng on 2017/6/8.
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
  InteractionManager,
  TextInput,
  Animated,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import CommonListView from '../../common/CommonListView'
import ScrollableTabView, {ScrollableTabBar} from '../../common/ScrollableTableView'





const PAGE_WIDTH = Dimensions.get('window').width

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

class ShopGoodsManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabType: props.tabType ? 1 : 0,
    }
    this.tabs = ['正在热卖', '已下架']
  }

  isExceededShopGoodsMaxNum(){
  }

  onChangeTab(payload) {
    this.setState({
      tabType: payload.i
    }, ()=>{
      this.refresh()
    })
  }

  refresh() {
    if(0 == this.state.tabType) {
      this.refreshHotGoodsList()
    } else if(1 == this.state.tabType) {
      this.refreshSaleoffGoodsList()
    }
  }

  renderScrollTabsContent() {
    return this.tabs.map((item, index)=>{
      return (
        <View key={index} tabLabel={item}
              style={[{flex:1}]}>
          {index == 0 ? this.renderHotList() : this.renderSaleoffList()}
        </View>
      )
    })
  }

  renderHotList() {
    return(
      <CommonListView
        dataSource={this.props.hotGoodsList}
        renderRow={(rowData, rowId) => this.renderHotGoodItem(rowData, rowId)}
        loadNewData={()=> {
          this.refreshHotGoodsList()
        }}
        loadMoreData={()=> {
          this.loadMoreHotGoodsListData()
        }}
        ref={(listView) => this.hotGoodListView = listView}
      />
    )
  }

  renderHotGoodItem(rowData) {
    return(
      <View>

      </View>
    )
  }

  refreshHotGoodsList() {
    this.loadMoreHotGoodsListData(true)
  }

  loadMoreHotGoodsListData(isRefresh) {

  }

  renderSaleoffList() {
    return(
      <CommonListView
        dataSource={this.props.saleoffGoodsList}
        renderRow={(rowData, rowId) => this.renderSaleoffGoodItem(rowData, rowId)}
        loadNewData={()=> {
          this.refreshSaleoffGoodsList()
        }}
        loadMoreData={()=> {
          this.loadMoreSaleoffGoodsListData()
        }}
        ref={(listView) => this.saleoffGoodListView = listView}
      />
    )
  }

  renderSaleoffGoodItem(rowData) {
    return(
      <View>

      </View>
    )
  }

  refreshSaleoffGoodsList() {
    this.loadMoreSaleoffGoodsListData(true)
  }

  loadMoreSaleoffGoodsListData(isRefresh) {

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

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="商品管理"
          rightType="none"
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
          <View style={{
            position:'absolute',
            left:0,
            right:0,
            bottom:0,
            backgroundColor:'#fafafa',
          }}>
            <TouchableOpacity
              onPress={()=>{
                if(this.isExceededShopGoodsMaxNum()) {
                  Toast.show('您的店铺商品数已达最大数量')
                  return
                }
                Actions.PUBLISH_SHOP_GOOD()
              }}
            >
              <View style={{
                padding:15,
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center',
                borderTopWidth:normalizeBorder(),
                borderTopColor: THEME.colors.lighterA,
              }}>
                <Image style={{marginRight:10}} source={require('../../../assets/images/publish_goods.png')}/>
                <Text style={{color:'#FF7819',fontSize:17}}>新品上架</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  const hotGoodsList = []
  const saleoffGoodsList = []

  return {
    hotGoodsList: ds.cloneWithRows(hotGoodsList),
    saleoffGoodsList: ds.cloneWithRows(saleoffGoodsList)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopGoodsManage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  foot: {
    position: 'absolute',
    bottom: 0,
    width: PAGE_WIDTH,
    height: normalizeH(49),
    borderColor: 'black',
    borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
  },
  publish: {
    fontSize: 17,
    color: THEME.base.mainColor,
    marginLeft: 10,
  }
})
