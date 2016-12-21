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
import {getArticle} from '../../selector/configSelector'
import {fetchArticle} from '../../action/configAction'


 class ArticleList extends Component {
  constructor(props)
  {
    super(props)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchArticle()

    })
  }

   renderArticles() {
     if (this.props.article) {
       return (
         this.props.article.map((value, key) => {
           let imageCount = value.images.size
           return (
             <View key={key} style={styles.channelWrap}>
               <TouchableOpacity onPress={()=> {
                 Actions.ARTICLES_ARTICLELIST({categoryId: value.id})
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

  render(){
    return(
      <View style={styles.container}>
        <Header leftType="icon"
                leftPress={() => Actions.pop()}
                title="精选栏目">
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
const mapStateToProps = (state, ownProps) => {
  let article = getArticle(state, ownProps.categoryId)
  //console.log("new article: ", article)
  return {
    article: article,
  }
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchArticle
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList)

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