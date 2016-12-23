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

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class Article extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <View style={styles.container}>
        <Header>
          leftType="icon"
          leftPress={() => Actions.pop()}
          rightType="image"
          rightImageSource={require("../../assets/images/artical_share.png")}
        </Header>
        <ScrollView>
        <View style={styles.cotainer}>
        <View style={styles.titleView}>
          <Text style={{fontSize:normalizeH(17), color:'#636363'}}>{this.props.title}</Text>
        </View>
        <View style={styles.authorView}>
          <Text style={{fontSize:normalizeH(15), color:'#929292'}}>{this.props.author}</Text>
        </View>

          <WebView style={styles.articleView}
                  source= {{html: this.props.html}}
          >

          </WebView>
          </View>
        </ScrollView>
        <View style={styles.commentView}>

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
      borderWidth: normalizeBorder(1),
      justifyContent: 'center',
    },
    authorView: {
      height: normalizeH(50),
      width: PAGE_WIDTH,
      marginTop: normalizeH(3),
      justifyContent: 'center',
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