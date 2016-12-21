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
import Header from '../common/Header'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {getColumn} from '../../selector/configSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Article extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <View style={styles.container}>
        <Header>
          {/*leftType="image"*/}
          {/*leftImageSource={require("../../assets/images/local_unselect.png")}*/}
          {/*leftImageLabel="长沙"*/}
          leftPress={() => Actions.pop()}
          {/*title=""*/}
          rightType="image"
          rightImageSource={require("../../assets/images/artical_share.png")}
          {/*rightPress={() => Actions.REGIST()}*/}
        </Header>>
        <ScrollView>
        <View style={styles.cotainer}>
        <View style={styles.titleView}>

        </View>
        <View style={styles.authorView}>

        </View>

          <View style={styles.articleView}>

          </View>
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
      alignItems: 'stretch',
      backgroundColor: '#F5FCFF'
    },
    titleView: {
      height: normalizeH(39),
      width: PAGE_WIDTH,
      marginTop: normalizeH(3),
      borderWidth: normalizeBorder(1),
    },
    authorView: {
      height: normalizeH(50),
      width: PAGE_WIDTH,
      marginTop: normalizeH(3),
    },
    articleView: {
      height: normalizeH(452),
      width: PAGE_WIDTH,
    },
    commentView: {
      height: normalizeH(50),
      width: PAGE_WIDTH,
    }
  })