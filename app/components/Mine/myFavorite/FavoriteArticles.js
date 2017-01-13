/**
 * Created by lilu on 2017/1/13.
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
  WebView,
  InteractionManager,
} from 'react-native'
import Header from '../../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height


class FavoriteArticles extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <View style={styles.container}>
        <Header headerContainerStyle={styles.header}
                leftType='icon'
                leftPress={() => Actions.pop()}
                title="我的收藏"
                titleStyle={styles.title}>
        </Header>
        <View style={styles.body}>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
 return{}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteArticles)


const styles = StyleSheet.create({
  container:{
    flex:1
  },
  header:{
    backgroundColor:'#F9F9F9'
  },
  title:{
    fontSize:em(17),
    color:'#030303'
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
    flex: 1,
    width: PAGE_WIDTH,
  },
})