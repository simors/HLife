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
  InteractionManager,
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
import {
  fetchIsUP,
  upArticle,
  unUpArticle,
  fetchCommentsArticle,
  fetchCommentsCount,
  fetchUpCount
} from '../../action/articleAction'
import {getIsUp, getcommentList, getcommentCount, getUpCount} from '../../selector/articleSelector'
import * as Toast from '../common/Toast'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height


class ArticleShow extends Component {
  constructor(props) {
    super(props)
  }
  //
  // componentDidMount() {
  //   // console.log('DidMountisHere-====--------->',this.props)
  //   InteractionManager.runAfterInteractions(() => {
  //     // this.props.fetchLikers(this.props.articleId,this.props.categoryId)//
  //     this.props.fetchUpCount({articleId: this.props.articleId, upType: 'article'})
  //     //this.props.fetchCommentsArticle(this.props.articleId,this.props.categoryId)
  //     this.props.fetchCommentsCount(this.props.articleId, this.props.categoryId)
  //     this.props.fetchIsUP({articleId: this.props.articleId, upType: 'article'})
  //   })
  //
  // }
  //
  // upSuccessCallback() {
  //   InteractionManager.runAfterInteractions(() => {
  //     this.props.fetchUpCount({articleId: this.props.articleId, upType: 'article'})
  //     //this.props.fetchCommentsArticle(this.props.articleId,this.props.categoryId)
  //     this.props.fetchCommentsCount(this.props.articleId, this.props.categoryId)
  //     this.props.fetchIsUP({articleId: this.props.articleId, upType: 'article'})
  //   })
  // }
  //
  // likeErrorCallback(error) {
  //   Toast.show(error.message)
  // }
  //
  // onLikeButton() {
  //   if (this.props.isUp) {
  //     //  console.log('hereiscode')
  //     this.props.unUpArticle({
  //       articleId: this.props.articleId,
  //       upType: 'article',
  //       success: this.upSuccessCallback.bind(this),
  //       error: this.likeErrorCallback
  //     })
  //   }
  //   else {
  //     console.log('hereiscode')
  //     this.props.upArticle({
  //       articleId: this.props.articleId,
  //       upType: 'article',
  //       success: this.upSuccessCallback.bind(this),
  //       error: this.likeErrorCallback
  //     })
  //   }
  // }
  //
  // renderArticles() {
  //   if (this.props.articleId) {
  //     let imageCount = this.props.images.length
  //     // let likeCount = this.props.likers.length
  //     switch (imageCount) {
  //       case 1:
  //         return (
  //           <View style={styles.container}>
  //             <View style={styles.oneImage}>
  //               <TouchableOpacity onPress={()=> {
  //                 Actions.ARTICLES_ARTICLE({...this.props})
  //               }}>
  //                 <View>
  //                   <Image style={styles.image} source={{uri: this.props.images[0]}}>
  //                   </Image>
  //                 </View>
  //               </TouchableOpacity>
  //               <View style={styles.oneArticleInfo}>
  //                 <TouchableOpacity onPress={()=> {
  //                   Actions.ARTICLES_ARTICLE({...this.props})
  //                 }}>
  //                   <View style={styles.oneTitle}>
  //                     <Text style={{fontSize: normalizeW(17), color: '#636363'}}>{this.props.title}</Text>
  //                   </View>
  //                 </TouchableOpacity>
  //                 <View style={styles.oneAuthor}>
  //                   <Image style={{
  //                     height: normalizeH(20),
  //                     width: normalizeW(20),
  //                     overflow: 'hidden',
  //                     borderRadius: normalizeW(10)
  //                   }}
  //                          source={this.props.avatar ? {uri: this.props.avatar} : require("../../assets/images/default_portrait@2x.png")}></Image>
  //                   <Text style={{
  //                     fontSize: normalizeW(15),
  //                     color: '#929292',
  //                     marginLeft: normalizeW(8)
  //                   }}>{this.props.nickname}</Text>
  //                 </View>
  //                 <View style={styles.comment}>
  //                   <TouchableOpacity onPress={()=>this.onLikeButton()}>
  //                     <View style={styles.oneLike}>
  //                       <Image source={this.props.isUp ?
  //                         require("../../assets/images/like_select.png") :
  //                         require("../../assets/images/like_unselect.png")}/>
  //                     </View>
  //                   </TouchableOpacity>
  //                   <Text style={styles.threelikeT}>{this.props.upCount ? this.props.upCount : '0'}</Text>
  //                   {/*<View style={styles.comments}></View>*/}
  //                   <Image source={require('../../assets/images/artical_comments_unselect.png')}></Image>
  //                   <Text style={styles.threelikeT}>{this.props.commentCount ? this.props.commentCount : '0'}</Text>
  //                 </View>
  //               </View>
  //             </View>
  //           </View>
  //         )
  //         break
  //       case 2:
  //         return (
  //           <View style={styles.container}>
  //             <View style={styles.oneImage}>
  //               <View>
  //                 <Image style={styles.image} source={{uri: 'http://img1.3lian.com/2015/a1/53/d/198.jpg'}}>
  //
  //                 </Image>
  //               </View>
  //               <View style={styles.articleInfo}>
  //                 <View style={styles.title}>
  //                   <Text>一生一次的婚礼要搭裙子</Text>
  //                 </View>
  //                 <View style={styles.author}></View>
  //                 <View style={styles.comment}></View>
  //               </View>
  //             </View>
  //           </View>
  //         )
  //         break
  //       case 3:
  //         return (
  //           <View style={styles.container}>
  //             <View style={styles.threeImageView}>
  //               <TouchableOpacity onPress={()=> {
  //                 Actions.ARTICLES_ARTICLE({...this.props})
  //               }}>
  //                 <View >
  //                   <Text style={styles.threeTitle}>{this.props.title}</Text>
  //                 </View>
  //                 <View style={{flexDirection: 'row'}}>
  //                   <Image style={styles.threeImage} source={{uri: this.props.images[0]}}>
  //                   </Image>
  //                   <Image style={styles.threeImage} source={{uri: this.props.images[1]}}>
  //                   </Image>
  //                   <Image style={styles.threeImage} source={{uri: this.props.images[2]}}>
  //                   </Image>
  //                 </View>
  //               </TouchableOpacity>
  //               <View style={styles.threeArticleInfo}>
  //                 <Image style={styles.threeAvatar}
  //                        source={this.props.avatar ? {uri: this.props.avatar} : require("../../assets/images/default_portrait@2x.png")}></Image>
  //                 <Text style={{
  //                   width: normalizeW(180),
  //                   fontSize: normalizeW(15),
  //                   color: '#929292'
  //                 }}>{this.props.nickname}</Text>
  //                 <TouchableOpacity onPress={()=>this.onLikeButton()}>
  //                   <View style={styles.threelike}>
  //                     <Image source={this.props.isUp ?
  //                       require("../../assets/images/like_select.png") :
  //                       require("../../assets/images/like_unselect.png")}/>
  //                   </View>
  //                 </TouchableOpacity>
  //                 <Text style={styles.threelikeT}>{this.props.upCount ? this.props.upCount : '0'}</Text>
  //                 {/*<View style={styles.comments}></View>*/}
  //                 <Image source={require('../../assets/images/artical_comments_unselect.png')}></Image>
  //                 <Text style={styles.threelikeT}>{this.props.commentCount ? this.props.commentCount : '0'}</Text>
  //               </View>
  //             </View>
  //           </View>
  //         )
  //         break
  //     }
  //   }
  // }

  renderArticleV2() {
    if (this.props.articleId) {
      if (this.props.images != undefined) {
        let imageCount = this.props.images.length
        switch (imageCount) {
          case 1:
            return (
              <TouchableOpacity onPress={()=> {Actions.ARTICLES_ARTICLE({...this.props})}}>

              <View style={styles.body1}>
                <Image style={styles.image1} source={{uri: this.props.images[0]}}></Image>
                <View>
                  <Text style={styles.title1} numberOfLines={2}>{this.props.title}</Text>
                  <Text style={styles.abs1} numberOfLines={2}>{this.props.abstract}</Text>
                </View>
              </View>
              </TouchableOpacity>

            )
          case 3:
            return (
              <TouchableOpacity onPress={()=> {Actions.ARTICLES_ARTICLE({...this.props})}}>

              <View style={styles.body3}>
                <Text style={styles.title3} numberOfLines={1}>{this.props.title}</Text>
                <Text style={styles.abs3} numberOfLines={2}>{this.props.abstract}</Text>
                <View style={styles.imageV3}>
                  <Image style={styles.image3} source={{uri: this.props.images[0]}}></Image>
                  <Image style={styles.image3} source={{uri: this.props.images[1]}}></Image>
                  <Image style={styles.image3} source={{uri: this.props.images[2]}}></Image>
                </View>
              </View>
              </TouchableOpacity>

            )
        }
      }
      else {
        //console.log('hereiscode<><><><>')
        return (
          <TouchableOpacity onPress={()=> {Actions.ARTICLES_ARTICLE({...this.props})}}>
          <View style={styles.body0}>
            <Text style={styles.title0} numberOfLines={1}>{this.props.title}</Text>
            <Text style={styles.abs0} numberOfLines={2}>{this.props.abstract}</Text>
          </View>
          </TouchableOpacity>

        )
      }
    }
  }


  render() {
    return (
      <View style={{marginBottom: normalizeH(15)}}>
        {/*{this.renderArticles()}*/}
        {this.renderArticleV2()}
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

 // let commentList = getcommentList(state, ownProps.articleId, ownProps.categoryId)
 // let commentCount = getcommentCount(state, ownProps.articleId, ownProps.categoryId)
 // let upCount = getUpCount(state, ownProps.articleId, ownProps.categoryId)
 // let isUp = getIsUp(state, ownProps.articleId)
 //  return {
 //    commentList: commentList,
 //    upCount: upCount,
 //    isUp: isUp,
 //    commentCount: commentCount
 //  }
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

  //fetchCommentsArticle,
 // fetchCommentsCount,
 // fetchUpCount,
  //fetchIsUP,
 // upArticle,
 // unUpArticle,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ArticleShow)


const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      alignItems: 'stretch',
      backgroundColor: '#F5FCFF'
    },
    oneImage: {
      backgroundColor: '#FFFFFF',
      height: normalizeH(137),
      width: PAGE_WIDTH,
      flexDirection: 'row',
    },
    threeImage: {
      marginLeft: normalizeW(6),
      //marginRight: normalizeW(10),
      height: normalizeH(117),
      width: normalizeW(117),
    },
    image: {
      marginTop: normalizeH(10),
      marginLeft: normalizeW(10),
      //marginRight: normalizeW(10),
      marginBottom: normalizeH(10),
      height: normalizeH(117),
      width: normalizeW(117),
    },
    oneArticleInfo: {
      flex: 1,
      marginTop: normalizeH(10),
      marginLeft: normalizeW(10),
    },
    oneTitle: {
      height: normalizeH(40),
      width: normalizeW(260),
    },
    oneAuthor: {
      flexDirection: 'row',
      height: normalizeH(40),
      width: normalizeW(260),
      borderBottomWidth: normalizeW(1),
      borderBottomColor: '#E6E6E6',
      alignItems: 'center',
    },
    comment: {
      flexDirection: 'row',
      height: normalizeH(40),
      width: normalizeW(240),
      paddingLeft: normalizeW(80),
      //  justifyContent:'center',
      alignItems: 'center',

    },
    threeArticleInfo: {
      // marginLeft:normalizeW(6),
      flexDirection: 'row',
      width: PAGE_WIDTH,
      alignItems: 'center'
    },
    threeAvatar: {
      borderRadius: normalizeW(15),
      height: normalizeH(30),
      width: normalizeW(30),
      overflow: 'hidden',
      marginTop: normalizeH(6),
      marginLeft: normalizeW(6),
      marginRight: normalizeW(6),
      marginBottom: normalizeH(10)
    },
    threeTitle: {
      marginTop: normalizeH(10),
      marginLeft: normalizeW(10),
      marginBottom: normalizeH(12),
      fontSize: normalizeW(17),
      color: '#636363'
    },
    threelike: {
      marginLeft: normalizeW(0),
      marginTop: normalizeH(15),
      marginBottom: normalizeH(13),
      height: normalizeH(22),
      width: normalizeW(25),
    },
    threelikeT: {
      // marginTop: normalizeW(5),
      marginLeft: normalizeW(5),
      marginRight: normalizeW(8),
      width: normalizeW(35),
      color: '#B6B6B6',
      fontSize: em(11),
    },
    oneLike: {
      marginLeft: normalizeW(0),
      marginTop: normalizeH(10),
      marginBottom: normalizeH(13),
      height: normalizeH(22),
      width: normalizeW(25),
    },
    body0:{
     // height:normalizeH(91),
      paddingBottom:normalizeH(12),
      paddingTop:normalizeH(12),
      paddingLeft:normalizeW(12),
      paddingRight:normalizeW(12),
      width:PAGE_WIDTH,
      backgroundColor:'#FFFFFF',
    },
    title0:{
      color:'#4A4A4A',
      marginLeft:normalizeW(2),
      marginRight:normalizeW(2),
      marginBottom:normalizeH(10),
      fontSize:em(17),
      fontWeight:'bold',
      //overflow:'ellipsis',
      letterSpacing:0.2,
    },
    abs0:{
      fontSize:em(15),
      letterSpacing:em(0.2),
      color:'#9B9B9B',
    },
    body1:{
     // height:normalizeH(114),
      width:PAGE_WIDTH,
      backgroundColor:'#FFFFFF',
      flexDirection:'row',
      paddingLeft:normalizeW(12),
      paddingTop:normalizeH(12),
      paddingRight:normalizeW(12),
      paddingBottom:normalizeH(12),
    },
    image1:{
      height:normalizeH(90),
      width:normalizeW(120),
      marginRight:normalizeW(7),
    },
    title1:{
      fontSize:em(17),
      fontWeight:'bold',
      letterSpacing:em(0),
      color:'#4A4A4A',
      marginBottom:normalizeH(10)
    },
    abs1:{
      fontSize:em(15),
      letterSpacing:em(0.2),
      color:'#9B9B9B',
    },
    body3:{
      paddingTop:normalizeH(20),
      paddingBottom:normalizeH(13),
      paddingLeft:normalizeW(12),
      paddingRight:normalizeW(12),
      backgroundColor:'#FFFFFF',

    },
    title3:{
      fontSize:em(17),
      fontWeight:'bold',
      letterSpacing:em(0.2),
      color:'#4A4A4A',
      marginBottom:normalizeH(10)
    },
    abs3:{
      fontSize:em(15),
      letterSpacing:em(0.2),
      color:'#9B9B9B',
      marginBottom:normalizeH(10),
    },
    imageV3:{
      flexDirection:'row',
      alignItems:'center'
    },
    image3:{
      width:normalizeW(115),
      height:normalizeH(76),
      marginRight:normalizeW(3),
    }
  }
)
