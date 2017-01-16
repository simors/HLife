/**
 * Created by lilu on 2017/1/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
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
  ListView,
  RefreshControl,
} from 'react-native'
import Header from '../../common/Header'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {activeUserInfo} from '../../../selector/authSelector'
import {selectUserFavoriteArticles} from '../../../selector/authSelector'
import {fetchFavoriteArticles} from '../../../action/authActions'
import ArticleShow from '../../Articles/ArticleShow'
import {unFavoriteArticle} from '../../../action/articleAction'
import ActionSheet from 'react-native-actionsheet'



const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height


class FavoriteArticles extends Component{
  constructor(props){
    super(props)
    this.state={
      choosenOne: undefined,
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
    //  console.log('asssssssss')

      this.props.fetchFavoriteArticles()
    })

  }



  unfavorite(){

  }
  _handleActionSheetPress(index) {
    if(0 == index) { //取消收藏
      InteractionManager.runAfterInteractions(() => {
        this.props.unFavoriteArticle(this.state.choosenOne)
        this.props.fetchFavoriteArticles()
      })
    }
  }

  show(payload){
   // console.log('asssssssss',payload)

    this.setState({
      choosenOne: payload
    })
   // console.log('asasddddddddd',this.state.choosenOne)

    this.ActionSheet.show()
  }
  renderArticleItem(rowData) {
    let value = rowData

     //console.log('value=====>',value)
    return (
      <View
        style={[styles.itemLayout, this.props.itemLayout && this.props.itemLayout]}>
        <ArticleShow value={value} onLongPress={this.show.bind(this)}/>
      </View>

    )
  }

  refreshArticleList(){
    InteractionManager.runAfterInteractions(() => {
      //  console.log('asssssssss')

      this.props.fetchFavoriteArticles()
    })
  }
  renderArticleList() {
    let articleList = this.props.articleList
    let articles = articleList
    if (!articles) {
      return (
        <View/>
      )
    } else {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
      let articleSource
      articleSource = ds.cloneWithRows(articles)
      return (
        <ListView dataSource={articleSource}
                  refreshControl={
                    <RefreshControl onRefresh={()=>this.refreshArticleList()} refreshing={false}>
                    </RefreshControl>
                  }
                  renderRow={(rowData) => this.renderArticleItem(rowData)}/>
      )

    }
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
          <View style={styles.tabBar}>
            <Text style={{fontSize:em(15),color:'#50E3C2',marginLeft:normalizeW(86)}} >文章</Text>
            <Text style={{fontSize:em(15),color:'#4A4A4A',marginLeft:normalizeW(143)}}>店铺</Text>
          </View>
          <View>
            {this.renderArticleList()}
          </View>
          <ActionSheet
            ref={(o) => this.ActionSheet = o}
            title="是否取消收藏"
            options={['取消收藏', '取消']}
            cancelButtonIndex={1}
            onPress={this._handleActionSheetPress.bind(this)}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let articleList=selectUserFavoriteArticles(state)
  let userInfo = activeUserInfo(state)

  return{
    articleList : articleList,
    userInfo: userInfo
 }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchFavoriteArticles,
  unFavoriteArticle
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
    backgroundColor:'rgba(0,0,0,0.05)'
  },
  tabBar:{
    height:normalizeH(44),
    width:PAGE_WIDTH,
    alignItems:'center',
    flexDirection:'row',
   // justifyContent:'center',
    backgroundColor:'#FFFFFF',
    marginBottom:normalizeH(15),
  },

})