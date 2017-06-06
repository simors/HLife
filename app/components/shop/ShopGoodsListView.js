/**
 * Created by lilu on 2017/6/6.
 */
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
  TouchableHighlight,
  Animated,

} from 'react-native'
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

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class ShopGoodsListView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgSize: normalizeW(45),
      columnCnt: this.props.size,
      fade: new Animated.Value(0),

    }
  }

  renderColumn(value) {
    //console.log('value====>',value)
    return (
      <TouchableOpacity onPress={()=>this.props.showGoodDetail(value.goodId)}>
        <View style={styles.channelWrap}>

          <Image style={styles.defaultImageStyles} source={{uri: value.imageSource}}/>
          <Text style={ styles.channelText}>{value.title}</Text>
          <Text style={ styles.channelPrice}>{'¥' + value.price}</Text>

        </View>
      </TouchableOpacity>
    )
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
      <Animated.View style={{
        backgroundColor: THEME.base.mainColor,
        opacity: this.state.fade,
        position: 'absolute',
        top: 0,
        left: 0,
        width: PAGE_WIDTH,
        zIndex: 10,
      }}
      >
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
      </Animated.View>
    )
  }

  renderRows() {
    const imageStyle = {
      flex: 1,
    }
    let shopGoodsList = this.props.shopGoodsList.map((item, key) => {
      return (
        <View key={key} style={imageStyle}>
          {this.renderColumn(item)}
        </View>
      )
    })
    return shopGoodsList
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
      <View style={styles.body}>
        {this.renderMainHeader()}
        <ScrollView  contentContainerStyle={[styles.contentContainerStyle]}
                     onScroll={e => this.handleOnScroll(e)}
                     scrollEventThrottle={80}
        >
          {this.renderColumns()}
        </ScrollView>
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
  body:{
    flex:1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    width:PAGE_WIDTH,
  },
  contentContainerStyle: {},

})