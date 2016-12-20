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
import icon from 'react-native-vector-icons/Ionicons'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {getColumn} from '../../selector/configSelector'
import {Actions} from 'react-native-router-flux'
import ArticleColumn from './ArticleColumn'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class ArticleList extends Component {
  constructor(props)
  {
    super(props)
  }

  render(){
    return(
      <View style={styles.container}>
        <Header>
          leftType="icon"
          {/*leftImageSource={require("../../assets/images/local_unselect.png")}*/}
          {/*leftImageLabel="长沙"*/}
          leftPress={() => Actions.pop()}
          title="精选栏目"
          {/*rightType=""*/}
          {/*rightImageSource={require("../../assets/images/artical_share.png")}*/}
          {/*/!*rightPress={() => Actions.REGIST()}*!/*/}
        </Header>
        <View style={styles.columnsView}>
        <ArticleColumn></ArticleColumn>
        </View>
        <ScrollView>
          <View style={styles.articlesView}>

          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
  columnsView:{
    width:PAGE_WIDTH,
    height:normalizeH(38),
    flexDirection:'column',
    flex:1
  },
  articlesView:{
    flex:1,
    width:PAGE_WIDTH,
  }
})