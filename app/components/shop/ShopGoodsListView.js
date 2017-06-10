/**
 * Created by lilu on 2017/6/6.
 */
import React, {Component} from 'react'
import shallowequal from 'shallowequal'

import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Platform,
  Modal,
  ScrollView,
  TouchableHighlight,
  Animated,
  InteractionManager,
  ListView,


} from 'react-native'
import {CachedImage} from "react-native-img-cache"
import * as Toast from '../common/Toast'
import Header from '../common/Header'
import * as AVUtils from '../../util/AVUtils'
import AV from 'leancloud-storage'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {getColumn} from '../../selector/configSelector'
import {CommonModal} from '../common/CommonModal'
import {Actions} from 'react-native-router-flux'
import CommonListView from '../common/CommonListView'
import {
  getShopGoodsList,
} from '../../action/shopAction'
import {
  selectGoodsList
} from '../../selector/shopSelector'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopGoodsListView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imgSize: normalizeW(45),
      columnCnt: this.props.size,
      fade: new Animated.Value(0),
      loadGoods: false,
      // ds: ds.cloneWithRows(this.props.shopGoodsList),
    }


  }

  componentWillMount() {

    InteractionManager.runAfterInteractions(() => {
      this.props.getShopGoodsList({
        shopId: this.props.id,
        status: 1,
        limit: 6,
        more:false
        // lastUpdateTime: payload.lastUpdateTime,
      })
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props, nextProps)) {
      return true;
    }
    if (!shallowequal(this.state, nextState)) {
      return true;
    }
    return false;
  }

  renderColumn(value, key) {
    //console.log('value====>',value)
    return (
      <TouchableOpacity onPress={()=>this.showGoodDetail(value)}>
        <View style={styles.channelWrap}>
          <CachedImage mutable style={styles.defaultImageStyles} resizeMode="contain" source={{uri: value.coverPhoto}}/>
          {/*<Image style={styles.defaultImageStyles} source={{uri: value.coverPhoto}}/>*/}
          <Text style={ styles.channelText}>{value.goodsName}</Text>
          <Text style={ styles.channelPrice}>{'¥' + value.price}</Text>

        </View>
      </TouchableOpacity>
    )
  }

  showGoodDetail(value) {
    // this.props.showGoodDetail(value)
    Actions.SHOP_GOODS_DETAIL({value:value})
  }

  handleOnScroll(e) {
    let offset = e.nativeEvent.contentOffset.y
    let comHeight = normalizeH(300)
    if (offset >= 0 && offset < 10) {
      Animated.timing(this.state.fade, {
        toValue: 0,
        duration: 100,
      }).start()
    } else if (offset > 10 && offset < comHeight) {
      Animated.timing(this.state.fade, {
        toValue: (offset - 10) / comHeight,
        duration: 100,
      }).start()
    } else if (offset >= comHeight) {
      Animated.timing(this.state.fade, {
        toValue: 1,
        duration: 100,
      }).start()
    }
  }

  renderMainHeader() {
    return (

      <Header
        leftType="icon"
        leftIconName="ios-arrow-back"
        leftPress={() => {
          AVUtils.pop({
            backSceneName: this.props.backSceneName,
            backSceneParams: this.props.backSceneParams
          })
        }}
        title="全部商品"

      />
    )
  }

  renderRows() {
    const imageStyle = {
      flex: 1,
    }
    if (this.props.goodList && this.props.goodList.length) {
      let shopGoodsList = this.props.goodList.map((item, key) => {
        return (
          <View key={key} style={imageStyle}>
            {this.renderColumn(item)}
          </View>
        )
      })
      return shopGoodsList
    } else {
      return <View/>
    }

  }

  renderCutColumn(rowData, rowId) {
    let imgComp = this.renderRows()
    let compList = []
    let comp = []
    for (let i = 0; i < imgComp.length; i++) {
      comp.push(imgComp[i])
      if ((i + 1) % 2 == 0) {
        compList.push(comp)
        comp = []
      }
    }
    compList.push(comp)
    return compList
  }

  renderColumns() {
    let compList = this.renderCutColumn()
    return (
      compList.map((item, key) => {
        return (
          <View key={key} style={[styles.container, this.props.containerStyle]}>
            {item}
          </View>
        )
      })
    )
  }

  refreshData(payload) {


        this.loadMoreData(true)


  }

  loadMoreData(isRefresh, isEndReached) {
    // console.log('this.state===', this.state)
    if (this.isQuering) {
      return
    }
    this.isQuering = true

    let limit = 6
    let payload = {
      shopId: this.props.id,
      status: 1,
      limit: 6,
      lastUpdateTime: this.props.goodList[this.props.goodList.length-1].updatedAt,
      more:true,
      isRefresh: !!isRefresh,
      limit: limit,
      isLocalQuering: true,
      success: (isEmpty, fetchedSize) => {
        this.isQuering = false
        if (!this.listView) {
          return
        }
        if (isEmpty) {


          this.listView.isLoadUp(false)
        } else {
          this.listView.isLoadUp(true)
          if (isRefresh && fetchedSize < limit) {
            this.loadMoreData()
          }
        }
      },
      error: (err)=> {
        this.isQuering = false
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.getShopGoodsList(payload)
  }


  renderListRow(rowData, rowId) {

        return <View>{this.renderColumns()}</View>

  }

  render() {

    return (
      <View style={styles.body}>
        {this.renderMainHeader()}
        {/*<ScrollView  contentContainerStyle={[styles.contentContainerStyle]}*/}
        {/*onScroll={e => this.handleOnScroll(e)}*/}
        {/*scrollEventThrottle={80}*/}
        {/*>*/}
        {/*{this.renderColumns()}*/}
        {/*</ScrollView>*/}
        <View style={styles.contentContainerStyle}>
          <CommonListView
            contentContainerStyle={{backgroundColor: '#fff'}}
            dataSource={this.props.ds}
            renderRow={(rowData, rowId) => this.renderListRow(rowData, rowId)}
            loadNewData={()=> {
              this.refreshData()
            }}
            loadMoreData={()=> {
              this.loadMoreData()
            }}
            ref={(listView) => this.listView = listView}
          />
        </View>
      </View>
    )
  }
}

// Categorys.defaultProps = {
//   //visible: 'true'
//   defaultContainer: {},
//   defaultImageStyles: {},
// }

const mapStateToProps = (state, ownProps) => {
  const goodList = selectGoodsList(state, ownProps.id, 1)

  let ds = undefined
  if (ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }
  let dataArray = []

  // dataArray.push({type: 'SHOP_CATEGORY_COLUMN'})
  dataArray.push({type: 'LOCAL_SHOP_LIST_COLUMN'})
  console.log('goodlist',goodList)
  return {
    ds: ds.cloneWithRows(dataArray),
    goodList: goodList
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

  getShopGoodsList
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(ShopGoodsListView)

const styles = StyleSheet.create({


  defaultImageStyles: {
    height: normalizeH(169),
    width: normalizeW(169),
    resizeMode: 'contain'
  },
  channelWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalizeH(224),
    width: normalizeW(169),
    overflow: 'hidden',
    marginTop: normalizeH(10),
    marginLeft: normalizeW(7),
    borderWidth: normalizeBorder(0),
    backgroundColor: '#F5F5F5'
    // marginBottom:normalizeH(10),
    // marginLeft: normalizeW(20),
    // marginRight:normalizeW(20),
    // height: normalizeH(80),
    // width: normalizeW(35),
  },
  channelText: {
    marginTop: 10,
    width: normalizeW(144),
    height: normalizeH(12),
    fontSize: em(12),
    alignItems: 'flex-start',
    color: '#5A5A5A'
    // textAlign: 'start',
  },
  channelPrice: {
    // flexDirection:'row'
    marginTop: normalizeH(8),
    width: normalizeW(144),
    height: normalizeH(15),
    fontSize: em(15),
    // textAlign: 'start',
    // justifyContent:'flex-start'
    color: '#00BE96'
  },
  container: {
    backgroundColor: THEME.base.backgroundColor,
    // borderBottomWidth: normalizeBorder(),
    // borderBottomColor: THEME.colors.lighterA,
    width: PAGE_WIDTH,
    flexDirection: 'row',
    //  flexWrap: 'wrap',
    //justifyContent: 'center',
    // borderColor: '#E6E6E6',
    // borderTopWidth: normalizeBorder(1),
    // paddingTop:normalizeH(10),
    paddingLeft: normalizeH(8),
    paddingRight: normalizeH(8),

  },
  columnContainer: {
    backgroundColor: THEME.base.backgroundColor,

    flex: 1
    //   borderBottomWidth:normalizeBorder(1),
    //   width: PAGE_WIDTH,
    //   flexDirection: 'row',
    // //  flexWrap: 'wrap',
    //   justifyContent: 'center',
    //   borderColor:'#E6E6E6',
    //   borderTopWidth:normalizeH(1),
  },
  body: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    width: PAGE_WIDTH,
  },
  contentContainerStyle: {
    marginTop: normalizeH(64)

  },

})