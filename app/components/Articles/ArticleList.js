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
  InteractionManager,
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
  constructor(props) {
    super(props)
  }




  render() {
    return (
      <View style={styles.container}>
        <Header leftType="icon"
                leftPress={() => Actions.pop()}
                title="精选栏目">
        </Header>
        <View style={styles.columnsView}>
          <ArticleColumn  columnId={this.props.columnId}></ArticleColumn>
        </View>
      </View>
    )
  }
}
// const mapStateToProps = (state, ownProps) => {
//   return{}
// }
// const mapDispatchToProps = (dispatch) => bindActionCreators({
// }, dispatch)
//
// export default connect(mapStateToProps, mapDispatchToProps)(ArticleList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
  columnsView: {
    //width: PAGE_WIDTH,
    // height: normalizeH(38),
    // flexDirection: 'column',
    ...Platform.select({
      ios: {
        marginTop: normalizeH(65),
      },
      android: {
        marginTop: normalizeH(45)
      }
    }),
    flex: 1
  },
  articlesView: {
    flex: 1,
    width: PAGE_WIDTH,
  },
  imageStyle:{
    position:'absolute',
    right: 0,
    // left:330,
    height:normalizeH(35),
    width:normalizeW(35),
    overflow:'hidden',
    top: 0,
    }

})