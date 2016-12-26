/**
 * Created by lilu on 2016/12/25.
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
  WebView
} from 'react-native'
import Header from '../common/Header'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {getColumn} from '../../selector/configSelector'
import {Actions} from 'react-native-router-flux'
import {CommonTextInput} from '../../components/common/Input/CommonTextInput'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class CommentPublic extends Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <View style={styles.container}>
<View style={styles.inputComment}>

  </View>
        <View style={styles.comment}>
          <Image source={require('../../assets/images/artical_comments_unselect.png')}></Image>
        </View>
        <View style={styles.like}>
          <Image source={require('../../assets/images/artical_like_unselect.png')}></Image>
        </View>
        <View style={styles.favorite}>
          <Image source={require('../../assets/images/artical_favorite_unselect.png')}></Image>
        </View>
      </View>
    )
  }
}

const styles=StyleSheet.create(
  {
    container:{
      flexDirection:'row',
      backgroundColor:'#FAFAFA',
      width:PAGE_WIDTH,
      height:normalizeH(50),
      borderTopWidth:normalizeBorder(1),
    },
    inputComment:{
      height:normalizeH(30),
      width:normalizeW(145),
      marginLeft:normalizeW(13),
      marginTop:normalizeH(10),
      marginBottom:normalizeH(10),
    },
    comment:{
      marginLeft:normalizeW(30),
      marginTop:normalizeH(5),
      marginBottom:normalizeH(13),
      height:normalizeH(32),
      width:normalizeW(35),
    },
    like:{
      marginLeft:normalizeW(28),
      marginTop:normalizeH(15),
      marginBottom:normalizeH(13),
      height:normalizeH(22),
      width:normalizeW(25),
    },
    favorite:{
      marginLeft:normalizeW(40),
      marginTop:normalizeH(15),
      marginBottom:normalizeH(13),
      height:normalizeH(22),
      width:normalizeW(25),
    }


  }
)
