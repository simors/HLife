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

class Categorys extends Component {
  constructor(props) {
    super(props)
    this.state={
      imgSize: normalizeW(45),
      columnCnt: this.props.column.size,

    }
  }

  renderColumn(value){
    //console.log('value====>',value)
    return(
      <TouchableOpacity onPress={()=>this.props.onPress(value.columnId)}>
        <View  style={styles.channelWrap}>
            <Image style={styles.defaultImageStyles} source={{uri: value.imageSource}}/>
            <Text style={ {marginTop:normalizeH(7),fontSize: em(15), color: '#929292'}}>{value.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderRows(){
    const imageStyle={
      flex:1,
    }
    let imgComp = this.props.column.map((item, key) => {
      return (
        <View key={key} style={imageStyle}>
          {this.renderColumn(item)}
        </View>
      )
    })
    return imgComp
  }

  renderCutColumn(){
    let imgComp = this.renderRows()
    let compList = []
    let comp = []
      for (let i = 0; i < imgComp.length; i++) {
      comp.push(imgComp[i])
      if ((i + 1) % 4 == 0) {
        compList.push(comp)
        comp = []
      }
    }
      compList.push(comp)
    return compList
  }

  renderColumns(){
    let compList = this.renderCutColumn()
    return (
      compList.map((item, key) => {
        return (
          <View  key={key} style={[styles.container, this.props.containerStyle]}>
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

Categorys.defaultProps = {
  //visible: 'true'
  defaultContainer: {},
  defaultImageStyles: {},
}

const mapStateToProps = (state, ownProps) => {
  let column = getColumn(state).toJS()
  //console.log('susususususu<><><><><',column)
  return {
    column: column,
  }
}

// const mapDispatchToProps = (dispatch) => bindActionCreators({
//
// }, dispatch)


export default connect(mapStateToProps)(Categorys)

const styles = StyleSheet.create({


  defaultImageStyles: {
    height: normalizeH(45),
    width: normalizeW(45),
  },
  channelWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height:normalizeH(80),
     width:normalizeW(93),
    overflow: 'hidden',
    marginTop: normalizeH(10),
    marginBottom:normalizeH(10),
    // marginLeft: normalizeW(20),
    // marginRight:normalizeW(20),
   // height: normalizeH(80),
    // width: normalizeW(35),
  },
  channelText: {
    marginTop: 7,
  //  textAlign: 'center',
  },
  container:{
    borderBottomWidth:normalizeBorder(1),
    width: PAGE_WIDTH,
    flexDirection: 'row',
    //  flexWrap: 'wrap',
    //justifyContent: 'center',
    borderColor:'#E6E6E6',
    borderTopWidth:normalizeBorder(1),
     // paddingTop:normalizeH(10),
     // paddingBottom:normalizeH(10),
  },
  columnContainer: {
    flex:1
  //   borderBottomWidth:normalizeBorder(1),
  //   width: PAGE_WIDTH,
  //   flexDirection: 'row',
  // //  flexWrap: 'wrap',
  //   justifyContent: 'center',
  //   borderColor:'#E6E6E6',
  //   borderTopWidth:normalizeH(1),
  },
})