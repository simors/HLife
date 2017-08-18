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
import GoodShow from './GoodShow'


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
        <View style={{flex:1,paddingTop:normalizeH(5),paddingBottom:normalizeH(5)}}>
       <GoodShow goodInfo={goodInfo} key={goodInfo.id}/>
          </View>
      </TouchableOpacity>
    )
  }

  renderLastColumn(goodInfo){
    return (
      <TouchableOpacity onPress={()=>this.showGoodDetail(goodInfo)}>
        <View style={{flex:1,paddingTop:normalizeH(5),paddingBottom:normalizeH(5)}}>
          <GoodShow goodInfo={goodInfo} key={goodInfo.id} showType = 'lastGood' />
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
          if(this.props.shopGoodsList.length==1||this.props.shopGoodsList.length==3||this.props.shopGoodsList.length==5){
            if(key == this.props.shopGoodsList.length-1){
              return (<View key={key} style={imageStyle}>
                {this.renderLastColumn(item)}
              </View>)
            }
          }
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
    // justifyContent: 'center',
    // alignItems: 'center',
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
    marginLeft:normalizeW(10),

    marginTop: normalizeH(10),
    width: normalizeW(144),
    height: normalizeH(12),
    fontSize: em(13),
    alignItems: 'flex-start',
    color: '#5A5A5A'
  },
  channelPrice: {
    flex:1,
    marginBottom: normalizeH(6),
    marginLeft:normalizeW(10),
    width: normalizeW(144),
    height: 15,
    fontSize: em(17),
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