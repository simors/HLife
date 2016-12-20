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
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import AV from 'leancloud-storage'
import {bindActionCreators} from 'redux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Categorys from '../Articles/Categorys'
import {Actions} from 'react-native-router-flux'
import THEME from '../../constants/themes/theme1'
import {fetchColumn} from '../../action/configAction'
import {getColumn} from '../../selector/configSelector'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import ArticleShow from './ArticleShow'

class ArticleColumn extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchColumn()

    })
  }



  renderColumns() {
    if (this.props.column) {
      return (
        this.props.column.map((value, key) => {
          return (
            <View key={key} tabLabel={value.title} style={[styles.itemLayout,this.props.itemLayout &&this.props.itemLayout]}>
              <TouchableOpacity onPress={()=> {
                Actions.ARTICLES_ARTICLES()
              }}>
                {/*<Image style={[styles.defaultImageStyles,this.props.imageStyle]} source={{uri: imageUrl}}/>*/}
                <Text >{value.title}</Text>
                <ArticleShow/>
              </TouchableOpacity>
            </View>
          )
        })
      )
    }
  }


  render() {
    return (
      <View style={styles.channelContainer}>
        <ScrollableTabView style={[styles.body,this.props.body &&this.props.body]}
                           initialPage={0}
                           scrollWithoutAnimation={true}
                           renderTabBar={
                             ()=><ScrollableTabBar
                               activeTextColor={this.props.activeTextColor}
                               inactiveTextColor={this.props.inactiveTextColor}
                               style={[styles.tarBarStyle,this.props.tarBarStyle &&this.props.tarBarStyle]}
                               underlineStyle={[styles.tarBarUnderlineStyle,this.props.tarBarUnderlineStyle &&this.props.tarBarUnderlineStyle]}
                               textStyle={[styles.tabBarTextStyle,this.props.tabBarTextStyle &&this.props.tabBarTextStyle]}
                               tabStyle={[styles.tabBarTabStyle,this.props.tabBarTabStyle &&this.props.tabBarTabStyle]}
                               backgroundColor={this.props.backgroundColor}
                             />}
        >
          {this.renderColumns()}
        </ScrollableTabView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let column = getColumn(state)
  return {
    column: column,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchColumn
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ArticleColumn)

const styles = StyleSheet.create({
  channelContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  defaultImageStyles:{
    height:normalizeH(35),
    width:normalizeW(35),
  },
  channelWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow:'hidden'
  },
  channelText: {
    marginTop: 4,
    color:THEME.colors.gray,
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
    fontSize: 16,
    paddingBottom: 10,
  },

  tabBarTabStyle: {
    paddingBottom: 0,
    paddingLeft: 12,
    paddingRight: 12
  },


  tabBarUnderLineStyle: {
    height: 0,
  },

  tabBarStyle: {
    height: 38,
  },
})