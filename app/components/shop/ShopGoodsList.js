import React, {Component} from 'react'
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
  TouchableHighlight
} from 'react-native'
import {CachedImage} from "react-native-img-cache"
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {Actions} from 'react-native-router-flux'
import {getThumbUrl} from '../../util/ImageUtil'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class ShopGoodsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgSize: normalizeW(45),
      columnCnt: this.props.size,

    }
  }

  showGoodDetail(goodInfo){
    Actions.SHOP_GOODS_DETAIL({goodInfo:goodInfo})
  }

  renderColumn(goodInfo) {
    return (
      <TouchableOpacity onPress={()=>this.showGoodDetail(goodInfo)}>
        <View style={styles.channelWrap}>
          <View style={styles.defaultImageStyles}>
          <CachedImage mutable style={styles.defaultImageStyles}
                       source={goodInfo.coverPhoto ? {uri: getThumbUrl(goodInfo.coverPhoto, normalizeW(169), normalizeH(169))} : require("../../assets/images/default_goods_cover.png")}/>
          </View>
            {/*<Image style={styles.defaultImageStyles} source={{uri: value.coverPhoto}}/>*/}
          <Text style={ styles.channelText} numberOfLines={1}>{goodInfo.goodsName}</Text>
          <Text style={ styles.channelPrice} numberOfLines={1}>{'¥' + goodInfo.price}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderRows() {
    const imageStyle = {
      flex: 1,
    }
    if(this.props.shopGoodsList&&this.props.shopGoodsList.length){
      let shopGoodsListView = this.props.shopGoodsList.map((item, key) => {
        if(key<6) {
          return (
            <View key={key} style={imageStyle}>
              {this.renderColumn(item)}
            </View>
          )
        }
      })
      return shopGoodsListView
    }else{
      return <View/>
    }

  }

  renderCutColumn() {
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


  render() {
    return (
      <View style={styles.columnContainer}>
        {this.renderColumns()}
      </View>

    )
  }
}

const styles = StyleSheet.create({


  defaultImageStyles: {
    height: normalizeH(169),
    width: normalizeW(169),
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
    borderWidth:normalizeBorder(0),
    backgroundColor:'#F5F5F5'
  },
  channelText: {
    flex:1,
    flexDirection:'row',
    marginTop: normalizeH(10),
    width: normalizeW(144),
    height: normalizeH(12),
    fontSize: em(12),
    alignItems: 'flex-start',
    color: '#5A5A5A'
  },
  channelPrice: {
    flex:1,
    marginTop: normalizeH(6),
    width: normalizeW(144),
    height: 15,
    fontSize: em(15),
    color: '#00BE96'
  },
  container: {
    backgroundColor: THEME.base.backgroundColor,
    width: PAGE_WIDTH,
    flexDirection: 'row',
     paddingLeft:normalizeH(8),
    paddingRight:normalizeH(8),

  },
  columnContainer: {
    backgroundColor: THEME.base.backgroundColor,

    flex: 1
  },
})