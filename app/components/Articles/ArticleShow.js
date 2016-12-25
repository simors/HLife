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


export default class ArticleShow extends Component {
  constructor(props) {
    super(props)
  }

  renderArticles() {
    console.log('guolailexiesha',{...this.props})

    if (this.props.articleId) {
      console.log('guolailexiesha',{...this.props})
      let imageCount = this.props.images.length
      switch (imageCount) {
        case 1:
          return (
            <View style={styles.container}>
              <View style={styles.oneImage}>
                <TouchableOpacity onPress={()=> {
                  Actions.ARTICLES_ARTICLE({...this.props})}}>
                <View>
                  <Image style={styles.image} source={{uri: this.props.images[0]}}>

                  </Image>
                </View>
                  </TouchableOpacity>
                <View style={styles.oneArticleInfo}>
                  <TouchableOpacity onPress={()=> {
                    Actions.ARTICLES_ARTICLE({...this.props})}}>
                  <View style={styles.oneTitle}>
                    <Text style={{fontSize:normalizeW(17),color:'#636363'}}>{this.props.title}</Text>
                  </View>
                    </TouchableOpacity>
                  <View style={styles.oneAuthor}>
                    <Image style={{height:normalizeH(30),width:normalizeW(30),overflow:'hidden'}}></Image>
                    <Text style={{fontSize:normalizeW(15),color:'#929292'}}>{this.props.author}</Text>
                  </View>
                  <View style={styles.comment}></View>
                </View>
              </View>
            </View>
          )
          break
        case 2:
          return (
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
          break
        case 3:
          return (
            <View style={styles.container}>
              <View style={styles.threeImageView}>
                <TouchableOpacity onPress={()=> {
                  Actions.ARTICLES_ARTICLE({...this.props})}}>
                  <View style={styles.threeTitle}>
                    <Text style={{fontSize:normalizeW(17),color:'#636363'}}>{this.props.title}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Image style={styles.threeImage} source={{uri: this.props.images[0]}}>
                    </Image>
                    <Image style={styles.threeImage} source={{uri: this.props.images[1]}}>
                    </Image>
                    <Image style={styles.threeImage} source={{uri: this.props.images[2]}}>
                    </Image>
                  </View>
                </TouchableOpacity>
                <View style={styles.threeArticleInfo}>

                  <View ><Text style={{fontSize:normalizeW(15),color:'#929292'}}>{this.props.author}</Text></View>
                  <View style={styles.comments}></View>
                </View>
              </View>
            </View>
          )
          break
      }
    }
  }


  render() {
    return (
      <View style={{marginBottom: normalizeH(15)}}>
        {this.renderArticles()}
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
    oneImage: {
      backgroundColor: '#FFFFFF',
      height: normalizeH(137),
      width: PAGE_WIDTH,
      flexDirection: 'row',
    },
    threeImage: {
      marginTop: normalizeH(10),
      marginLeft: normalizeW(6),
      //marginRight: normalizeW(10),
      marginBottom: normalizeH(10),
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
      flexDirection:'row',
      height: normalizeH(40),
      width: normalizeW(260),
      borderBottomWidth: normalizeW(3),
      borderBottomColor: '#E6E6E6',
    },
    comment: {
      height: normalizeH(40),
      width: normalizeW(150),
    },
    threeArticleInfo:{
      flexDirection:'row',
      width:PAGE_WIDTH,

    },

  }
)
