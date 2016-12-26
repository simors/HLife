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
import {CommonWebView} from '../common/CommonWebView'
import CommentPublic from './CommentPublic'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class Article extends Component {
  constructor(props) {
    super(props)

  }


  render() {
    return (
      <View style={styles.container}>
        <Header leftType='icon'
                leftPress={() => Actions.pop()}
                rightType='image'
                rightImageSource={require("../../assets/images/artical_share.png")}>

        </Header>
        <ScrollView>
        <View style={styles.cotainer}>
        <View style={styles.titleView}>
          <Text style={{fontSize:normalizeH(17), color:'#636363',marginLeft:normalizeW(12),fontWeight:'bold'}}>{this.props.title}</Text>
        </View>
        <View style={styles.authorView}>
          <Image style={{height:normalizeH(30),width:normalizeW(30),overflow:'hidden',borderRadius:normalizeW(15),marginLeft:normalizeW(12)}} source={{uri: this.props.avatar}}></Image>
          <Text style={{fontSize:normalizeH(15), color:'#929292',marginLeft:normalizeW(12)}}>{this.props.nickname}</Text>
        </View>

          <WebView style={styles.articleView}
                  source= {{html: this.props.content}}
          >

          </WebView>
          </View>
        </ScrollView>
        <View style={styles.commentView}>
          <CommentPublic></CommentPublic>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleView: {
      height: normalizeH(39),
      width: PAGE_WIDTH,
      marginTop: normalizeH(64),
      borderBottomWidth: normalizeBorder(3),
      borderColor:'#E6E6E6',
      justifyContent: 'center',
    },
    authorView: {
      height: normalizeH(50),
      width: PAGE_WIDTH,
      marginTop: normalizeH(3),
      alignItems: 'center',
      flexDirection:'row',
    },
    articleView: {
      height: normalizeH(452),
      width: PAGE_WIDTH,
    },
    commentView: {
      height: normalizeH(50),
      width: PAGE_WIDTH,
      backgroundColor:'#FAFAFA'
    }
  })