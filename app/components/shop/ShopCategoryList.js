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
  TouchableOpacity,
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
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'

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
        paddingTop: normalizeH(64),
      },
      android: {
        paddingTop: normalizeH(44)
      }
    }),
    flex: 1,
  },
  selectGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: THEME.colors.lessWhite,
  }
})