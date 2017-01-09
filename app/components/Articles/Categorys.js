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
            <TouchableOpacity onPress={()=>this.props.onPress(value.columnId)}>
              <View key={key} style={styles.channelWrap}>
                <View style={styles.defaultImageStyles}>
                  <Image style={styles.defaultImageStyles} source={{uri: imageUrl}}/>
                </View>
                <View style={styles.channelText}>
                  <Text style={ {fontSize: normalizeW(15),
                    color: '#929292'}}>{value.title}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        })
      )
    }
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


  defaultImageStyles: {
    height: normalizeH(45),
    width: normalizeW(45),
  },
  channelWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // overflow: 'hidden',
    marginTop: normalizeH(20),
    marginBottom:normalizeH(20),
    marginLeft: normalizeW(20),
    marginRight:normalizeW(20),
   // height: normalizeH(80),
    // width: normalizeW(35),
  },
  channelText: {
    marginTop: 7,
  //  textAlign: 'center',
  },
  columnContainer: {
    borderBottomWidth:normalizeBorder(2),
    width: PAGE_WIDTH,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderColor:'#E6E6E6',
    borderTopWidth:normalizeH(2),
  },
})