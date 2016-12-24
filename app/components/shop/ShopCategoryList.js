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
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'

import Header from '../common/Header'
import {
  Option,
  OptionList,
  Select
} from '../common/CommonSelect'
import CommonListView from '../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopCategoryList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shoCategoryId: '',
      sortId: '0',
      distanceId: '',
      selectGroupShow: [false, false, false],

    }
  }

  _getOptionList(OptionListRef) {
    return this.refs[OptionListRef];
  }


  _onSelectShopCategory(shoCategoryId) {
    this.state.selectGroupShow = [false, false, false]
    this.setState({
      ...this.state,
      shoCategoryId: shoCategoryId,
      selectGroupShow: this.state.selectGroupShow
    });
  }

  _onSelectSort(sortId) {
    this.state.selectGroupShow = [false, false, false]
    this.setState({
      ...this.state,
      sortId: sortId,
      selectGroupShow: this.state.selectGroupShow
    })
  }

  _onSelectDistance(distanceId) {
    this.state.selectGroupShow = [false, false, false]
    this.setState({
      ...this.state,
      distanceId: distanceId,
      selectGroupShow: this.state.selectGroupShow
    });
  }

  _onSelectPress(index){
    if(index == 0) {
      this.state.selectGroupShow = [!this.state.selectGroupShow[0], false, false]
    }else if(index == 1) {
      this.state.selectGroupShow = [false, !this.state.selectGroupShow[1], false]
    }else if(index == 2) {
      this.state.selectGroupShow = [false, false, !this.state.selectGroupShow[2]]
    }
    // console.log('this.state.selectGroupShow.1=', this.state.selectGroupShow[index])

    this.setState({ //Notes:触发子组件更新
      selectGroupShow: this.state.selectGroupShow
    })
    // console.log('this.state.selectGroupShow.3=', this.state.selectGroupShow)
  }

  renderShopCategoryOptions() {
    let optionsView = <View />
    if(this.props.allShopCategories) {
      optionsView = this.props.allShopCategories.map((item, index) => {
        return (
          <Option ref={"option_"+index} key={"shopCategoryOption_" + index} value={item.shopCategoryId}>{item.text}</Option>
        )
      })
    }
    return optionsView
  }

  gotoShopDetailScene(shopCategoryId) {
    Toast.show('店铺id=' + shopCategoryId, {duration: 1000})
  }

  renderRow(rowData, rowId) {
    const scoreWidth = rowData.score / 5.0 * 62
    return (
      <TouchableWithoutFeedback onPress={()=>{this.gotoShopDetailScene(rowData.shopCategoryId)}}>
        <View style={styles.shopInfoWrap}>
          <View style={styles.coverWrap}>
            <Image style={styles.cover} source={{uri: rowData.coverUrl}}/>
          </View>
          <View style={styles.shopIntroWrap}>
            <Text style={styles.shopName} numberOfLines={1}>{rowData.shopName}</Text>
            <View style={styles.scoresWrap}>
              <View style={styles.scoreIconGroup}>
                <View style={[styles.scoreBackDrop, {width: scoreWidth}]}></View>
                <Image style={styles.scoreIcon} source={require('../../assets/images/star_empty.png')}/>
              </View>
              <Text style={styles.score}>3.5</Text>
            </View>
            <View style={styles.subInfoWrap}>
              <Text style={styles.subTxt}>{rowData.pv}人看过</Text>
              <Text style={styles.subTxt}>{rowData.businessArea}</Text>
              <Text style={styles.subTxt}>{rowData.distance}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  refreshData() {

  }

  loadMoreData() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="全部店铺"
          rightType="none"
        />
        <View style={styles.body}>
          <View style={{paddingTop: 40}}>
            <CommonListView
              contentContainerStyle={{backgroundColor: 'rgba(0,0,0,0.05)'}}
              dataSource={this.props.ds}
              renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
              loadNewData={()=>{this.refreshData()}}
              loadMoreData={()=>{this.loadMoreData()}}
            />
          </View>

          <View style={styles.selectGroup}>
            <View style={{ flex: 1}}>
              <Select
                show={this.state.selectGroupShow[0]}
                onPress={()=>this._onSelectPress(0)}
                style={{borderBottomWidth:normalizeBorder()}}
                selectRef="SELECT1"
                overlayPageX={0}
                optionListHeight={330}
                optionListRef={()=> this._getOptionList('SHOP_CATEGORY_OPTION_LIST')}
                defaultText="全部分类"
                defaultValue=""
                onSelect={this._onSelectShopCategory.bind(this)}>
                <Option key={"shopCategoryOption_-1"} value="">全部分类</Option>
                {this.renderShopCategoryOptions()}
              </Select>
              <OptionList ref="SHOP_CATEGORY_OPTION_LIST"/>
            </View>
            <View style={{ flex: 1}}>
              <Select
                show={this.state.selectGroupShow[1]}
                onPress={()=>this._onSelectPress(1)}
                style={{borderWidth:normalizeBorder()}}
                selectRef="SELECT2"
                overlayPageX={PAGE_WIDTH/3}
                optionListHeight={270}
                optionListRef={()=> this._getOptionList('DISTANCE_OPTION_LIST')}
                defaultText="全城"
                defaultValue=""
                onSelect={this._onSelectDistance.bind(this)}>
                <Option key={"distanceOption_0"} value="1">1km</Option>
                <Option key={"distanceOption_1"} value="2">2km</Option>
                <Option key={"distanceOption_2"} value="5">5km</Option>
                <Option key={"distanceOption_3"} value="10">10km</Option>
                <Option key={"distanceOption_4"} value="">全城</Option>
              </Select>
              <OptionList ref="DISTANCE_OPTION_LIST"/>
            </View>
            <View style={{ flex: 1}}>
              <Select
                show={this.state.selectGroupShow[2]}
                onPress={()=>this._onSelectPress(2)}
                style={{borderBottomWidth:normalizeBorder()}}
                selectRef="SELECT3"
                overlayPageX={PAGE_WIDTH * 2 / 3 }
                optionListRef={()=> this._getOptionList('SORT_OPTION_LIST')}
                defaultText="智能排序"
                defaultValue="0"
                onSelect={this._onSelectSort.bind(this)}>
                <Option key={"sortOption_0"} value="0">智能排序</Option>
                <Option key={"sortOption_1"} value="1">好评优先</Option>
                <Option key={"sortOption_2"} value="2">距离优先</Option>
              </Select>
              <OptionList ref="SORT_OPTION_LIST"/>
            </View>
          </View>

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
  let dataArray = []
  let shopInfo = {
    shopCategoryId: 1,
    pv: '100w+',
    coverUrl: 'http://img1.3lian.com/2015/a1/53/d/200.jpg',
    shopName: '乐会港式茶餐厅（奥克斯广场店）乐会港式茶餐厅',
    score: 3.5,
    businessArea: '银盆岭',
    distance: '4.3km'

  }
  dataArray.push(shopInfo)
  dataArray.push(shopInfo)
  dataArray.push(shopInfo)
  dataArray.push(shopInfo)
  dataArray.push(shopInfo)
  dataArray.push(shopInfo)
  dataArray.push(shopInfo)
  dataArray.push(shopInfo)
  dataArray.push(shopInfo)
  dataArray.push(shopInfo)

  let shopCategories = []
  let ts = {
    shopCategoryId: "1",
    text: '美食特色'
  }
  shopCategories.push(ts)
  shopCategories.push(ts)
  shopCategories.push(ts)
  shopCategories.push(ts)
  shopCategories.push(ts)
  let allShopCategories = shopCategories

  return {
    ds: ds.cloneWithRows(dataArray),
    allShopCategories: allShopCategories,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopCategoryList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  selectGroup: {
    position: 'absolute',
    left: 0,
    top: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: THEME.colors.lessWhite,
  },
  shopInfoWrap: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginBottom: normalizeH(10),
    backgroundColor: '#fff'
  },
  coverWrap: {
    width: 80,
    height: 80
  },
  cover: {
    flex: 1
  },
  shopIntroWrap: {
    paddingLeft: 10,
  },
  shopName: {
    lineHeight: 20,
    fontSize: em(17),
    color: '#8f8e94'
  },
  score: {
    marginLeft: 5,
    color: '#f5a623',
    fontSize: em(12)
  },
  scoresWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreIconGroup: {
    width: 62,
    height: 11,
    backgroundColor: '#d8d8d8'
  },
  scoreBackDrop: {
    height: 11,
    backgroundColor: '#f5a623'
  },
  scoreIcon: {
    position: 'absolute',
    left: 0,
    top: 0
  },
  subInfoWrap: {
    flexDirection: 'row',
  },
  subTxt: {
    marginRight: normalizeW(10),
    color: '#d8d8d8',
    fontSize: em(12)
  }
})