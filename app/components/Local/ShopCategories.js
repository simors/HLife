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
import {Actions} from 'react-native-router-flux'
import shallowequal from 'shallowequal'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import ShopCategory from './ShopCategory'

const PAGE_WIDTH = Dimensions.get('window').width

export default class ShopCategories extends Component {
  constructor(props) {
    super(props)
    this._initState = this._initState.bind(this)
    this._calContainer = this._calContainer.bind(this)
    this._totalRow = this._totalRow.bind(this)
    this._getCategoryWidth = this._getCategoryWidth.bind(this)
    this._getCategoryHeight = this._getCategoryHeight.bind(this)
    this.state = this._initState(this.props)
  }
  shouldComponentUpdate(nextProps,nextState){
    if (!shallowequal(this.props, nextProps))
    {
      return true
    }
    // console.log('here is false')
    return false
  }

  _initState(props) {
    let initState = {
      width: PAGE_WIDTH,
      height: undefined,
    }
    return initState
  }

  _calContainer(e) {
    if (this.props.fixedHeight && this.state.height != e.nativeEvent.layout.height) {
      let width = e.nativeEvent.layout.width
      let height = e.nativeEvent.layout.height
      this.setState({
        width: width,
        height: height,
      })
    }
  }

  _totalRow() {
    let totalRow = 0
    if(this.props.shopCategories && this.props.shopCategories.length) {
      if(this.props.shopCategories.length % 2 == 0) {
        totalRow = this.props.shopCategories.length / 2
      }else{
        totalRow = (this.props.shopCategories.length + 1) / 2
      }
    }
    return totalRow
  }

  _getCategoryWidth() {
    let categoryWidth = this.state.width / 2
    return categoryWidth
  }

  _getCategoryHeight() {
    let categoryHeight = normalizeH(60)
    if(this.props.fixedHeight && this.props.shopCategories && this.props.shopCategories.length) {
      let totalRow = this._totalRow()
      categoryHeight = this.state.height / totalRow
    }
    return categoryHeight
  }

  renderCategories() {
    let shopCategoriesViews = <View />
    if(this.props.shopCategories && this.props.shopCategories.length) {
      let categoryWidth = this._getCategoryWidth()
      let categoryHeight = this._getCategoryHeight()
      shopCategoriesViews = this.props.shopCategories.map((item, index)=>{
        return (
          <View
            style={{width: categoryWidth, height: categoryHeight}}
            key={'shop_category_' + index}
          >
            <ShopCategory
              imageSource={item.imageSource}
              text={item.text}
              onPress={()=>this.props.onPress(item.shopCategoryId, item.text)}
            />
          </View>
        )
      })
      if(this.props.showMore) {
        shopCategoriesViews.push(
          <View
            style={{width: categoryWidth, height: categoryHeight}}
            key={'shop_category_more'}
          >
            <ShopCategory
              imageSource={require("../../assets/images/local_more.png")}
              text='更多服务'
              onPress={()=>this.props.onPress()}
            />
          </View>)
      }

    }
    return shopCategoriesViews
  }

  renderRowLines() {
    let rowLineViews = <View />
    if(this.props.shopCategories && this.props.shopCategories.length) {
      let totalRow = this._totalRow()
      let start = 1
      if(this.props.hasTopBorder) {
        start = 0
        totalRow += 1
      }
      if(this.props.hasBottomBorder) {
        totalRow += 1
      }
      let categoryHeight = this._getCategoryHeight()
      rowLineViews = Array.apply(null,Array(totalRow - 1)).map(function(value, index){
        let _top = categoryHeight * (index + start)
        return (
          <View style={[styles.rowLine, {top: _top}]} key={'row_line_' + index} />
        )
      })
    }
    return rowLineViews
  }

  renderColLine() {
    if(this.props.shopCategories && this.props.shopCategories.length) {
      return (
        <View style={[styles.colLine, {left: this.state.width / 2}]}/>
      )
    }
  }

  render() {
    return (
      <View style={[styles.wrapper]} onLayout={this._calContainer}>
        {this.renderCategories()}
        {this.renderColLine()}
        {this.renderRowLines()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
  },
  colLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderLeftWidth: normalizeBorder(),
    borderLeftColor: THEME.colors.lighterA
  },
  rowLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: normalizeBorder(),
    borderTopColor: THEME.colors.lighterA
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  borderBottom: {
    borderBottomWidth: normalizeBorder(),
    borderBottomColor:THEME.colors.lighterA
  },
  

})