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

  }

  renderColumns() {
    if (this.props.column) {
      return (
        this.props.column.map((value, key) => {
          let imageUrl = value.imageSource
          return (
            <View key={key} style={styles.channelWrap}>
              <TouchableOpacity onPress={()=> {
                Actions.ARTICLES_ARTICLELIST({categoryId: value.columnId})
              }}>
                <Image style={[styles.defaultImageStyles,this.props.imageStyle]} source={{uri: imageUrl}}/>
                <Text style={styles.channelText}>{value.title}</Text>
              </TouchableOpacity>
            </View>
          )
        })
      )
    }
  }
  renderElems(begin) {
    return (
      this.props.column.map((value, key) => {
        if (key >= begin && key < begin + 4) {
          return (
            <View key={key} style={styles.channelWrap}>
                <TouchableOpacity onPress={()=> {
              }}>
                <Image style={[styles.defaultImageStyles, this.props.imageStyle]} source={{uri: value.imageSource}}/>
                <Text style={styles.channelText}>{value.title}</Text>
              </TouchableOpacity>
            </View>
          )
        }
      })
    )
  }

  renderCategorysRow(begin) {
    return (
      <View style={styles.rowView}>
        {this.renderElems(begin)}
      </View>
    )
  }

  renderCategorys() {
    if (!this.props.column) {
      return (
        <View>
        </View>
      )
    }
    return (
      this.props.column.map((value, key) => {
        if (key % 4 == 0) {

          this.renderCategorysRow(key)
        }
      })
    )
  }

  render() {
    return (
      <View >
        {this.renderColumns()}
      </View>

    )
  }
}

Categorys.defaultProps = {
  //visible: 'true'
  defaultContainer:{},
  defaultImageStyles:{},
}

const mapStateToProps = (state, ownProps) => {
  let column = getColumn(state)
  return {
    column: column,
  }
}

// const mapDispatchToProps = (dispatch) => bindActionCreators({
//
// }, dispatch)


export default connect(mapStateToProps)(Categorys)

const styles = StyleSheet.create({
  body:{
    backgroundColor:'#FFFFFF',
    opacity:1,
  },
  blankView:{
    height:normalizeH(186),
    opacity:0.3,
    backgroundColor:'#000000'
  },
  defaultContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: PAGE_WIDTH,
    marginTop: normalizeH(186),
    opacity:80
  },
  rowView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  defaultImageStyles: {
    height: normalizeH(35),
    width: normalizeW(35),
  },
  category: {
    width: PAGE_WIDTH,
    height: normalizeH(276),
    borderWidth: normalizeBorder(2),
    backgroundColor:'#FFFFFF',
    opacity:1,
    marginTop:normalizeH(3),
  },
  title:{
    height:normalizeH(67),
    width:PAGE_WIDTH,
    borderWidth:normalizeBorder(1),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FFFFFF',
    opacity:1,
  },
  titletext:{
    height:normalizeH(20),
    fontSize:normalizeW(18),
    width:normalizeW(186),
  },
  cancelModal:
  {

    justifyContent: 'center',
    alignItems: 'center',
    marginTop:normalizeH(3),
    height:normalizeH(132),
    width:PAGE_WIDTH,
    backgroundColor:'#FFFFFF',
    opacity:1,

  },
  channelContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  defaultImageStyles:{
    height:normalizeH(35),
    width:normalizeW(35),
  },
  channelWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow:'hidden'
  },
  channelText: {
    marginTop: 4,
    color:THEME.colors.gray,
    textAlign: 'center'
  },
  columnContainer:{
    width:PAGE_WIDTH,
    flexDirection:'row',
    flexWrap: 'wrap',

  },
})