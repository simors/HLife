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

import AV from 'leancloud-storage'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {getColumn} from '../../selector/configSelector'
import {CommonModal} from '../common/CommonModal'
import {Actions} from 'react-native-router-flux'

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

  showGoodDetail(value){
    // this.props.showGoodDetail(value)
    Actions.SHOP_GOODS_DETAIL({value:value})
  }

  renderColumn(value) {
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

  renderRows() {
    const imageStyle = {
      flex: 1,
    }
    // let shopGoodsList = []
    // if(this.props.shopGoodsList.length>6){
    //   shopGoodsList = this.props.shopGoodsList.splice(6,this.props.shopGoodsList.length)
    // }else{
    //   shopGoodsList=this.props.shopGoodsList
    // }
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

// Categorys.defaultProps = {
//   //visible: 'true'
//   defaultContainer: {},
//   defaultImageStyles: {},
// }

// const mapStateToProps = (state, ownProps) => {
//   let column = getColumn(state).toJS()
//   //console.log('susususususu<><><><><',column)
//   return {
//     column: column,
//   }
// }

// const mapDispatchToProps = (dispatch) => bindActionCreators({
//
// }, dispatch)


// export default connect(mapStateToProps)(Categorys)

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
    borderWidth:normalizeBorder(0),
    backgroundColor:'#F5F5F5'
    // marginBottom:normalizeH(10),
    // marginLeft: normalizeW(20),
    // marginRight:normalizeW(20),
    // height: normalizeH(80),
    // width: normalizeW(35),
  },
  channelText: {
    marginTop: normalizeH(10),
    width: normalizeW(144),
    height: normalizeH(12),
    fontSize: em(12),
    alignItems:'flex-start',
    color:'#5A5A5A'
      // textAlign: 'start',
  },
  channelPrice: Platform.OS=='ios'?{
    // flexDirection:'row'
    marginTop: normalizeH(8),
    width: normalizeW(144),
    height: normalizeH(15),
    fontSize: em(15),
    // textAlign: 'start',
    // justifyContent:'flex-start'
    color: '#00BE96'
  }:{
    marginTop: normalizeH(8),
    width: normalizeW(144),
    height: normalizeH(15),
    fontSize: em(14),
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
     paddingLeft:normalizeH(8),
    paddingRight:normalizeH(8),

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
})