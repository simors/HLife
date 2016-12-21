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

  ScrollView,
  TouchableHighlight
} from 'react-native'
import Header from '../common/Header'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import icon from 'react-native-vector-icons/Ionicons'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {getColumn} from '../../selector/configSelector'
import {Actions} from 'react-native-router-flux'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height


export default class ArticleShow extends Component{
  constructor(props)
  {
    super(props)
  }
  render(){
    return(
      <View style={styles.container}>
        <View style={styles.oneImage}>
          <View>
            <Image style={styles.image} source={{uri: 'http://img1.3lian.com/2015/a1/53/d/198.jpg'}}>

            </Image>
          </View>
          <View style={styles.articleInfo}>
            <View style={styles.title}>
            <Text>一生一次的婚礼要搭裙子</Text>
              </View>
            <View style={styles.author}></View>
            <View style={styles.comment}></View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create(
  {
    container:{
      flex: 1,
      alignItems: 'stretch',
      backgroundColor: '#F5FCFF'
    },
    oneImage:{
      backgroundColor:'#FFFFFF',
      height:normalizeH(137),
      width:PAGE_WIDTH,
      flexDirection:'row',
    },
    image:{
      marginTop:normalizeH(10),
      marginLeft:normalizeW(10),
      marginRight:normalizeW(10),
      marginBottom:normalizeH(10),
      height:normalizeH(117),
      width:normalizeW(117),
    },
    articleInfo:{
      flex:1,
      marginTop:normalizeH(10)
    },
    title:{
      height:normalizeH(40),
      width:normalizeW(260),
    },
    author:{
      height:normalizeH(40),
      width:normalizeW(260),
    },
    comment:{
      height:normalizeH(44),
      width:normalizeW(260),
    },
  }
)
