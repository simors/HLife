/**
 * Created by zachary on 2016/12/13.
 */
import {Map, List, Record} from 'immutable'
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  InteractionManager,
  ListView,
  RefreshControl,
} from 'react-native'
import {connect} from 'react-redux'
import AV from 'leancloud-storage'
import CommonModal from '../common/CommonModal'
import {bindActionCreators} from 'redux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Categorys from '../Articles/Categorys'
import {Actions} from 'react-native-router-flux'
import THEME from '../../constants/themes/theme1'
import {fetchColumn} from '../../action/configAction'
import {getColumn} from '../../selector/configSelector'
import ScrollableTabView, {ScrollableTabBar} from '../common/ScrollableTableView';
import ArticleShow from './ArticleShow'
import {getArticleCollection} from '../../selector/articleSelector'
import {fetchArticle} from '../../action/articleAction'
import {fetchLikers} from '../../action/articleAction'


class ArticleColumn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columnItem: 0,
      columnId: 0,
      modalVisible: false
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchArticle(this.props.columnId)
    })
    this.props.column.map((value, key)=> {
      if (value.columnId == this.props.columnId) {
        this.setState({columnItem: key, columnId: value.columnId})
        // console.log('key==============>',key)
      }
    })

  }

  closeModel(callback) {
    this.setState({
      modalVisible: false
    })
    if(callback && typeof callback == 'function'){
      callback()
    }
  }

  _shopCategoryClick(payload) {
    // if(payload) {
    console.log('payload====>',payload)
      this.closeModel(()=>{
        // Actions.ARTICLES_ARTICLELIST({columnId: columnId})
        this.setState({columnId: payload})
        if (this.props.column) {
          return (
            this.props.column.map((value, key) => {
              if (value.columnId == payload) {
                // console.log('=========<<<<<<<<',value)
                this.setState({columnItem: key})
                this.props.fetchArticle(value.columnId)
              }
            })
          )
        }
      })
    // }else{
    //   this.openModel()
    // }
  }

  openModel(callback) {
    this.setState({
      modalVisible: true
    })
    if(callback && typeof callback == 'function'){
      callback()
    }
  }


  refreshArticleList() {
    InteractionManager.runAfterInteractions(() => {
      //  console.log('ahahahahahahahahah_______',this.state.columnId)
      this.props.fetchArticle(this.state.columnId)
    })
  }

  changeTab(payload) {

    this.setState({columnItem: payload.i})
    if (this.props.column) {
      return (
        this.props.column.map((value, key) => {
          if (key == payload.i) {
            // console.log('=========<<<<<<<<',value)
            this.setState({columnId: value.columnId})
            this.props.fetchArticle(value.columnId)
          }
        })
      )
    }
  }

  renderColumns() {
    if (this.props.column) {
      return (
        this.props.column.map((value, key) => {
            return (
              <View key={key} tabLabel={value.title}
                    style={[styles.itemLayout, this.props.itemLayout && this.props.itemLayout]}>
                {this.renderArticleList(this.state.columnId)}
              </View>
            )
          }
        )
      )
    }
  }

  renderArticleItem(rowData) {
    let value = rowData

    // console.log('value=====>',value)
    return (
      <View
        style={[styles.itemLayout, this.props.itemLayout && this.props.itemLayout]}>
        <ArticleShow {...value}/>
      </View>
    )
  }

  renderArticleList(columnId) {
    let columnArticles = this.props.columnArticles
    //console.log('columnArticles=====>',columnArticles)
    //console.log('columnId=====>',columnId)
    let articles = columnArticles.get(columnId)
    // find(value => {
    //   console.log('columnId=====>',columnId)
    //   console.log('value=====>',value)
    //   console.log('categoryId=====>',value)
    //   return (value.categoryId === 'columnId')
    // })
    // console.log('articles=====>',articles)
    if (!articles) {
      return (
        <View/>
      )
    } else {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
      let articleSource
      articleSource = ds.cloneWithRows(articles.toJS())
      return (
        <ListView dataSource={articleSource}
          //initialListSize = {10}
                  refreshControl={
                    <RefreshControl onRefresh={()=>this.refreshArticleList()} refreshing={false}>
                    </RefreshControl>
                  }
                  renderRow={(rowData) => this.renderArticleItem(rowData)}/>
      )
    }
  }


  renderTabBar() {
    return (
        <ScrollableTabBar
          activeTextColor={'#000000'}
          inactiveTextColor={'#FFFFFF'}
          style={styles.tarBarStyle}
          underlineStyle={styles.tarBarUnderlineStyle}
          textStyle={[styles.tabBarTextStyle, this.props.tabBarTextStyle && this.props.tabBarTextStyle]}
          tabStyle={[styles.tabBarTabStyle, this.props.tabBarTabStyle && this.props.tabBarTabStyle]}
          backgroundColor={this.props.backgroundColor}
        />
    )
  }

  render() {
    if (this.props.column) {
      // console.log('state.columnItem===========',this.state.columnItem)
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#F5FCFF',
        }}>

        <ScrollableTabView style={[styles.body, this.props.body && this.props.body]}
                           page={this.state.columnItem}
                           initialPage={this.state.columnItem}
                           scrollWithoutAnimation={true}
                           renderTabBar={()=> this.renderTabBar()}
                           onChangeTab={(payload) => this.changeTab(payload)}
                           onPressMore={()=>this.openModel(this)}
        >
          {this.renderColumns()}
        </ScrollableTabView>
        <CommonModal
      modalVisible={this.state.modalVisible}
      modalTitle="精选栏目"
      closeModal={() => this.closeModel()}
    >
    <ScrollView >
      <Categorys    onPress={this._shopCategoryClick.bind(this)}/>
    </ScrollView >
      </CommonModal>
            </View>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  let column = getColumn(state)
  let columnArticles = getArticleCollection(state)
  // console.log('columnArticles',columnArticles)
  return {
    column: column,
    columnArticles: columnArticles,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchArticle,

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ArticleColumn)

const styles = StyleSheet.create({
  channelContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  defaultImageStyles: {
    height: normalizeH(35),
    width: normalizeW(35),
  },
  channelWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  channelText: {
    marginTop: 4,
    color: THEME.colors.gray,
    textAlign: 'center'
  },
  body: {
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(64),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#E5E5E5',
  },
  itemLayout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBarTextStyle: {
    fontSize: em(15),
    //  paddingBottom: 10,
    letterSpacing: em(-0.4),
    color: '#686868'
  },
  tarBarStyle: {
    height: normalizeH(38),
    width: normalizeW(330)
  },
  tabBarTabStyle: {
    height: normalizeH(38),
    paddingBottom: em(10),
    // paddingLeft: em(12),
    // paddingRight: em(12),
    paddingTop: em(10)
  },


  tabBarUnderLineStyle: {
    height: 0,
  },

  tabBarStyle: {
    height: normalizeH(38),
    width: normalizeW(339)
  },
  moreColumns: {
    height: normalizeH(20),
    width: normalizeW(20)
  },
  activeTextColor: {
    fontSize: em(17),
    color: '#50E3C2',
    letterSpacing: em(-0.4)
  },
  inactiveTextColor: {
    fontSize: em(15),
    //  paddingBottom: 10,
    letterSpacing: em(-0.4),
    color: '#686868'
  },
  tarBarUnderlineStyle: {
    height: normalizeH(2),
    backgroundColor: '#50E3C2'


  }
})